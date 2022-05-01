import * as React from "react";
import { Row } from "react-table";
import {
    Project,
    TimeEntryRow,
    useProjectsQuery,
    useWorkTypesQuery,
} from "../../../lib/apollo";

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
