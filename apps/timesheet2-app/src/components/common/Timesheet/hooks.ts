import { DateTime } from "luxon";
import * as React from "react";

import {
    GetorCreateTimesheetMutation,
    GetorCreateTimesheetMutationFn,
    GetTimeEntryRowsQuery,
    GetTimesheetQuery,
    Project,
    useProjectsQuery,
} from "../../../api";

export const useTimesheetDates = (
    timesheetData: GetTimesheetQuery | null | undefined,
    //getorCreateTimesheetMutation: GetorCreateTimesheetMutationFn,
    userId: string
) => {
    const [timesheetDates, setTimesheetDates] = React.useState<DateTime[]>([]);
    const [startDate, setStartDate] = React.useState<DateTime>();
    const [periodLength, setPeriodLength] = React.useState<number>();
    //const [timesheetId, setTimesheetId] = React.useState();

    React.useEffect(() => {
        console.log(timesheetData);
        if (timesheetData) {
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
        } else {
            console.log("refetch");
            // getorCreateTimesheetMutation({
            //     variables: {
            //         timesheet: {
            //             userId: userId,
            //             date: DateTime.now()
            //                 .startOf("day")
            //                 .toUTC()
            //                 .startOf("day")
            //                 .toISO(),
            //         },
            //     },
            // });
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
    const [timesheet, setTimesheet] = React.useState<TimeEntryRowPartial[]>([]);
    React.useEffect(() => {
        if (data) {
            console.log("parsing");
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
            const timeEntryRows: TimeEntryRowPartial[] =
                data.getTimeEntryRows.map((row) => {
                    const newRow = { ...defaultRow, ...row };

                    return {
                        id: newRow.id ?? defaultRow.id,
                        project: newRow.project ?? defaultRow.project,
                        workType: newRow.workType ?? defaultRow.workType,
                        department: newRow.department ?? defaultRow.department,
                        createdAt: newRow.createdAt ?? defaultRow.createdAt,
                        updatedAt: newRow.updatedAt ?? defaultRow.updatedAt,
                        timeEntries: timesheetDates.map((date) => {
                            const timeEntry = row.timeEntries.find(
                                (entry) => entry.date === date.toISO()
                            );
                            const newTimeEntry: TimeEntryPartial = timeEntry
                                ? {
                                      ...timeEntry,
                                      date,
                                  }
                                : {
                                      entryComments: [],
                                      date,
                                      id: "-1",
                                  };

                            return newTimeEntry;
                        }),
                    };
                });
            setTimesheet(timeEntryRows);
        }
    }, [data, userId, timesheetDates]);

    return { timesheet };
};

export const useProjects = (departmentId: string) => {
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [disableProjectSelect, setDisableProjectSelect] =
        React.useState(false);
    const [filteredProjects, setFilteredProjects] = React.useState<Project[]>(
        []
    );
    const [allProjectsLoaded, setAllProjectsLoaded] = React.useState(false);
    const {
        data,
        error: projectsError,
        loading: projectsLoading,
    } = useProjectsQuery();

    React.useEffect(() => {
        if (!departmentId || departmentId === "-1") {
            setDisableProjectSelect(true);
        } else {
            setDisableProjectSelect(false);
        }
    }, [departmentId]);

    React.useEffect(() => {
        setAllProjectsLoaded(false);
        if (data) {
            setProjects((data.projects as Project[]) ?? []);
        }
    }, [data]);

    React.useEffect(() => {
        if (projects.length === 0) return; // Don't filter if there are no projects
        if (departmentId) {
            const filtered = projects.filter(
                (project) => project.department.id === departmentId
            );
            setFilteredProjects(filtered ?? []);
        } else {
            setFilteredProjects(projects ?? []);
        }
        setAllProjectsLoaded(true);
    }, [projects, departmentId]);

    return {
        projects,
        filteredProjects,
        projectsError,
        projectsLoading,
        allProjectsLoaded,
        disableProjectSelect,
    };
};

export const useRowHasHours = (row) => {
    const [hasHours, setHasHours] = React.useState(false);

    React.useEffect(() => {
        if (row) {
            const hasHours = row.timeEntries.some((entry) => entry.id !== "-1");
            setHasHours(hasHours);
        }
    }, [row]);

    return { hasHours };
};
