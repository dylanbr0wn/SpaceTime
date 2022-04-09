import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import MediaQuery from "react-responsive";
import PropTypes from "prop-types";
import Tippy from "@tippyjs/react";

import { getTimesheetApprovalStatus } from "../../../../services/utils";
import ErrorBoundary from "../../ErrorBoundary";

/**
 * @name ApprovalStatus
 * @component
 * @category Time Entry
 * @description Approval Status display above the Timesheet.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetApprovalStatus = ({ approval, timesheet, type }) => {
    const [status, setStatus] = useState("");
    const [color, setColor] = useState("");
    const [info, setInfo] = useState("");

    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        let entries = [];

        timesheet.map(row => entries.push(...row.dates));
        let submitted =
            entries.find(entry => entry.SubmissionID) || approval.SubmitCount;

        setHasSubmitted(submitted);
    }, [timesheet, approval.SubmitCount]); //Updates status when timesheet has been submitted

    useEffect(() => {
        const { status, color, info } = getTimesheetApprovalStatus(
            approval.ApprovalStatus,
            hasSubmitted,
            approval.ApprovalID
        );
        setStatus(status);
        setColor(color);
        setInfo(info);
    }, [approval.ApprovalStatus, hasSubmitted, approval.ApprovalID]); //Updates status when timesheet has been approved

    return (
        <>
            <ErrorBoundary>
                <div className="text-right">
                    <MediaQuery maxWidth={1279}>
                        <h6 style={{ fontSize: "1rem" }}>
                            Approval Status:{" "}
                            <Tippy content={info}>
                                <span className={color}> {status}</span>
                            </Tippy>
                        </h6>
                        {approval.SubmissionComment && (
                            <Row>
                                <Col>
                                    <>
                                        <div
                                        // style={{
                                        //     width: 400, wordBreak: "break-all",
                                        //     whiteSpace: "normal"
                                        // }}
                                        >
                                            <strong style={{ marginRight: 10 }}>
                                                Submission Comment(Old):
                                            </strong>
                                            {approval.SubmissionComment}
                                        </div>
                                    </>
                                </Col>
                            </Row>
                        )}
                        {status === "Submitted(Old)" && (
                            <p>
                                <em>
                                    This timesheet was submitted on old system.
                                    Needs to be submitted on new system for
                                    approval.
                                </em>
                            </p>
                        )}
                    </MediaQuery>
                    <MediaQuery minWidth={1280}>
                        <h5>
                            Approval Status:
                            <Tippy content={info}>
                                <span className={color}> {status}</span>
                            </Tippy>
                        </h5>
                        {approval.SubmissionComment && (
                            <Row>
                                <Col>
                                    <>
                                        <div
                                        // style={{
                                        //     width: 400, wordBreak: "break-all",
                                        //     whiteSpace: "normal"
                                        // }}
                                        >
                                            <strong style={{ marginRight: 10 }}>
                                                Submission Comment(Old):
                                            </strong>
                                            {approval.SubmissionComment}
                                        </div>
                                    </>
                                </Col>
                            </Row>
                        )}
                        {status === "Submitted(Old)" && (
                            <p>
                                <em>
                                    This timesheet was submitted on old system.
                                    Needs to be submitted on new system for
                                    approval.
                                </em>
                            </p>
                        )}
                    </MediaQuery>

                    {type === "user" && (
                        <>
                            {approval.SupervisorComment && (
                                <Row>
                                    <Col>
                                        <>
                                            <div
                                                style={{
                                                    width: 400,
                                                    wordBreak: "break-all",
                                                    whiteSpace: "normal",
                                                }}
                                            >
                                                <strong
                                                    style={{ marginRight: 10 }}
                                                >
                                                    Manager Comment:
                                                </strong>
                                                {approval.SupervisorComment}
                                            </div>
                                        </>
                                    </Col>
                                </Row>
                            )}
                            {approval.PayrollComment && (
                                <Row>
                                    <Col>
                                        <>
                                            <div
                                                style={{
                                                    width: 400,
                                                    wordBreak: "break-all",
                                                    whiteSpace: "normal",
                                                }}
                                            >
                                                <strong
                                                    style={{ marginRight: 10 }}
                                                >
                                                    Payroll Comment:
                                                </strong>
                                                {approval.PayrollComment}
                                            </div>
                                        </>
                                    </Col>
                                </Row>
                            )}
                        </>
                    )}
                </div>
            </ErrorBoundary>
        </>
    );
};
TimesheetApprovalStatus.propTypes = {
    approval: PropTypes.object.isRequired,
    timesheet: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
};

export default TimesheetApprovalStatus;
