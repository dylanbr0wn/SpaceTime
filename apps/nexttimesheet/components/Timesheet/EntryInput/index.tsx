import cuid from "cuid";
import { DateTime } from "luxon";
import * as React from "react";

import {
    GetTimeEntriesDocument,
    GetTimeEntriesQuery,
    GetTimeEntriesQueryVariables,
    TimeEntryFromIdDocument,
    TimeEntryFromIdQuery,
    TimeEntryFromIdQueryVariables,
    TimeEntryFromIndexDocument,
    TimeEntryFromIndexQuery,
    TimeEntryFromIndexQueryVariables,
    TimeEntryRow,
    useCreateTimeEntryMutation,
    useDeleteTimeEntryMutation,
    User,
    useUpdateTimeEntryhoursMutation,
} from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";
import CustModal from "../../common/Modal";

import Comments from "./Comments";
import { useTimeEntry } from "./hooks";

/**
 * @name HourEntryInput
 * @component
 * @category Time Entry
 * @description Hour entry input. Provides a input field which takes a number.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetEntryInput = ({
    row,
    date,
    user,
    timesheetId,
    index,
}: {
    row: Partial<TimeEntryRow> | undefined;
    date: DateTime;
    user: Partial<User>;
    timesheetId: string;
    index: number;
}) => {
    // We need to keep and update the state of the cell normally

    const [updateTimeEntryhoursMutation] = useUpdateTimeEntryhoursMutation();
    const [createTimeEntryMutation] = useCreateTimeEntryMutation();
    const [deleteTimeEntryMutation] = useDeleteTimeEntryMutation();

    const [disableEntryInput, setDisableEntryInput] = React.useState(true);

    React.useEffect(() => {
        if (
            !row?.project?.id ||
            row?.project?.id === "-1" ||
            !row?.workType?.id ||
            row?.workType?.id === "-1" ||
            !row?.department?.id ||
            row?.department?.id === "-1"
        ) {
            setDisableEntryInput(true);
        } else {
            setDisableEntryInput(false);
        }
    }, [row]);

    const { timeEntry, setTimeEntry, needsToSave, setIsSaving, setIsEditing } =
        useTimeEntry(row?.id, index);

    const onHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let hours = parseFloat(e.target.value);
        if (isNaN(hours)) hours = 0;
        if (hours > 24 || hours < 0) return;
        setTimeEntry({
            ...timeEntry!,
            hours: hours,
        });
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        if (timeEntry?.id === "-1" && (timeEntry?.hours ?? 0) > 0) {
            createTimeEntryMutation({
                variables: {
                    date: date.toISO(),
                    index,
                    hours: timeEntry?.hours ?? 0,
                    timeEntryRowId: row?.id ?? "-1",
                },
                optimisticResponse: {
                    createTimeEntry: {
                        __typename: "TimeEntry",
                        id: cuid(),
                        date: date.toISO(),
                        createdAt: DateTime.now().toISO(),
                        updatedAt: DateTime.now().toISO(),
                        index,
                        hours: timeEntry?.hours ?? 0,
                        entryComments: [],
                    },
                },
                update: (cache, { data: TimeEntryData }) => {
                    cache.updateQuery<
                        TimeEntryFromIndexQuery,
                        TimeEntryFromIndexQueryVariables
                    >(
                        {
                            query: TimeEntryFromIndexDocument,
                            variables: {
                                timeEntryRowId: row?.id ?? "-1",
                                index,
                            },
                            returnPartialData: true,
                        },
                        (data) => {
                            return {
                                timeEntryFromIndex:
                                    TimeEntryData?.createTimeEntry,
                            };
                        }
                    );

                    cache.updateQuery<
                        GetTimeEntriesQuery,
                        GetTimeEntriesQueryVariables
                    >(
                        {
                            query: GetTimeEntriesDocument,
                            variables: {
                                rowId: row?.id ?? "-1",
                            },
                        },
                        (data) => {
                            const TimeEntry = TimeEntryData?.createTimeEntry;
                            if (!TimeEntry) return data;
                            const timeEntries =
                                data?.getTimeEntryRow?.timeEntries;
                            if (!timeEntries) return data;

                            return {
                                getTimeEntryRow: {
                                    __typename: "TimeEntryRow",
                                    timeEntries: [
                                        ...timeEntries,
                                        {
                                            __typename: "TimeEntry",
                                            id:
                                                TimeEntryData.createTimeEntry
                                                    ?.id ?? "-1",
                                        },
                                    ],
                                },
                            };
                        }
                    );
                },
            });
        } else if (timeEntry?.id !== "-1" && (timeEntry?.hours ?? 0) > 0) {
            if (needsToSave) {
                updateTimeEntryhoursMutation({
                    variables: {
                        updateTimeEntryhoursId: timeEntry?.id ?? "-1",
                        hours: timeEntry?.hours ?? 0,
                    },
                    optimisticResponse: {
                        updateTimeEntryhours: {
                            __typename: "TimeEntry",
                            id: timeEntry?.id ?? "-1",
                            date: timeEntry?.date ?? "",
                            createdAt: timeEntry?.createdAt ?? "",
                            updatedAt: DateTime.now().toISO(),
                            index,
                            hours: timeEntry?.hours ?? 0,
                            entryComments: timeEntry?.entryComments ?? [],
                        },
                    },
                    update: (cache, { data: TimeEntryData }) => {
                        cache.updateQuery<
                            TimeEntryFromIdQuery,
                            TimeEntryFromIdQueryVariables
                        >(
                            {
                                query: TimeEntryFromIdDocument,
                                variables: {
                                    id:
                                        TimeEntryData?.updateTimeEntryhours
                                            ?.id ?? "-1",
                                },
                            },
                            (data) => {
                                return {
                                    timeEntryFromId:
                                        TimeEntryData?.updateTimeEntryhours,
                                };
                            }
                        );
                    },
                });
            }
        } else if (timeEntry?.id !== "-1" && timeEntry?.hours === 0) {
            deleteTimeEntryMutation({
                variables: {
                    deleteTimeEntryId: timeEntry?.id ?? "-1",
                },
                optimisticResponse: {
                    deleteTimeEntry: {
                        __typename: "TimeEntry",
                        id: timeEntry?.id ?? "-1",
                        date: timeEntry?.date ?? "",
                        createdAt: timeEntry?.createdAt ?? "",
                        updatedAt: DateTime.now().toISO(),
                        index,
                        hours: 0,
                    },
                },
                update: (cache, { data: TimeEntryData }) => {
                    cache.modify({
                        id: cache.identify({
                            __typename: "TimeEntry",
                            id: timeEntry?.id ?? "-1",
                        }),
                        fields: {
                            entryComments(_entryComments, { DELETE }) {
                                return DELETE;
                            },
                        },
                    });
                    /**
                     * This invalidates the cache for this query
                     * https://danreynolds.ca/tech/2020/05/04/Apollo-3-Client-Cache/
                     */
                    cache.evict({
                        id: cache.identify({
                            __typename: "TimeEntry",
                            id: timeEntry?.id ?? "-1",
                        }),
                    });
                    cache.gc();
                },
            });
        } else {
            setIsSaving(false);
        }
        setIsEditing(false);
    };

    // when comment change detected, will wait 0.75s to update. If updated before end of 0.75s, timer will restart.

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
        if (!timeEntry) return;

        if (event.ctrlKey || event.metaKey) setIsOpen(true);
    };

    return (
        <>
            <ErrorBoundary>
                <div className=" w-full h-10">
                    <input
                        aria-label="timesheetEntryInput"
                        type="number"
                        onClick={clickHandler}
                        value={
                            !timeEntry?.hours
                                ? ""
                                : timeEntry.hours === 0
                                ? ""
                                : timeEntry.hours
                        }
                        onChange={onHourChange}
                        onBlur={onBlur}
                        onFocus={() => setIsEditing(true)}
                        className={`w-full h-full input input-bordered input-sm bg-base-300 px-2 text-sm ${
                            false || disableEntryInput ? "input-disabled" : ""
                        } ${
                            (timeEntry?.entryComments?.length ?? 0) > 0
                                ? "input-accent"
                                : ""
                        }`}
                        disabled={false || disableEntryInput}
                        step="0.01"
                    />
                </div>
                <CustModal onHide={closeModal} show={isOpen} title="Comments">
                    <Comments
                        timeEntryRowId={row?.id ?? "-1"}
                        timeEntryId={timeEntry?.id ?? "-1"}
                        user={user}
                        closeModal={closeModal}
                        // onCommentChange={onCommentChange}
                        comments={timeEntry?.entryComments ?? []}
                    />
                </CustModal>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetEntryInput;
