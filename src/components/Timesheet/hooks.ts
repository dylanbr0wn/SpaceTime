import { DateTime } from "luxon";
import * as React from "react";
import { useStore } from "../../utils/store";

import { trpc } from "../../utils/trpc";
import { TimeEntryRow } from "../../utils/types/zod";


const defaultRow = {
    id: "-1",
    createdAt: DateTime.now().toISO(),
    updatedAt: DateTime.now().toISO(),
    rowOptions: [],
};

export const useTimesheetDates = (
    timesheetQueryDate: Date,
    authId: string | undefined
) => {
    const [timesheetDates, setTimesheetDates] = React.useState<DateTime[]>([]);
    const [start, setStartDate] = React.useState<DateTime>();
    const [periodLength, setPeriodLength] = React.useState<number>();
    // const [timesheetId, setTimesheetId] = React.useState();


    const { setIsChanged } = useStore(state => ({
        setIsChanged: state.setIsChanged,
    }))

    const { data: timesheetData, isLoading: timesheetLoading } = trpc.useQuery(
        ["timesheet.readFromAuth", {
            authId: String(authId),
            date: timesheetQueryDate,
        }],
        {
            refetchOnWindowFocus: false,
            enabled: !!authId,
        }
    );

    React.useEffect(() => {
        setIsChanged(!!timesheetData?.isChanged);
    }, [timesheetData?.isChanged]);

    React.useEffect(() => {
        // console.log("here");
        if (timesheetData?.period) {
            const endDate = timesheetData?.period?.endDate;
            const startDate =
                timesheetData?.period?.startDate;
            const dates: DateTime[] = [];
            let end: DateTime, _start: DateTime;
            if (typeof endDate === "string") {
                end = DateTime.fromISO(endDate, { zone: "utc" });
            } else {
                end = DateTime.fromJSDate(endDate, { zone: "utc" });
            }
            if (typeof startDate === "string") {
                _start = DateTime.fromISO(startDate, { zone: "utc" });
            } else {
                _start = DateTime.fromJSDate(startDate, { zone: "utc" });
            }

            setPeriodLength(end.diff(_start, "days").days);
            setStartDate(_start);
            let current = _start;
            while (current < end) {
                dates.push(current);
                current = current.plus({ days: 1 });
            }

            setTimesheetDates(dates);
        }
    }, [timesheetData?.period]);

    return {
        timesheetDates,
        startDate: start,
        periodLength,
        timesheetFromDate: timesheetData,
        timesheetLoading,
    };
};

export const useTimesheetColumns = (
    timesheet: {
        timesheetFields: {
            field: {
                id: string,
                name: string
            }
        }[]
    } | undefined
) => {
    const [columns, setColumns] = React.useState<
        { id: string; name: string }[]
    >([]);

    React.useEffect(() => {
        if (timesheet) {
            setColumns(timesheet.timesheetFields.map((field) => field.field));
        }
    }, [timesheet]);

    return { columns };
};

export const useTimesheet = (
    timesheetId: string | undefined,
    timesheetDates: DateTime[]
) => {
    const {
        data,
        isLoading: rowsLoading,
        // error,
    } = trpc.useQuery(["timeEntryRow.readAll", { timesheetId: timesheetId ?? "-1", }], {
        enabled: !!timesheetId,
        refetchOnWindowFocus: false,
    });

    const [timesheet, setTimesheet] = React.useState<(TimeEntryRow & {
        entryRowOptions: {
            id: string;
        }[]
    })[]>([]);
    const memoTimesheet = React.useMemo(() => timesheet, [timesheet]);

    const { setUsedRows } = useStore(state => ({

        setUsedRows: state.setUsedRows,
    }))

    React.useEffect(() => {
        if (data && !rowsLoading) {
            const newUsedRows: { [key: string]: string[] } = {};
            const timeEntryRows = data.map((row) => {
                newUsedRows[row.id] = row.entryRowOptions.map(
                    (option) => option.fieldOption.id
                );
                setUsedRows(newUsedRows);
                return {
                    timesheetId: "",
                    id: row.id ?? defaultRow.id,
                    createdAt: row.createdAt ?? defaultRow.createdAt,
                    updatedAt: row.updatedAt ?? defaultRow.updatedAt,
                    entryRowOptions: row.entryRowOptions ?? [],
                };
            });
            setTimesheet(timeEntryRows);
        }
    }, [data, timesheetDates, rowsLoading]);

    return { memoTimesheet, rowsLoading };
};
