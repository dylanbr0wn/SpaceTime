import { DateTime } from "luxon";
import * as React from "react";

import { useQuery } from "@apollo/client";

import {
    IsChanged,
    TimeEntryRowsQuery,
    TimesheetDocument,
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
    userId: string
) => {
    const [timesheetDates, setTimesheetDates] = React.useState<DateTime[]>([]);
    const [start, setStartDate] = React.useState<DateTime>();
    const [periodLength, setPeriodLength] = React.useState<number>();
    // const [timesheetId, setTimesheetId] = React.useState();

    const { data: timesheetData, loading: timesheetLoading } = useQuery(
        TimesheetDocument,
        {
            variables: {
                userId: String(userId),
                date: timesheetQueryDate,
            },
        }
    );

    React.useEffect(() => {
        IsChanged(timesheetData?.timesheetFromDate?.isChanged);
    }, [timesheetData?.timesheetFromDate?.isChanged]);

    React.useEffect(() => {
        // console.log("here");
        if (timesheetData?.timesheetFromDate?.period) {
            const endDate = timesheetData?.timesheetFromDate?.period?.endDate;
            const startDate =
                timesheetData?.timesheetFromDate?.period?.startDate;
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
    }, [timesheetData?.timesheetFromDate?.period, userId]);

    return {
        timesheetDates,
        startDate: start,
        periodLength,
        timesheetFromDate: timesheetData?.timesheetFromDate,
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
    data: TimeEntryRowsQuery | undefined,
    timesheetDates: DateTime[],

    userId: string
) => {
    const [timesheet, setTimesheet] = React.useState<TimeEntryRow[]>([]);
    const memoTimesheet = React.useMemo(() => timesheet, [timesheet]);

    React.useEffect(() => {
        if (data) {
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
    }, [data, userId, timesheetDates]);

    return { memoTimesheet };
};
