import React, { useEffect, useState } from "react";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import {
    Department,
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    TimeEntryRow,
    useDepartmentsQuery,
    useUpdateTimeEntryRowMutation,
} from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";

// import Tooltip from "../../Tooltip";
import { Column, Row } from "react-table";

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
    column: { id },
    userId,
    timesheetId,
}: {
    value: string;
    row: Partial<TimeEntryRow> | undefined;
    column: Column;
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
                        <div className="w-full relative">
                            <Listbox.Button
                                className={`relative w-full h-10 py-2 pl-3 pr-10  text-left rounded
                                    border border-slate-700
                                     focus:outline-none focus-visible:ring-2 bg-slate-800
                                    focus-visible:ring-opacity-75 focus-visible:ring-white
                                     focus-visible:ring-offset-cyan-300 focus-visible:ring-offset-2
                                      focus-visible:border-cyan-500 sm:text-sm cursor-pointer `}
                            >
                                <span
                                    className={`block truncate ${
                                        department?.name
                                            ? "text-sky-200"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {department?.name ??
                                        "Choose a department..."}
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
                                <Listbox.Options className="absolute z-10 w-full divide-y divide-slate-700 py-1 mt-1 overflow-auto text-base bg-slate-800 border border-slate-700 rounded-md shadow-xl shadow-black/40 max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {departmentsData?.departments.map(
                                        (department) => {
                                            return (
                                                <Listbox.Option
                                                    className={({ active }) =>
                                                        `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                                                            active
                                                                ? "text-white bg-sky-500"
                                                                : "text-sky-400"
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
                    </Listbox>
                )}

                {/* {!loading && */}

                {/* } */}
            </ErrorBoundary>
        </>
    );
};

export default TimesheetDepartmentInput;
