import * as React from "react";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Row } from "@tanstack/react-table";

import {
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    TimeEntryRow,
    useUpdateTimeEntryRowMutation,
    WorkType,
} from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";
import { MyTableGenerics } from "../Table";

import { useWorkTypes } from "./hooks";

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
    userId,
    rows,
    timesheetId,
}: {
    value: string | undefined;
    row: Partial<TimeEntryRow> | undefined;
    rows: Row<MyTableGenerics>[];
    userId: string;
    timesheetId: string;
}) => {
    // We need to keep and update the state of the cell normally
    const [workType, setWorkType] = React.useState<WorkType | null>(null);

    const [showErrorModal, setShowErrorModal] = React.useState(false);

    // const allWorkCodes = useSelector((state) => state.workCodes);

    const { filteredWorkTypes, disableWorkTypeSelect, allWorkTypesUsed } =
        useWorkTypes(rows, row);

    React.useEffect(() => {
        if (allWorkTypesUsed && !showErrorModal) {
            setShowErrorModal(true);
        }
    }, [allWorkTypesUsed, showErrorModal]);

    const [updateTimeEntryRow] = useUpdateTimeEntryRowMutation();

    React.useEffect(() => {
        if (filteredWorkTypes) {
            const workType = filteredWorkTypes.find(
                (type) => type.id === value
            );
            setWorkType(workType ?? null);
        }
    }, [filteredWorkTypes, value]);

    // const departmentID = useSelector(() => row.original.department.id);
    // const dispatch = useDispatch();

    // When changed, dispatch api call and redux action.
    const onChange = (workType: WorkType) => {
        updateTimeEntryRow({
            variables: {
                updateTimeEntryRowId: row?.id ?? "-1",
                workTypeId: workType.id,
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
                        id: row?.project?.id ?? "-1",
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
                        disabled={disableWorkTypeSelect}
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
                                        disableWorkTypeSelect &&
                                        "opacity-50 cursor-not-allowed border-0"
                                    } sm:text-sm cursor-pointer `}
                                >
                                    {workType?.name ?? (
                                        <span
                                            className={`block truncate text-base-content/50`}
                                        >
                                            Choose a work type...
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
                                        {filteredWorkTypes.map((workCode) => {
                                            return (
                                                <Listbox.Option
                                                    className={({ active }) =>
                                                        `cursor-pointer rounded-lg select-none relative py-2 pl-10 pr-4 ${
                                                            active
                                                                ? "text-white bg-primary"
                                                                : "text-primary"
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
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
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

export default TimesheetWorkCodeInput;
