import PropTypes from "prop-types";
import * as React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Dialog, Transition } from "@headlessui/react";

import {
    deleteTimeEntryDispatch,
    saveTimeEntryDispatch,
} from "../../../../redux/actions/timesheetsActions";
import { useDebounce } from "../../../../services/hooks";
import ErrorBoundary from "../../ErrorBoundary";
import SavingIcon from "../../SavingIcon";

import "../../../style/TimeEntry.css";
import { isNumberObject } from "util/types";

/**
 * @name HourEntryInput
 * @component
 * @category Time Entry
 * @description Hour entry input. Provides a input field which takes a number.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetEntryInput = ({
    value: initialValue,
    row,
    columnIndex,
    disableModification,
    // saveTimeEntryDispatch,
    // deleteTimeEntryDispatch,
    setIsLocked,
    EmployeeID,
    timeEntryPeriodStartDate,
    isTablet,
    // projects,
    // departments,
    // workCodes,
}) => {
    // We need to keep and update the state of the cell normally
    const [work, setWork] = React.useState(initialValue);
    const [hoursWorked, setHoursWorked] = React.useState(
        initialValue ? initialValue.HoursWorked : ""
    );

    const projects = useSelector((state) => state.projects);
    const departments = useSelector((state) => state.departments);
    const workCodes = useSelector((state) => state.workCodes);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.currentUser.user);

    const [comment, setComment] = React.useState(
        initialValue ? initialValue.Comment : ""
    );

    const debouncedComment = useDebounce(comment, 750);

    const [timeoutID, setTimeoutID] = React.useState(null);
    const [savingComment, setSavingComment] = React.useState(false);
    const [validTypes, setValidTypes] = React.useState(false);
    const [lastTimeOut, setLastTimeOut] = React.useState(null);

    React.useEffect(() => {
        let rowIsValid = true;

        if (
            row.original.DepartmentID === -1 ||
            row.original.WorkCodeID === -1 ||
            row.original.ProjectID === -1
        )
            rowIsValid = false;

        const Department = departments
            .filter((wc) => wc.IsActive)
            .find((dep) => dep.DepartmentID === row.original.DepartmentID);
        if (!Department) rowIsValid = false;
        const Project = projects
            .filter((wc) => wc.IsActive)
            .find((proj) => proj.ProjectID === row.original.ProjectID);
        if (!Project) rowIsValid = false;

        const WorkCode = workCodes.find(
            (wc) => wc.WorkCodeID === row.original.WorkCodeID
        );
        if (!WorkCode) rowIsValid = false;

        setValidTypes(!rowIsValid);
    }, [
        departments,
        projects,
        row.original.DepartmentID,
        row.original.ProjectID,
        row.original.WorkCodeID,
        workCodes,
    ]);

    const onHourChange = (e) => {
        if (parseFloat(e.target.value) > 24 || parseFloat(e.target.value) < 0)
            return;
        setHoursWorked(e.target.value);
    };

    // Updates time entries with updated hoursworked and comment.
    const updateHourEntry = React.useCallback(
        async (rowIndex, newWork) => {
            // setSkipPageReset(true);
            if (
                parseFloat(newWork.HoursWorked) === 0 ||
                newWork.HoursWorked === ""
            ) {
                const result = await dispatch(
                    deleteTimeEntryDispatch(
                        rowIndex,
                        columnIndex,
                        { ...newWork, Comment: "" },
                        EmployeeID,
                        timeEntryPeriodStartDate
                    )
                );
                if (!result.success) {
                    if (result.status === 423) {
                        setIsLocked(true);
                    } else {
                        toast.warn(result.data);
                    }
                }
            } else {
                const result = await dispatch(
                    saveTimeEntryDispatch(
                        rowIndex,
                        columnIndex,
                        newWork,
                        EmployeeID,
                        timeEntryPeriodStartDate
                    )
                );
                if (!result.success) {
                    if (result.status === 423) {
                        setIsLocked(true);
                    } else {
                        toast.warn(result.data);
                    }
                }
            }
        },
        [
            EmployeeID,
            columnIndex,
            dispatch,
            setIsLocked,
            timeEntryPeriodStartDate,
        ]
    );

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        if (parseFloat(hoursWorked) === 0 && initialValue.HoursWorked === "") {
            setHoursWorked("");
            return;
        }

        if (hoursWorked === initialValue.HoursWorked) return;

        updateHourEntry(row.index, { ...work, HoursWorked: hoursWorked });
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setWork(initialValue);
        setComment(initialValue ? initialValue.Comment : "");
        setHoursWorked(initialValue ? initialValue.HoursWorked : "");
    }, [initialValue, savingComment]);

    // React.useEffect(() => {
    //     if (savingComment) {
    //         updateHourEntry(row.index, {
    //             ...work,
    //             Comment: debouncedComment,
    //         });

    //         setSavingComment(false);
    //     }
    // }, [
    //     debouncedComment,
    //     dispatch,
    //     row.index,
    //     updateHourEntry,
    //     work,
    //     savingComment,
    // ]);

    // when comment change detected, will wait 0.75s to update. If updated before end of 0.75s, timer will restart.
    const onCommentChange = ({ target }) => {
        //setSavingComment(true);
        if (target.value.length > 255) {
            setSavingComment(false);
            return;
        }
        console.log(target.value);
        setComment(target.value);
    };

    const [isOpen, setIsOpen] = React.useState(false);

    function closeModal() {
        setIsOpen(false);
        if (comment !== initialValue.Comment) {
            updateHourEntry(row.index, {
                ...work,
                Comment: comment,
            });
        }
    }

    const clickHandler = (event: MouseEvent) => {
        event.stopPropagation();
        if (!work.TimeEntryID) return;
        if (event.ctrlKey) setIsOpen(true);
    };

    return (
        <>
            <ErrorBoundary>
                {/* {!loading && */}

                {/* <Tippy
                    interactive={true}
                    interactiveBorder={5}
                    delay={tippyDelay}
                    disabled={!hoursWorked}
                    trigger="mouseenter"
                    placement="bottom"
                    render={(attr) => (
                        <div className="shadow" {...attr}>
                            <div>
                                {disableModification ? (
                                    "Comment"
                                ) : (
                                    <>
                                        Add a comment{" "}
                                        <SavingIcon saving={savingComment} />
                                    </>
                                )}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    disabled={disableModification}
                                    onChange={onCommentChange}
                                    style={{}}
                                    value={comment || ""}
                                />
                            </div>
                            <div>
                                <div style={{ fontSize: "0.8rem" }}>
                                    Comment Length:{" "}
                                    {comment ? comment.length : 0}/255
                                </div>
                            </div>
                        </div>
                    )}
                > */}
                <div className="bg-slate-900 w-16 h-10">
                    <input
                        aria-label="timesheetEntryInput"
                        type="number"
                        onClick={clickHandler}
                        // value={(hoursWorked === null) ? hoursWorked : ''}
                        value={hoursWorked === 0 ? "" : hoursWorked}
                        onChange={onHourChange}
                        onBlur={onBlur}
                        className={`px-1 text-sky-200 m-0 appearance-none outline-none w-16  h-10 ${
                            disableModification || validTypes
                                ? "bg-slate-800"
                                : "bg-slate-900"
                        }  caret-sky-500 box-border ${
                            work.Comment ? "border-2 border-green-500" : ""
                        }`}
                        disabled={disableModification || validTypes}
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
                                            {user.FirstName[0] +
                                                user.LastName[0]}
                                        </div>
                                        <input
                                            type="text"
                                            disabled={disableModification}
                                            onChange={onCommentChange}
                                            className="bg-slate-800 outline-none p-1 rounded-r-md rounded-tl-md caret-sky-300 text-sky-300"
                                            value={comment || ""}
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
                {/* </Tippy> */}
                {/* } */}
            </ErrorBoundary>
        </>
    );
};

export default TimesheetEntryInput;
