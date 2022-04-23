import * as React from "react";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import {
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    useUpdateTimeEntryRowMutation,
    useWorkTypesQuery,
    WorkType,
} from "../../../../api";
import ErrorBoundary from "../../ErrorBoundary";

import "../../../style/TimeEntry.css";

/**
 * @name TimesheetWorkCodeInput
 * @component
 * @category Time Entry
 * @description Input for Work Code.
 * Provides an dropdown menu with filtered options.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetWorkCodeInput = ({
    value,
    row,
    column: { id },
    userId,
    timesheetId,
}) => {
    // We need to keep and update the state of the cell normally
    const [workType, setWorkType] = React.useState<WorkType | null>(null);

    // const allWorkCodes = useSelector((state) => state.workCodes);

    const { data } = useWorkTypesQuery();

    const [updateTimeEntryRow] = useUpdateTimeEntryRowMutation();

    React.useEffect(() => {
        if (data) {
            const workType = data.workTypes.find((type) => type.id === value);
            setWorkType(workType ?? null);
        }
    }, [data, value]);

    // const departmentID = useSelector(() => row.original.department.id);
    // const dispatch = useDispatch();

    // When changed, dispatch api call and redux action.
    const onChange = (workType: WorkType) => {
        updateTimeEntryRow({
            variables: {
                updateTimeEntryRowId: row.original.id,
                workTypeId: workType.id,
            },
            optimisticResponse: {
                updateTimeEntryRow: {
                    __typename: "TimeEntryRow",
                    id: row.original.id,
                    createdAt: row.original.createdAt,
                    updatedAt: row.original.updatedAt,
                    department: {
                        __typename: "Department",
                        id: row.original.department.id,
                    },
                    project: {
                        __typename: "Project",
                        id: row.original.project.id,
                    },
                    workType: {
                        __typename: "WorkType",
                        id: workType.id,
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

    // Set info field for workcode
    // useEffect(() => {
    //     if (data?.workTypes) {
    //         const workCode = data?.workTypes.find((code) => code.id === value);
    //         // if (!workCode) {
    //         //     workCode = data?.workTypes.find((code) => code.WorkCodeID === value);
    //         // }
    //         setStateValue(workCode ?? {});
    //     }
    // }, [value, data]);

    return (
        <>
            <ErrorBoundary>
                <div className="w-full h-full">
                    <Listbox
                        aria-label="Project Input"
                        value={workType}
                        onChange={onChange}
                        // onBlur={onBlur}
                        disabled={false}
                    >
                        <div className="relative h-full">
                            <Listbox.Button
                                className={
                                    "relative w-full py-2 pl-3 pr-10 text-left  focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-cyan-300 focus-visible:ring-offset-2 focus-visible:border-cyan-500 sm:text-sm cursor-pointer"
                                }
                            >
                                <span
                                    className={`block truncate ${
                                        workType?.name
                                            ? "text-sky-200"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {workType?.name ?? "Choose a Work Code..."}
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
                                    {data?.workTypes.map((workCode) => {
                                        return (
                                            <Listbox.Option
                                                className={({ active }) =>
                                                    `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                                                        active
                                                            ? "text-sky-300 bg-slate-700"
                                                            : "text-sky-400"
                                                    }`
                                                }
                                                value={workCode}
                                                key={workCode.id}
                                                //  onSelect={() => setProjectFocused(false)}
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
                                                            {workCode.name}
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
                                    })}
                                    {/* {unusedWorkCodes.map((workCode) => {
                                        return (
                                            <Listbox.Option
                                                className={({ active }) =>
                                                    `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                                                        active
                                                            ? "text-sky-300 bg-slate-700"
                                                            : "text-sky-400"
                                                    }`
                                                }
                                                hidden={type === "user"}
                                                disabled={type === "user"}
                                                value={workCode}
                                                key={workCode.WorkCodeID}
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
                                                                workCode.Description
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
                                    })} */}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetWorkCodeInput;
