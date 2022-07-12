import cuid from "cuid";
import { DateTime } from "luxon";
import * as React from "react";
import { useStore } from "../../../utils/store";
import { trpc } from "../../../utils/trpc";
import { TimeEntryRow } from "../../../utils/types/zod";
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
    timesheetId,
    index,
    userId,
}: {
    row: TimeEntryRow & {
        entryRowOptions: {
            id: string;
        }[]
    } | undefined;
    date: DateTime;
    timesheetId: string;
    index: number;
    userId: string;
}) => {
    // We need to keep and update the state of the cell normally

    const updateTimeEntryhoursMutation = trpc.useMutation(
        ["timeEntry.update"]
    );
    const createTimeEntryMutation = trpc.useMutation(["timeEntry.create"]);
    const deleteTimeEntryMutation = trpc.useMutation(["timeEntry.delete"]);

    const [disableEntryInput, setDisableEntryInput] = React.useState(true);

    React.useEffect(() => {
        if ((row?.entryRowOptions?.length ?? 0) < 3) {
            setDisableEntryInput(true);
        } else {
            setDisableEntryInput(false);
        }
    }, [row]);

    const { timeEntry, setTimeEntry, needsToSave } = useTimeEntry(
        row?.id,
        index,
        row?.entryRowOptions?.length ?? 0
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

    const { setIsChanged } = useStore(state => ({
        setIsChanged: state.setIsChanged,
    }))

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        if (timeEntry?.id === "-1" && (timeEntry?.hours ?? 0) > 0) {
            createTimeEntryMutation.mutate({

                    date: date.toISO(),
                    index,
                    hours: timeEntry?.hours ?? 0,
                    timeEntryRowId: row?.id ?? "-1",
                });
            setIsChanged(true);
        } else if (timeEntry?.id !== "-1" && (timeEntry?.hours ?? 0) > 0) {
            if (needsToSave) {
                updateTimeEntryhoursMutation.mutate({
                        id: timeEntry?.id ?? "-1",
                        hours: timeEntry?.hours ?? 0,
                    });
            }
            setIsChanged(true);
        } else if (timeEntry?.id !== "-1" && timeEntry?.hours === 0) {
            deleteTimeEntryMutation.mutate({
                    id: timeEntry?.id ?? "-1",
                });
            setIsChanged(true);
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
                        className={`w-full h-full input input-bordered input-sm bg-base-300 px-1.5 2xl:px-2 text-xs 2xl:text-sm ${
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
                        closeModal={closeModal}
                        userId={userId}
                        // onCommentChange={onCommentChange}
                        comments={timeEntry?.entryComments ?? []}
                    />
                </CustModal>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetEntryInput;
