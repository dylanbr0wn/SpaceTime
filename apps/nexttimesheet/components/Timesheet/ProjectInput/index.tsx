import * as React from "react";
import { Row } from "react-table";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import {
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    Project,
    TimeEntryRow,
    useUpdateTimeEntryRowMutation,
} from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";
import { useProjects } from "./hooks";

/**
 * @name TimesheetProjectInput
 * @component
 * @category Time Entry
 * @description Input for Projects
 * Provides an dropdown menu with filtered options.
 * @param {Object} props Props. See propTypes for details.
 */

const TimesheetProjectInput = ({
    value,
    row,
    column: { id },
    userId,
    timesheetId,
    rows,
}: {
    value: string;
    row: Row<Partial<TimeEntryRow>>;
    column: { id: string };
    userId: string;
    timesheetId: string;
    rows: Row<Partial<TimeEntryRow>>[];
}) => {
    // We need to keep and update the state of the cell normally
    const [project, setProject] = React.useState<Project | null>(null);
    // const [foundProject, setFoundProject] = React.useState(true);
    const [updateTimeEntryRow] = useUpdateTimeEntryRowMutation();

    const {
        // projects,
        filteredProjects,
        allProjectsLoaded,
        disableProjectSelect,
    } = useProjects(row, rows);

    React.useEffect(() => {
        if (allProjectsLoaded) {
            const project = filteredProjects.find((proj) => proj.id === value);
            setProject(project ?? null);
            // if (value === "-1") return;
            // setFoundProject(!!project);
        }
    }, [filteredProjects, value, allProjectsLoaded]);

    // When changed, dispatch an apollo query to update the time entry row
    const onChange = (project: Project) => {
        updateTimeEntryRow({
            variables: {
                updateTimeEntryRowId: row?.original?.id ?? "-1",
                projectId: project.id,
                workTypeId: "-1",
            },
            optimisticResponse: {
                updateTimeEntryRow: {
                    __typename: "TimeEntryRow",
                    id: row?.original?.id ?? "-1",
                    createdAt: row.original.createdAt,
                    updatedAt: row.original.updatedAt,
                    department: {
                        __typename: "Department",
                        id: row?.original?.department?.id ?? "-1",
                    },
                    project: {
                        __typename: "Project",
                        id: project.id,
                    },
                    workType: {
                        __typename: "WorkType",
                        id: "-1",
                    },
                },
            },
            update: (cache, { data }) => {
                const newEntryRow = data?.updateTimeEntryRow ?? {};
                const rows = cache.readQuery<
                    GetTimeEntryRowsQuery,
                    GetTimeEntryRowsQueryVariables
                >({
                    query: GetTimeEntryRowsDocument,
                    variables: {
                        timesheetId,
                    },
                });

                const oldRows = rows?.getTimeEntryRows ?? [];

                const newTimeEntryRows = oldRows.map((timeEntryRow) => {
                    if (timeEntryRow.id === row.original.id) {
                        return {
                            ...timeEntryRow,
                            ...newEntryRow,
                        };
                    }
                    return timeEntryRow;
                });

                cache.writeQuery<
                    GetTimeEntryRowsQuery,
                    GetTimeEntryRowsQueryVariables
                >({
                    query: GetTimeEntryRowsDocument,
                    variables: {
                        timesheetId,
                    },
                    data: {
                        getTimeEntryRows: newTimeEntryRows,
                    },
                });
            },
        });
    };

    return (
        <>
            <ErrorBoundary>
                <div className="w-full ">
                    <Listbox
                        aria-label="Project Input"
                        value={project}
                        onChange={onChange}
                        // onBlur={onBlur}
                        disabled={disableProjectSelect}
                    >
                        <div className="relative w-full px-1">
                            <Listbox.Button
                                className={` bg-slate-800 rounded border border-slate-700
                                 relative w-full py-2 pl-3 pr-10 h-10 text-left  focus:outline-none 
                                 focus-visible:ring-2 focus-visible:ring-opacity-75
                                  focus-visible:ring-white focus-visible:ring-offset-cyan-300
                                   focus-visible:ring-offset-2 focus-visible:border-cyan-500
                                    sm:text-sm ${
                                        disableProjectSelect
                                            ? "cursor-not-allowed opacity-50"
                                            : "cursor-pointer"
                                    } `}
                            >
                                <span
                                    className={`block truncate ${
                                        project?.name
                                            ? "text-sky-200"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {project?.name ?? "Choose a Project..."}
                                </span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <SelectorIcon
                                        className="w-5 h-5 text-slate-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={React.Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute border divide-y divide-slate-700 border-slate-700 z-10 w-full py-1 mt-1 overflow-auto text-base bg-slate-800 rounded-md shadow-xl shadow-black/40  max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {filteredProjects.map((project) => {
                                        return (
                                            <Listbox.Option
                                                className={({ active }) =>
                                                    `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                                                        active
                                                            ? "text-white bg-sky-500"
                                                            : "text-sky-400"
                                                    }`
                                                }
                                                value={project}
                                                key={project.id}
                                                //  onSelect={() => setProjectFocused(false)}
                                                hidden={!project.isActive}
                                                disabled={!project.isActive}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${
                                                                selected
                                                                    ? "font-medium"
                                                                    : "font-normal"
                                                            }`}
                                                        >
                                                            {project.name}
                                                        </span>
                                                        {selected ? (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                                <CheckIcon
                                                                    className="w-5 h-5"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        );
                                    })}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetProjectInput;
