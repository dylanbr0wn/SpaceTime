import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";

import ErrorBoundary from "../../common/ErrorBoundary";
import SavingIcon from "../../common/SavingIcon";

import "../../../style/TimeEntry.css";

/**
 * @name DayCommentInput
 * @component
 * @category Time Entry
 * @description Input for day comments. Provides an icon which can be clicked to provide a popover input.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetDayCommentInput = ({
    dayComment,
    disableModification,
    deleteDayCommentDispatch,
    saveDayCommentDispatch,
    EmployeeID,
    setIsLocked,
    timeEntryPeriodStartDate,
}) => {
    const [savingComment, setSavingComment] = useState(false);
    const [comment, setComment] = useState(dayComment.Comment);
    const [timeoutID, setTimeoutID] = useState(null);
    const [lastTimeout, setLastTimeout] = useState(null);

    useEffect(() => {
        if (lastTimeout === timeoutID) {
            if (comment !== dayComment.comment) {
                setComment(dayComment ? dayComment.Comment : "");
            }
        }
    }, [dayComment, lastTimeout, timeoutID, comment]);

    // Handles updating comment changes. Anything typed will not be saved for 0.75s. Id another request to save is launched before the 0.75s is up, the timer will reset. This helps to not spam api with requests.
    const onCommentChange = ({ target }) => {
        setSavingComment(true);
        if (target.value.length > 255) {
            setSavingComment(false);
            return;
        }
        setComment(target.value);
        if (timeoutID) clearTimeout(timeoutID);
        setTimeoutID(
            setTimeout(async () => {
                setLastTimeout(timeoutID);
                if (target.value) {
                    const res = await saveDayCommentDispatch(
                        { ...dayComment, Comment: target.value },
                        EmployeeID,
                        timeEntryPeriodStartDate
                    );

                    if (!res.success) {
                        if (res.status === 423) {
                            setIsLocked(true);
                        } else {
                            toast.warn(res.data);
                        }
                    }
                } else if (!target.value && dayComment.DayCommentID) {
                    const res = await deleteDayCommentDispatch(
                        dayComment.DayCommentID,
                        EmployeeID,
                        timeEntryPeriodStartDate
                    );
                    if (!res.success) {
                        if (res.status === 423) {
                            setIsLocked(true);
                        } else {
                            toast.warn(res.data);
                        }
                    }
                }

                setSavingComment(false);
            }, 750)
        ); // 750 is the delay in milliseconds.
    };

    const CommentIcon = useMemo(
        () => (
            <div>
                {dayComment.Comment ? (
                    <div
                        className="commentIcon"
                        aria-label="Click to add a comment"
                        title="Click to add a comment"
                    >
                        <i className="fas fa-comment-alt " />
                    </div>
                ) : (
                    <div
                        title="Click to add a comment"
                        className="commentIconGrey"
                        aria-label="Click to add a comment"
                    >
                        <i className="far fa-comment-alt" />
                    </div>
                )}
            </div>
        ),
        [dayComment.Comment]
    );

    return (
        <>
            <ErrorBoundary>
                <Tippy
                    interactive={true}
                    interactiveBorder={5}
                    trigger="click"
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
                                    disabled={disableModification}
                                    type="text"
                                    onChange={onCommentChange}
                                    value={comment || ""}
                                />
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.8rem",
                                        textAlign: "left",
                                    }}
                                >
                                    Comment Length:{" "}
                                    {comment ? comment.length : 0}/255
                                </div>
                            </div>
                        </div>
                    )}
                >
                    {CommentIcon}
                </Tippy>
            </ErrorBoundary>
        </>
    );
};

TimesheetDayCommentInput.propTypes = {
    dayComment: PropTypes.object.isRequired,
    disableModification: PropTypes.bool.isRequired,
    deleteDayCommentDispatch: PropTypes.func.isRequired,
    saveDayCommentDispatch: PropTypes.func.isRequired,
    setIsLocked: PropTypes.func.isRequired,
    EmployeeID: PropTypes.number.isRequired,
    timeEntryPeriodStartDate: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
    deleteDayCommentDispatch,
    saveDayCommentDispatch,
};

export default connect(null, mapDispatchToProps)(TimesheetDayCommentInput);
