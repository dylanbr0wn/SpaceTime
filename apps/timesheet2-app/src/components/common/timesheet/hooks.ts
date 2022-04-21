import { DateTime } from "luxon";
import * as React from "react";

import {
    Department,
    MakeMaybe,
    Project,
    ProjectsQueryResult,
    useProjectsQuery,
} from "../../../api";

export const useTimesheetDates = (timesheetData) => {
    const [timesheetDates, setTimesheetDates] = React.useState<DateTime[]>([]);

    React.useEffect(() => {
        if (timesheetData) {
            const dates: DateTime[] = [];
            const endDate = DateTime.fromISO(
                timesheetData?.getorCreateTimesheet?.period.endDate,
                { zone: "utc" }
            );
            const startDate = DateTime.fromISO(
                timesheetData?.getorCreateTimesheet?.period.startDate,
                { zone: "utc" }
            );

            let current = startDate;
            while (current < endDate) {
                dates.push(current);
                current = current.plus({ days: 1 });
            }

            setTimesheetDates(dates);
        }
    }, [timesheetData]);

    return { timesheetDates };
};

export const useTimesheet = (
    data,
    timesheetDates,
    getorCreateTimesheetMutation,
    userId
) => {
    const [timesheet, setTimesheet] = React.useState([]);
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
            };
            const timeEntryRows = data.getTimeEntryRows.map((row) => {
                const newRow = { ...defaultRow, ...row };

                if (!newRow.project) newRow.project = defaultRow.project;
                if (!newRow.workType) newRow.workType = defaultRow.workType;
                if (!newRow.department)
                    newRow.department = defaultRow.department;

                return {
                    ...defaultRow,
                    ...newRow,
                    timeEntries: timesheetDates.map((date) => {
                        const timeEntry = row.timeEntries.find(
                            (entry) => entry.date === date.toISO()
                        );

                        if (timeEntry) {
                            return {
                                ...timeEntry,
                                date,
                            };
                        } else {
                            return {
                                date,
                                id: "-1",
                            };
                        }
                    }),
                };
            });
            setTimesheet(timeEntryRows);
        } else {
            getorCreateTimesheetMutation({
                variables: {
                    timesheet: {
                        userId: userId,
                        date: DateTime.now()
                            .startOf("day")
                            .toUTC()
                            .startOf("day")
                            .toISO(),
                    },
                },
            });
        }
    }, [data, getorCreateTimesheetMutation, userId, timesheetDates]);

    return { timesheet };
};

export const useProjects = (departmentId) => {
    const [projects, setProjects] = React.useState([]);
    const [filteredProjects, setFilteredProjects] = React.useState([]);
    const [allProjectsLoaded, setAllProjectsLoaded] = React.useState(false);
    const {
        data,
        error: projectsError,
        loading: projectsLoading,
    } = useProjectsQuery();

    React.useEffect(() => {
        setAllProjectsLoaded(false);
        if (data) {
            setProjects(data?.projects ?? []);
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
