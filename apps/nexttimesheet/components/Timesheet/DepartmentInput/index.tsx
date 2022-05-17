import React, { useEffect, useState } from "react";

// import Tooltip from "../../Tooltip";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import {
    Department,
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    IsChanged,
    TimeEntryRow,
    useDepartmentsQuery,
    useUpdateTimeEntryRowMutation,
} from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";

/**
 * @name TimesheetDepartmentInput
 * @component
 * @category Time Entry
 * @description Input for Department.
 * Provides an dropdown menu with filtered options.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetDepartmentInput = ({
    value,
    row,
    userId,
    timesheetId,
}: {
    value: string;
    row: Partial<TimeEntryRow> | undefined;
    userId: string;
    timesheetId: string;
}) => {
    // We need to keep and update the state of the cell normally

    const [department, setDepartment] = useState<Department | null>(null);

    const { data: departmentsData } = useDepartmentsQuery();

    const [updateTimeEntryRow] = useUpdateTimeEntryRowMutation();

    // When changed, dispatch api call and redux action.
    const onChange = async (department: Department) => {
        // setDepartment(department);

        updateTimeEntryRow({
            variables: {
                updateTimeEntryRowId: row?.id ?? "-1",
                departmentId: department.id,
                projectId: "-1",
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
                        id: department.id,
                    },
                    project: {
                        __typename: "Project",
                        id: "-1",
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

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        if (departmentsData?.departments) {
            const department = departmentsData.departments.find(
                (dep) => dep.id === value
            );
            setDepartment((department as Department) ?? null);
        }
    }, [value, departmentsData]);
    return (
        <>
            <ErrorBoundary>
                {departmentsData?.departments && (
                    <Listbox
                        aria-label="Department Input"
                        value={department}
                        onChange={onChange}
                        // onBlur={onBlur}
                        disabled={false}
                    >
                        {({ open }) => (
                            <div className="w-full relative">
                                <Listbox.Button
                                    className={`relative text-sm outline outline-offset-2 w-full text-base-content h-10 py-2 pl-3 pr-10 border border-base-content/20 text-left rounded-lg
                                     focus:outline-none focus-visible:ring-2 bg-base-300
                                   ${
                                       open
                                           ? "outline-base-content/20"
                                           : "outline-transparent "
                                   } sm:text-sm cursor-pointer `}
                                >
                                    {department?.name ?? (
                                        <span
                                            className={`block truncate text-base-content/50`}
                                        >
                                            Choose a department...
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
                                        {departmentsData?.departments.map(
                                            (department) => {
                                                return (
                                                    <Listbox.Option
                                                        className={({
                                                            active,
                                                        }) =>
                                                            `cursor-pointer rounded-lg select-none relative py-2 pl-10 pr-4 ${
                                                                active
                                                                    ? "text-white bg-primary"
                                                                    : "text-primary"
                                                            }`
                                                        }
                                                        value={department}
                                                        key={department.id}
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
                                                                    {
                                                                        department.name
                                                                    }
                                                                </span>
                                                                {selected ? (
                                                                    <span
                                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                    >
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
                                            }
                                        )}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        )}
                    </Listbox>
                )}

                {/* {!loading && */}

                {/* } */}
            </ErrorBoundary>
        </>
    );
};

export default TimesheetDepartmentInput;
