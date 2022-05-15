import { DateTime } from "luxon";
import * as React from "react";

import {
    GetTimeEntryRowsQuery,
    GetTimesheetQuery,
    Maybe,
    Project,
    TimeEntry,
    TimeEntryRow,
    useProjectsQuery,
    useWorkTypesQuery,
    WorkType,
} from "../../lib/apollo";

export const useTimesheetDates = (
    timesheetData: GetTimesheetQuery | null | undefined,
    // getorCreateTimesheetMutation: GetorCreateTimesheetMutationFn,
    userId: string
) => {
    const [timesheetDates, setTimesheetDates] = React.useState<DateTime[]>([]);
    const [startDate, setStartDate] = React.useState<DateTime>();
    const [periodLength, setPeriodLength] = React.useState<number>();
    // const [timesheetId, setTimesheetId] = React.useState();

    React.useEffect(() => {
        if (timesheetData?.getTimesheet) {
            const dates: DateTime[] = [];
            const endDate = DateTime.fromISO(
                timesheetData?.getTimesheet?.period.endDate,
                { zone: "utc" }
            );
            const startDate = DateTime.fromISO(
                timesheetData?.getTimesheet?.period.startDate,
                { zone: "utc" }
            );
            setPeriodLength(endDate.diff(startDate, "days").days);
            setStartDate(startDate);
            let current = startDate;
            while (current < endDate) {
                dates.push(current);
                current = current.plus({ days: 1 });
            }

            setTimesheetDates(dates);
        }
    }, [timesheetData, userId]);

    return { timesheetDates, startDate, periodLength };
};

type TimeEntryRowPartial = {
    __typename?: "TimeEntryRow";
    id: string;
    project?: {
        id: string;
    };
    department?: {
        id: string;
    };
    workType?: {
        id: string;
    };
    createdAt?: string;
    updatedAt?: string;
    timeEntries: TimeEntryPartial[];
};

type TimeEntryPartial = {
    __typename?: "TimeEntry";
    id: string;
    date: DateTime;
    createdAt?: string;
    updatedAt?: string;
    hours?: number;
    entryComments: {
        id: string;
    }[];
};

export const useTimesheet = (
    data: GetTimeEntryRowsQuery | undefined,
    timesheetDates: DateTime[],

    userId: string
) => {
    const [timesheet, setTimesheet] = React.useState<Partial<TimeEntryRow>[]>(
        []
    );
    const memoTimesheet = React.useMemo(() => timesheet, [timesheet]);
    React.useEffect(() => {
        if (data) {
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
            const timeEntryRows: Partial<TimeEntryRow>[] =
                data.getTimeEntryRows.map((row) => {
                    const newRow = { ...defaultRow, ...row };

                    return {
                        id: newRow.id ?? defaultRow.id,
                        project: newRow.project ?? defaultRow.project,
                        workType: newRow.workType ?? defaultRow.workType,
                        department: newRow.department ?? defaultRow.department,
                        createdAt: newRow.createdAt ?? defaultRow.createdAt,
                        updatedAt: newRow.updatedAt ?? defaultRow.updatedAt,
                    };
                });
            setTimesheet(timeEntryRows);
        }
    }, [data, userId, timesheetDates]);

    return { timesheet, memoTimesheet };
};
