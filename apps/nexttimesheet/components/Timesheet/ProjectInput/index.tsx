import * as React from "react";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Row } from "@tanstack/react-table";

import {
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    IsChanged,
    Project,
    TimeEntryRow,
    useUpdateTimeEntryRowMutation,
} from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";
import { MyTableGenerics } from "../Table";

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
    timesheetId,
    rows,
}: {
    value: string;
    row: Partial<TimeEntryRow> | undefined;
    timesheetId: string;
    rows: Partial<Row<MyTableGenerics>>[];
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
                updateTimeEntryRowId: row?.id ?? "-1",
                projectId: project.id,
                workTypeId: "-1",
            },
            optimisticResponse: {
                updateTimeEntryRow: {
                    __typename: "TimeEntryRow",
                    id: row?.id ?? "-1",
                    createdAt: row?.createdAt,
                    updatedAt: row?.updatedAt,
                    department: {
                        __typename: "Department",
                        id: row?.department?.id ?? "-1",
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
                    if (timeEntryRow.id === row?.id) {
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
        IsChanged(true);
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
                        {({ open }) => (
                            <div className="relative w-full">
                                <Listbox.Button
                                    className={`relative text-sm outline outline-offset-2 w-full text-base-content h-10 py-2 pl-3 pr-10 border border-base-content/20 text-left rounded-lg
                                     focus:outline-none focus-visible:ring-2 bg-base-300
                                   ${
                                       open
                                           ? "outline-base-content/20"
                                           : "outline-transparent "
                                   } ${
                                        disableProjectSelect &&
                                        "opacity-50 cursor-not-allowed border-0"
                                    } sm:text-sm cursor-pointer `}
                                >
                                    {project?.name ?? (
                                        <span
                                            className={`block truncate text-base-content/50`}
                                        >
                                            Choose a Project...
                                        </span>
                                    )}

                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <SelectorIcon
                                            className="w-5 h-5 text-base-content"
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
                                    <Listbox.Options className="absolute z-10 w-full p-1 mt-1.5 overflow-auto text-base bg-base-300 border border-base-content/20 rounded-lg shadow-xl shadow-black/40 max-h-60 focus:outline-none sm:text-sm">
                                        {filteredProjects.map((project) => {
                                            return (
                                                <Listbox.Option
                                                    className={({ active }) =>
                                                        `cursor-pointer rounded-lg select-none relative py-2 pl-10 pr-4 ${
                                                            active
                                                                ? "text-white bg-primary"
                                                                : "text-primary"
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
                        )}
                    </Listbox>
                </div>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetProjectInput;
