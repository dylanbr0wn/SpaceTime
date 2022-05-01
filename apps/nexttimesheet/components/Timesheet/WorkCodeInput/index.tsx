import * as React from "react";
import { Column, Row } from "react-table";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import {
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    TimeEntryRow,
    useUpdateTimeEntryRowMutation,
    useWorkTypesQuery,
    WorkType,
} from "../../../lib/apollo";
import ConfirmCloseModal from "../../common/ConfirmCloseModal";
import ErrorBoundary from "../../common/ErrorBoundary";
import { useWorkTypes } from "../hooks";

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
    rows,
    timesheetId,
}: {
    value: string;
    row: Row<Partial<TimeEntryRow>>;
    rows: Row<Partial<TimeEntryRow>>[];
    column: Column;
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
                updateTimeEntryRowId: row.original.id ?? "-1",
                workTypeId: workType.id,
            },
            optimisticResponse: {
                updateTimeEntryRow: {
                    __typename: "TimeEntryRow",
                    id: row.original.id ?? "-1",
                    createdAt: row.original.createdAt,
                    updatedAt: row.original.updatedAt,
                    department: {
                        __typename: "Department",
                        id: row.original.department?.id ?? "-1",
                    },
                    project: {
                        __typename: "Project",
                        id: row.original.project?.id ?? "-1",
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

    const renderLoader = () => <p></p>;

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
                        <div className="relative w-full px-1">
                            <Listbox.Button
                                className={` ${
                                    disableWorkTypeSelect
                                        ? "cursor-not-allowed opacity-50"
                                        : "cursor-pointer"
                                } relative w-full bg-slate-800 rounded border border-slate-700 py-2 pl-3 pr-10 h-10 text-left  focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-cyan-300 focus-visible:ring-offset-2 focus-visible:border-cyan-500 sm:text-sm cursor-pointer`}
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
                                <Listbox.Options className="absolute border border-slate-700 z-10 w-full py-1 mt-1 overflow-auto text-base bg-slate-800 divide-y divide-slate-700 rounded-md shadow-xl shadow-black/40  max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {filteredWorkTypes.map((workCode) => {
                                        return (
                                            <Listbox.Option
                                                className={({ active }) =>
                                                    `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                                                        active
                                                            ? "text-white bg-sky-500"
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
                    </Listbox>
                </div>
                {/* <React.Suspense fallback={renderLoader()}>
                    <ConfirmCloseModal
                        onHide={() => {
                            setShowErrorModal(false);
                        }}
                        onConfirm={setShowErrorModal(false)}
                        modalShow={showDeleteConfirmModal}
                        body="You have used all available work types for this project."
                        title={`Error with row (${row.index + 1})`}
                        confirmButtonText="I Understand"
                    />
                </React.Suspense> */}
            </ErrorBoundary>
        </>
    );
};

export default TimesheetWorkCodeInput;
