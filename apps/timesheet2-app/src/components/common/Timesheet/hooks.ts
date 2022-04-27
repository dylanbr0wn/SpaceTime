import { DateTime } from "luxon";
import * as React from "react";
import { Row } from "react-table";

import {
    GetTimeEntryRowsQuery,
    GetTimesheetQuery,
    Project,
    TimeEntryRow,
    useProjectsQuery,
    useWorkTypesQuery,
    WorkType,
} from "../../../api";

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

export const useProjects = (
    currentRow: Row<Partial<TimeEntryRow>>,
    rows: Row<Partial<TimeEntryRow>>[]
) => {
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

    const { data: WorkTypesData } = useWorkTypesQuery();

    // disable project select if department is not set

    React.useEffect(() => {
        if (
            !currentRow?.original?.department?.id ||
            currentRow?.original?.department?.id === "-1"
        ) {
            setDisableProjectSelect(true);
        } else {
            setDisableProjectSelect(false);
        }
    }, [currentRow]);

    React.useEffect(() => {
        setAllProjectsLoaded(false);
        if (data) {
            setProjects((data.projects as Project[]) ?? []);
        }
    }, [data]);

    React.useEffect(() => {
        if (projects.length === 0) return; // Don't filter if there are no projects
        if (currentRow?.original?.department?.id) {
            // if there all the work types for a project are used, dont show the project

            const usedWorkTypes = rows.reduce((acc, row) => {
                /**
                 * So essentially we are going to count how many other times a project has been used.
                 * We know that we cannot add the same work type to a project twice so we know that
                 * the maximum number of appearances of a project is equal to the number of work types.
                 * So.. if the number of appearances is equal to the number of work types, we know that
                 * the project is completely used and can be filtered out. One note is that we need to
                 * make sure to not check the current row.
                 */
                if (
                    row.original?.project?.id &&
                    row.original?.project?.id !== "-1" &&
                    row.index !== currentRow.index
                ) {
                    if (acc[row.original?.project?.id])
                        acc[row.original?.project?.id]++;
                    else acc[row.original?.project?.id] = 1;
                }
                return acc;
            }, {});

            const numberOfWorkTypes = WorkTypesData?.workTypes.length ?? 0;

            const filtered = projects.filter(
                (project) =>
                    project.department.id ===
                        currentRow?.original?.department?.id &&
                    (usedWorkTypes[project.id] ?? 0) < numberOfWorkTypes
            );

            setFilteredProjects(filtered ?? []);
        } else {
            setFilteredProjects(projects ?? []);
        }
        setAllProjectsLoaded(true);
    }, [projects, currentRow, WorkTypesData, rows]);

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

export const useWorkTypes = (
    rows: Row<Partial<TimeEntryRow>>[],
    currentRow: Row<Partial<TimeEntryRow>>
) => {
    const [filteredWorkTypes, setFilteredWorkTypes] = React.useState<
        WorkType[]
    >([]);

    const [disableWorkTypeSelect, setDisableWorkTypeSelect] =
        React.useState(true);

    const [allWorkTypesUsed, setAllWorkTypesUsed] = React.useState(false);

    const { data } = useWorkTypesQuery();

    React.useEffect(() => {
        const currentWorkTypes: string[] = rows
            .filter(
                (row) =>
                    row.index !== currentRow.index &&
                    row?.original?.project?.id ===
                        currentRow?.original?.project?.id
            )

            .map((row) => row?.original?.workType?.id ?? "");
        const workTypes = data?.workTypes ?? [];

        const filteredWorkTypes = workTypes.filter(
            (workType) => !currentWorkTypes.includes(workType.id)
        );
        setFilteredWorkTypes(filteredWorkTypes);
        if (filteredWorkTypes.length === 0 && workTypes.length > 0) {
            setAllWorkTypesUsed(true);
        }
    }, [rows, data, currentRow]);

    React.useEffect(() => {
        if (
            currentRow.original.department &&
            currentRow?.original?.department?.id !== "-1" &&
            currentRow?.original?.project &&
            currentRow?.original?.project?.id !== "-1"
        ) {
            setDisableWorkTypeSelect(false);
        }
    }, [currentRow]);

    return { filteredWorkTypes, disableWorkTypeSelect, allWorkTypesUsed };
};
