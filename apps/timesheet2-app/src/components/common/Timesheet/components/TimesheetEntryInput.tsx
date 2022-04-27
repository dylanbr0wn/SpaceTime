import cuid from "cuid";
import { DateTime } from "luxon";
import * as React from "react";
import { Row } from "react-table";

import { Dialog, Transition } from "@headlessui/react";

import {
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    TimeEntry,
    TimeEntryRow,
    useCreateTimeEntryMutation,
    useDeleteTimeEntryMutation,
    useUpdateTimeEntryhoursMutation,
} from "../../../../api";
import ErrorBoundary from "../../ErrorBoundary";

import "../../../style/TimeEntry.css";

/**
 * @name HourEntryInput
 * @component
 * @category Time Entry
 * @description Hour entry input. Provides a input field which takes a number.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetEntryInput = ({
    value,
    row,
    date,
    userId,
    timesheetId,
}: {
    value: Partial<TimeEntry>;
    row: Row<Partial<TimeEntryRow>>;
    date: DateTime;
    userId: string;
    timesheetId: string;
}) => {
    // We need to keep and update the state of the cell normally

    const [updateTimeEntryhoursMutation] = useUpdateTimeEntryhoursMutation();
    const [createTimeEntryMutation] = useCreateTimeEntryMutation();
    const [deleteTimeEntryMutation] = useDeleteTimeEntryMutation();

    const [work, setWork] = React.useState<Partial<TimeEntry>>(value);
    const [savingComment, setSavingComment] = React.useState(false);
    const [disableEntryInput, setDisableEntryInput] = React.useState(true);

    React.useEffect(() => {
        if (
            !row?.original?.project?.id ||
            row.original?.project?.id === "-1" ||
            !row?.original?.workType?.id ||
            row?.original?.workType?.id === "-1" ||
            !row?.original?.department?.id ||
            row?.original?.department?.id === "-1"
        ) {
            setDisableEntryInput(true);
        } else {
            setDisableEntryInput(false);
        }
    }, [row]);

    const [isEditing, setIsEditing] = React.useState(false); // Is the input field active?
    const [isSaving, setIsSaving] = React.useState(false); // Keep track of saving state

    const onHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hours = parseFloat(e.target.value) ?? 0;
        if (hours > 24 || hours < 0) return;
        setWork({
            ...work,
            hours: hours,
        });
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        setIsSaving(true);
        if (work.id === "-1" && (work?.hours ?? 0) > 0) {
            createTimeEntryMutation({
                variables: {
                    data: {
                        date: date.toISO(),
                        hours: work?.hours ?? 0,
                        timeEntryRowId: row?.original?.id ?? "-1",
                    },
                },
                optimisticResponse: {
                    createTimeEntry: {
                        __typename: "TimeEntry",
                        id: cuid(),
                        date: date.toISO(),
                        createdAt: DateTime.now().toISO(),
                        updatedAt: DateTime.now().toISO(),
                        hours: work?.hours ?? 0,
                        entryComments: [],
                    },
                },
                update: (cache, { data: TimeEntryData }) => {
                    cache.updateQuery<
                        GetTimeEntryRowsQuery,
                        GetTimeEntryRowsQueryVariables
                    >(
                        {
                            query: GetTimeEntryRowsDocument,
                            variables: {
                                timesheetId,
                            },
                        },
                        (data) => {
                            const TimeEntry = TimeEntryData?.createTimeEntry;
                            if (!TimeEntry) return data;
                            const timeEntryRows = data?.getTimeEntryRows;
                            if (!timeEntryRows) return data;

                            return {
                                getTimeEntryRows: timeEntryRows.map(
                                    (timeEntryRow) => {
                                        if (
                                            timeEntryRow.id === row.original.id
                                        ) {
                                            return {
                                                ...timeEntryRow,
                                                timeEntries: [
                                                    ...timeEntryRow.timeEntries,
                                                    TimeEntry,
                                                ],
                                            };
                                        }
                                        return timeEntryRow;
                                    }
                                ),
                            };
                        }
                    );
                },
            });
        } else if (work.id !== "-1" && (work?.hours ?? 0) > 0) {
            if (work.hours !== value.hours) {
                updateTimeEntryhoursMutation({
                    variables: {
                        updateTimeEntryhoursId: work?.id ?? "-1",
                        data: {
                            hours: work?.hours ?? 0,
                        },
                    },
                    update: (cache, { data: TimeEntryData }) => {
                        cache.updateQuery<
                            GetTimeEntryRowsQuery,
                            GetTimeEntryRowsQueryVariables
                        >(
                            {
                                query: GetTimeEntryRowsDocument,
                                variables: {
                                    timesheetId,
                                },
                            },
                            (data) => {
                                if (!TimeEntryData) return data;
                                const TimeEntry =
                                    TimeEntryData.updateTimeEntryhours;
                                if (!TimeEntry) return;
                                const timeEntryRows = data?.getTimeEntryRows;
                                if (!timeEntryRows) return data;

                                return {
                                    getTimeEntryRows: timeEntryRows.map(
                                        (timeEntryRow) => {
                                            if (
                                                timeEntryRow.id ===
                                                row.original.id
                                            ) {
                                                return {
                                                    ...timeEntryRow,
                                                    timeEntries: [
                                                        ...timeEntryRow.timeEntries,
                                                        TimeEntry,
                                                    ],
                                                };
                                            }
                                            return timeEntryRow;
                                        }
                                    ),
                                };
                            }
                        );
                    },
                });
            }
        } else if (work.id !== "-1" && work.hours === 0) {
            deleteTimeEntryMutation({
                variables: {
                    deleteTimeEntryId: work?.id ?? "-1",
                },
                update: (cache, { data: TimeEntryData }) => {
                    cache.updateQuery<
                        GetTimeEntryRowsQuery,
                        GetTimeEntryRowsQueryVariables
                    >(
                        {
                            query: GetTimeEntryRowsDocument,
                            variables: {
                                timesheetId,
                            },
                        },
                        (data) => {
                            const timeEntryRows = data?.getTimeEntryRows ?? [];

                            return {
                                getTimeEntryRows: timeEntryRows.map(
                                    (timeEntryRow) => {
                                        if (
                                            timeEntryRow.id === row.original.id
                                        ) {
                                            return {
                                                ...timeEntryRow,
                                                timeEntries:
                                                    timeEntryRow.timeEntries.filter(
                                                        (entry) =>
                                                            entry.id !== work.id
                                                    ),
                                            };
                                        }
                                        return timeEntryRow;
                                    }
                                ),
                            };
                        }
                    );
                },
            });
            work.id = "-1"; // set to -1 so we know it's deleted
        }
        setIsEditing(false);
    };

    React.useEffect(() => {
        setIsSaving(false);
    }, [value]);

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        if (!isEditing && !isSaving) {
            if (value?.id !== "-1") {
                // If it's not a new entry dont update the state
                setWork(value ?? {});
            }
        }
    }, [value, isEditing, isSaving]);

    // when comment change detected, will wait 0.75s to update. If updated before end of 0.75s, timer will restart.
    const onCommentChange = ({ target }) => {
        if (target.value.length > 255) {
            setSavingComment(false);
        }
    };

    const [isOpen, setIsOpen] = React.useState(false);

    function closeModal() {
        setIsOpen(false);
        // if (comment !== initialValue.Comment) {
        //     updateHourEntry(row.index, {
        //         ...work,
        //         Comment: comment,
        //     });
        // }
    }

    const clickHandler = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!work) return;
        if (event.ctrlKey) setIsOpen(true);
    };

    return (
        <>
            <ErrorBoundary>
                <div className=" w-full px-0.5 h-10">
                    <input
                        aria-label="timesheetEntryInput"
                        type="number"
                        onClick={clickHandler}
                        // value={(hoursWorked === null) ? hoursWorked : ''}
                        value={
                            !work?.hours
                                ? ""
                                : work.hours === 0
                                ? ""
                                : work.hours
                        }
                        onChange={onHourChange}
                        onBlur={onBlur}
                        onFocus={() => setIsEditing(true)}
                        className={`px-1 text-sky-200 w-full h-full bg-slate-800 border rounded border-slate-700 focus:border-sky-500 focus:border ${
                            false || disableEntryInput
                                ? "opacity-50 cursor-not-allowed"
                                : "opacity-100"
                        }  caret-sky-500  ${
                            (value.entryComments?.length ?? 0) > 0
                                ? "border-2 border-green-500"
                                : ""
                        }`}
                        disabled={false || disableEntryInput}
                        step="0.01"
                    />
                </div>
                <Transition appear show={isOpen} as={React.Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        onClose={closeModal}
                    >
                        <div className="min-h-screen px-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-sky-200"
                                    >
                                        Add a comment to your entry...
                                    </Dialog.Title>
                                    <div className="mt-3 flex">
                                        <div className="rounded-full bg-sky-300 h-8 w-8 mr-2 p-1 font-medium text-center"></div>
                                        <input
                                            type="text"
                                            disabled={false}
                                            onChange={onCommentChange}
                                            className="bg-slate-800 outline-none p-1 rounded-r-md rounded-tl-md caret-sky-300 text-sky-300"
                                            value={""}
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-sky-300 bg-slate-800 border border-transparent rounded-md hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
                                            onClick={closeModal}
                                        >
                                            Save my comment
                                        </button>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetEntryInput;
