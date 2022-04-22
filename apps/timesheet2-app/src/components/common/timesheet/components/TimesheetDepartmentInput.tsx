import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import {
    GetorCreateTimesheetDocument,
    GetTimeEntryRowQuery,
    GetTimeEntryRowQueryVariables,
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    useDepartmentsQuery,
    useUpdateTimeEntryRowMutation,
} from "../../../../api";
import ErrorBoundary from "../../ErrorBoundary";
import Tooltip from "../../Tooltip";

import "../../../style/TimeEntry.css";

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
}) => {
    // We need to keep and update the state of the cell normally

    const [department, setDepartment] = useState({});

    const { data: departmentsData, error, loading } = useDepartmentsQuery();

    const [updateTimeEntryRow] = useUpdateTimeEntryRowMutation();

    // When changed, dispatch api call and redux action.
    const onChange = async (department) => {
        // setDepartment(department);
        updateTimeEntryRow({
            variables: {
                updateTimeEntryRowId: row.original.id,
                departmentId: department.id,
                projectId: "-1",
            },
            optimisticResponse: {
                updateTimeEntryRow: {
                    __typename: "TimeEntryRow",
                    id: row.original.id,
                    createdAt: row.original.createdAt,
                    updatedAt: row.original.updatedAt,
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
                        id: row.original.workType.id,
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

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        if (departmentsData?.departments) {
            const department = departmentsData.departments.find(
                (dep) => dep.id === value
            );
            setDepartment(department ?? {});
        }
    }, [value, departmentsData]);
    return (
        <>
            <ErrorBoundary>
                <div className=" w-44">
                    {department && (
                        <Listbox
                            aria-label="Department Input"
                            value={department}
                            onChange={onChange}
                            // onBlur={onBlur}
                            disabled={false}
                        >
                            <div className="relative mt-1">
                                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-cyan-300 focus-visible:ring-offset-2 focus-visible:border-cyan-500 sm:text-sm cursor-pointer ">
                                    <span
                                        className={`block truncate ${
                                            department.name
                                                ? "text-sky-200"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {department.name ??
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
                                    <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-slate-800 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {departmentsData?.departments.map(
                                            (department) => {
                                                return (
                                                    <Listbox.Option
                                                        className={({
                                                            active,
                                                        }) =>
                                                            `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                                                                active
                                                                    ? "text-sky-300 bg-slate-700"
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
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400">
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
                </div>

                {/* {!loading && */}

                {/* } */}
            </ErrorBoundary>
        </>
    );
};

export default TimesheetDepartmentInput;
