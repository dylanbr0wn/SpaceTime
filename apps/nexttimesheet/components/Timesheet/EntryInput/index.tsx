import cuid from "cuid";
import { DateTime } from "luxon";
import * as React from "react";

import { useMutation } from "@apollo/client";

import {
    CreateTimeEntryDocument,
    DeleteTimeEntryDocument,
    IsChanged,
    TimeEntriesDocument,
    TimeEntriesQuery,
    TimeEntriesQueryVariables,
    TimeEntryDocument,
    TimeEntryQuery,
    TimeEntryQueryVariables,
    UpdateTimeEntryhoursDocument,
    UserFromAuthIdQuery,
} from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";
import CustModal from "../../common/Modal";
import { TimeEntryRow } from "../types";

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
    row: TimeEntryRow | undefined;
    date: DateTime;
    user: UserFromAuthIdQuery["userFromAuthId"];
    timesheetId: string;
    index: number;
}) => {
    // We need to keep and update the state of the cell normally

    const [updateTimeEntryhoursMutation] = useMutation(
        UpdateTimeEntryhoursDocument
    );
    const [createTimeEntryMutation] = useMutation(CreateTimeEntryDocument);
    const [deleteTimeEntryMutation] = useMutation(DeleteTimeEntryDocument);

    const [disableEntryInput, setDisableEntryInput] = React.useState(true);

    React.useEffect(() => {
        if ((row?.rowOptions?.length ?? 0) < 3) {
            setDisableEntryInput(true);
        } else {
            setDisableEntryInput(false);
        }
    }, [row]);

    const { timeEntry, setTimeEntry, needsToSave } = useTimeEntry(
        row?.id,
        index,
        row?.rowOptions?.length ?? 0
    );

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
                    cache.updateQuery<TimeEntryQuery, TimeEntryQueryVariables>(
                        {
                            query: TimeEntryDocument,
                            variables: {
                                timeEntryRowId: row?.id ?? "-1",
                                index,
                            },
                            returnPartialData: true,
                        },
                        (data) => {
                            return {
                                timeEntry: TimeEntryData?.createTimeEntry ?? {
                                    __typename: "TimeEntry",
                                    id: cuid(),
                                    date: date.toISO(),
                                    createdAt: DateTime.now().toISO(),
                                    updatedAt: DateTime.now().toISO(),
                                    index,
                                    hours: timeEntry?.hours ?? 0,
                                    entryComments: [],
                                },
                            };
                        }
                    );

                    cache.updateQuery<
                        TimeEntriesQuery,
                        TimeEntriesQueryVariables
                    >(
                        {
                            query: TimeEntriesDocument,
                            variables: {
                                id: row?.id ?? "-1",
                            },
                        },
                        (data) => {
                            const TimeEntry = TimeEntryData?.createTimeEntry;
                            if (!TimeEntry) return data;
                            const timeEntries = data?.timeEntryRow?.timeEntries;
                            if (!timeEntries) return data;

                            return {
                                timeEntryRow: {
                                    __typename: "TimeEntryRow",
                                    timeEntries: [
                                        ...timeEntries,
                                        {
                                            ...TimeEntry,
                                        },
                                    ],
                                },
                            };
                        }
                    );
                },
            });
            IsChanged(true);
        } else if (timeEntry?.id !== "-1" && (timeEntry?.hours ?? 0) > 0) {
            if (needsToSave) {
                updateTimeEntryhoursMutation({
                    variables: {
                        id: timeEntry?.id ?? "-1",
                        hours: timeEntry?.hours ?? 0,
                    },
                    optimisticResponse: {
                        updateTimeEntry: {
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
                            TimeEntryQuery,
                            TimeEntryQueryVariables
                        >(
                            {
                                query: TimeEntryDocument,
                                variables: {
                                    timeEntryRowId: row?.id ?? "-1",
                                    index,
                                },
                            },
                            (data) => {
                                return {
                                    timeEntry:
                                        TimeEntryData?.updateTimeEntry ?? {
                                            __typename: "TimeEntry",
                                            id: cuid(),
                                            date: date.toISO(),
                                            createdAt: DateTime.now().toISO(),
                                            updatedAt: DateTime.now().toISO(),
                                            index,
                                            hours: timeEntry?.hours ?? 0,
                                            entryComments: [],
                                        },
                                };
                            }
                        );
                    },
                });
            }
            IsChanged(true);
        } else if (timeEntry?.id !== "-1" && timeEntry?.hours === 0) {
            deleteTimeEntryMutation({
                variables: {
                    id: timeEntry?.id ?? "-1",
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

                    cache.evict({
                        id: cache.identify({
                            __typename: "TimeEntry",
                            id: timeEntry?.id ?? "-1",
                        }),
                    });
                    cache.gc();
                },
            });
            IsChanged(true);
        } else {
            // setIsSaving(false);
        }
        // setIsEditing(false);
    };

    // when comment change detected, will wait 0.75s to update. If updated before end of 0.75s, timer will restart.

    const [isOpen, setIsOpen] = React.useState(false);

    const closeModal = () => {
        setIsOpen(false);
    };

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
                        // onFocus={() => setIsEditing(true)}
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
