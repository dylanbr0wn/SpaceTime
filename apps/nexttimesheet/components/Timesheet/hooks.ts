import { DateTime } from "luxon";
import * as React from "react";

import {
    IsChanged,
    TimeEntryRow,
    TimeEntryRowsQuery,
    TimesheetQuery,
} from "../../lib/apollo";

export const useTimesheetDates = (
    timesheetData: TimesheetQuery | null | undefined,
    // getorCreateTimesheetMutation: GetorCreateTimesheetMutationFn,
    userId: string
) => {
    const [timesheetDates, setTimesheetDates] = React.useState<DateTime[]>([]);
    const [startDate, setStartDate] = React.useState<DateTime>();
    const [periodLength, setPeriodLength] = React.useState<number>();
    // const [timesheetId, setTimesheetId] = React.useState();

    React.useEffect(() => {
        if (timesheetData?.timesheetFromDate) {
            IsChanged(timesheetData?.timesheetFromDate.isChanged);
            const dates: DateTime[] = [];
            let endDate: DateTime, startDate: DateTime;
            if (
                typeof timesheetData?.timesheetFromDate?.period.endDate ===
                "string"
            ) {
                endDate = DateTime.fromISO(
                    timesheetData?.timesheetFromDate?.period.endDate,
                    { zone: "utc" }
                );
            } else {
                endDate = DateTime.fromJSDate(
                    timesheetData?.timesheetFromDate?.period.endDate,
                    { zone: "utc" }
                );
            }
            if (
                typeof timesheetData?.timesheetFromDate?.period.startDate ===
                "string"
            ) {
                startDate = DateTime.fromISO(
                    timesheetData?.timesheetFromDate?.period.startDate,
                    { zone: "utc" }
                );
            } else {
                startDate = DateTime.fromJSDate(
                    timesheetData?.timesheetFromDate?.period.startDate,
                    { zone: "utc" }
                );
            }

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

export const useTimesheet = (
    data: TimeEntryRowsQuery | undefined,
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
                data.timeEntryRows.map((row) => {
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
