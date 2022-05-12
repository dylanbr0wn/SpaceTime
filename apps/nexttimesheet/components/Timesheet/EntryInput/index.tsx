import cuid from "cuid";
import { DateTime } from "luxon";
import * as React from "react";

import {
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    TimeEntry,
    TimeEntryRow,
    useCreateTimeEntryMutation,
    useDeleteTimeEntryMutation,
    useUpdateTimeEntryhoursMutation,
} from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";
import CustModal from "../../common/Modal";

import Comments from "./Comments";

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
    value: Partial<TimeEntry> | undefined;
    row: Partial<TimeEntryRow> | undefined;
    date: DateTime;
    userId: string;
    timesheetId: string;
}) => {
    // We need to keep and update the state of the cell normally

    const [updateTimeEntryhoursMutation] = useUpdateTimeEntryhoursMutation();
    const [createTimeEntryMutation] = useCreateTimeEntryMutation();
    const [deleteTimeEntryMutation] = useDeleteTimeEntryMutation();

    const [work, setWork] = React.useState<Partial<TimeEntry> | undefined>(
        value
    );
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
        if (work?.id === "-1" && (work?.hours ?? 0) > 0) {
            createTimeEntryMutation({
                variables: {
                    data: {
                        date: date.toISO(),
                        hours: work?.hours ?? 0,
                        timeEntryRowId: row?.id ?? "-1",
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
                                        if (timeEntryRow.id === row?.id) {
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
        } else if (work?.id !== "-1" && (work?.hours ?? 0) > 0) {
            if (work?.hours !== value?.hours) {
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
                                            if (timeEntryRow.id === row?.id) {
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
        } else if (work?.id !== "-1" && work?.hours === 0) {
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
                                        if (timeEntryRow.id === row?.id) {
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
                            !work?.hours
                                ? ""
                                : work.hours === 0
                                ? ""
                                : work.hours
                        }
                        onChange={onHourChange}
                        onBlur={onBlur}
                        onFocus={() => setIsEditing(true)}
                        className={`w-full h-full input input-bordered input-sm bg-base-300 px-2 text-sm ${
                            false || disableEntryInput ? "input-disabled" : ""
                        } ${
                            (value?.entryComments?.length ?? 0) > 0
                                ? "input-accent"
                                : ""
                        }`}
                        disabled={false || disableEntryInput}
                        step="0.01"
                    />
                </div>
                <CustModal onHide={closeModal} show={isOpen} title="Comments">
                    <Comments
                        timeEntryRowId={row?.id}
                        timeEntryId={work?.id ?? "-1"}
                        userId={userId}
                        closeModal={closeModal}
                        // onCommentChange={onCommentChange}
                        comments={work?.entryComments}
                    />
                </CustModal>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetEntryInput;
