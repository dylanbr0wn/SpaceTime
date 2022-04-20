import * as React from "react";

import { Dialog, Transition } from "@headlessui/react";

import {
    GetTimeEntryRowDocument,
    GetTimeEntryRowsDocument,
    useCreateEntryCommentMutation,
    useDeleteTimeEntryMutation,
    useGetUserFromIdQuery,
    useTimeEntryFromIdQuery,
    useTimeEntryQuery,
    useUpdateTimeEntryhoursMutation,
} from "../../../../api";
import { useDebounce } from "../../../../services/hooks";
import ErrorBoundary from "../../ErrorBoundary";
import SavingIcon from "../../SavingIcon";

import "../../../style/TimeEntry.css";

/**
 * @name HourEntryInput
 * @component
 * @category Time Entry
 * @description Hour entry input. Provides a input field which takes a number.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetEntryInput = ({ value, row, date, userId }) => {
    // We need to keep and update the state of the cell normally

    const [updateTimeEntryhoursMutation] = useUpdateTimeEntryhoursMutation();
    const [createEntryCommentMutation] = useCreateEntryCommentMutation();
    const [deleteTimeEntryMutation] = useDeleteTimeEntryMutation();

    const [work, setWork] = React.useState(value);
    const [savingComment, setSavingComment] = React.useState(false);
    const [validTypes, setValidTypes] = React.useState(false);

    const [isEditing, setIsEditing] = React.useState(false); // Is the input field active?
    const [isSaving, setIsSaving] = React.useState(false); // Keep track of saving state

    const {
        loading: ProfileLoading,
        error: ProfileError,
        data: ProfileData,
    } = useGetUserFromIdQuery({
        variables: {
            getUserFromIdId: parseInt(userId),
        },
    });

    const onHourChange = (e) => {
        let hours = e.target.value ?? 0;
        if (hours.length === 0) hours = 0;
        if (parseFloat(hours) > 24 || parseFloat(hours) < 0) return;
        setWork({
            ...work,
            hours: parseFloat(hours),
        });
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        setIsSaving(true);
        if (work.id === -1 && work.hours > 0) {
            createEntryCommentMutation({
                variables: {
                    data: {
                        date: date.toISO(),
                        hours: work.hours,
                        timeEntryRowId: row.original.id,
                    },
                },
                refetchQueries: [GetTimeEntryRowsDocument],
            });
        } else if (work.id !== -1 && work.hours > 0) {
            if (work.hours !== value.hours) {
                updateTimeEntryhoursMutation({
                    variables: {
                        updateTimeEntryhoursId: work.id,
                        data: {
                            hours: work.hours,
                        },
                    },
                    refetchQueries: [GetTimeEntryRowsDocument],
                });
            }
        } else if (work.id !== -1 && work.hours === 0) {
            deleteTimeEntryMutation({
                variables: {
                    deleteTimeEntryId: work.id,
                },
                refetchQueries: [GetTimeEntryRowsDocument],
            });
            work.id = -1; // set to -1 so we know it's deleted
        }
        setIsEditing(false);
    };

    React.useEffect(() => {
        setIsSaving(false);
    }, [value]);

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        if (!isEditing && !isSaving) {
            if (value.id !== -1) {
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
                <div className="bg-slate-900 w-16 h-10">
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
                        className={`px-1 text-sky-200 m-0 appearance-none outline-none w-16  h-10 ${
                            false || validTypes
                                ? "bg-slate-800"
                                : "bg-slate-900"
                        }  caret-sky-500 box-border ${
                            (value.entryComments?.length ?? 0) > 0
                                ? "border-2 border-green-500"
                                : ""
                        }`}
                        disabled={false || validTypes}
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
                                        <div className="rounded-full bg-sky-300 h-8 w-8 mr-2 p-1 font-medium text-center">
                                            {ProfileData?.getUserFromId?.profile?.firstName?.charAt(
                                                0
                                            ) +
                                                ProfileData?.getUserFromId?.profile?.lastName?.charAt(
                                                    0
                                                )}
                                        </div>
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
