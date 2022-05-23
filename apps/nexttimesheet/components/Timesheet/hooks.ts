import { DateTime } from "luxon";
import * as React from "react";

import { IsChanged, TimeEntryRowsQuery } from "../../lib/apollo";

import { TimeEntryRow } from "./types";

const defaultRow = {
    id: "-1",
    project: {
        id: "-1",
    },
    workType: {
        id: "-1",
    },
    department: {
        id: "-1",
    },
    createdAt: DateTime.now().toISO(),
    updatedAt: DateTime.now().toISO(),
};

export const useTimesheetDates = (
    // timesheetData: TimesheetQuery | null | undefined,
    endDate: Date | string | undefined,
    startDate: Date | string | undefined,
    isChanged: boolean | undefined,
    // getorCreateTimesheetMutation: GetorCreateTimesheetMutationFn,
    userId: string
) => {
    const [timesheetDates, setTimesheetDates] = React.useState<DateTime[]>([]);
    const [start, setStartDate] = React.useState<DateTime>();
    const [periodLength, setPeriodLength] = React.useState<number>();
    // const [timesheetId, setTimesheetId] = React.useState();

    React.useEffect(() => {
        IsChanged(isChanged);
    }, [isChanged]);

    React.useEffect(() => {
        if (startDate && endDate) {
            const dates: DateTime[] = [];
            let end: DateTime, start: DateTime;
            if (typeof endDate === "string") {
                end = DateTime.fromISO(endDate, { zone: "utc" });
            } else {
                end = DateTime.fromJSDate(endDate, { zone: "utc" });
            }
            if (typeof startDate === "string") {
                start = DateTime.fromISO(startDate, { zone: "utc" });
            } else {
                start = DateTime.fromJSDate(startDate, { zone: "utc" });
            }

            setPeriodLength(end.diff(start, "days").days);
            setStartDate(start);
            let current = start;
            while (current < end) {
                dates.push(current);
                current = current.plus({ days: 1 });
            }

            setTimesheetDates(dates);
        }
    }, [startDate, endDate, userId]);

    return { timesheetDates, startDate: start, periodLength };
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
            const timeEntryRows = data.timeEntryRows.map((row) => {
                return {
                    id: row.id ?? defaultRow.id,
                    project: row.project ?? defaultRow.project,
                    workType: row.workType ?? defaultRow.workType,
                    department: row.department ?? defaultRow.department,
                    createdAt: row.createdAt ?? defaultRow.createdAt,
                    updatedAt: row.updatedAt ?? defaultRow.updatedAt,
                };
            });
            setTimesheet(timeEntryRows);
        }
    }, [data, userId, timesheetDates]);

    return { timesheet, memoTimesheet };
};
