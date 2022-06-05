import { DateTime } from "luxon";
import * as React from "react";

import { useQuery } from "@apollo/client";

import {
    IsChanged,
    TimeEntryRowsDocument,
    TimesheetFromAuthDocument,
    TimesheetQuery,
    usedRows as usedRowsVar,
    usedRowsType,
} from "../../lib/apollo";

import { TimeEntryRow } from "./types";

const defaultRow = {
    id: "-1",
    createdAt: DateTime.now().toISO(),
    updatedAt: DateTime.now().toISO(),
    rowOptions: [],
};

export const useTimesheetDates = (
    timesheetQueryDate: string,
    authId: string | undefined
) => {
    const [timesheetDates, setTimesheetDates] = React.useState<DateTime[]>([]);
    const [start, setStartDate] = React.useState<DateTime>();
    const [periodLength, setPeriodLength] = React.useState<number>();
    // const [timesheetId, setTimesheetId] = React.useState();

    const { data: timesheetData, loading: timesheetLoading } = useQuery(
        TimesheetFromAuthDocument,
        {
            variables: {
                authId: String(authId),
                date: timesheetQueryDate,
            },
            skip: !authId,
        }
    );

    React.useEffect(() => {
        IsChanged(timesheetData?.timesheetFromAuthId?.isChanged);
    }, [timesheetData?.timesheetFromAuthId?.isChanged]);

    React.useEffect(() => {
        // console.log("here");
        if (timesheetData?.timesheetFromAuthId?.period) {
            const endDate = timesheetData?.timesheetFromAuthId?.period?.endDate;
            const startDate =
                timesheetData?.timesheetFromAuthId?.period?.startDate;
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
    }, [timesheetData?.timesheetFromAuthId?.period]);

    return {
        timesheetDates,
        startDate: start,
        periodLength,
        timesheetFromDate: timesheetData?.timesheetFromAuthId,
        timesheetLoading,
    };
};

export const useTimesheetColumns = (
    timesheet: TimesheetQuery["timesheetFromDate"] | undefined
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
        loading: rowsLoading,
        // error,
    } = useQuery(TimeEntryRowsDocument, {
        variables: {
            timesheetId: timesheetId ?? "-1",
        },
        skip: !timesheetId,
    });

    const [timesheet, setTimesheet] = React.useState<TimeEntryRow[]>([]);
    const memoTimesheet = React.useMemo(() => timesheet, [timesheet]);

    React.useEffect(() => {
        if (data?.timeEntryRows && !rowsLoading) {
            const newUsedRows: usedRowsType = {};
            const timeEntryRows = data.timeEntryRows.map((row) => {
                newUsedRows[row.id] = row.rowOptions.map(
                    (option) => option.fieldOption.id
                );
                usedRowsVar(newUsedRows);
                return {
                    id: row.id ?? defaultRow.id,
                    createdAt: row.createdAt ?? defaultRow.createdAt,
                    updatedAt: row.updatedAt ?? defaultRow.updatedAt,
                    rowOptions: row.rowOptions ?? [],
                };
            });
            setTimesheet(timeEntryRows);
        }
    }, [data, timesheetDates, rowsLoading]);

    return { memoTimesheet, rowsLoading };
};
