import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { Button, ButtonGroup, Col, Dropdown, Form, Row } from "react-bootstrap";
import PropTypes from "prop-types";

import {
    updatePayrollApprovalDispatch,
    updateSupervisorApprovalDispatch,
} from "../../../../redux/actions/approvalActions";
import ErrorBoundary from "../../ErrorBoundary";

/**
 * @name ApprovalInput
 * @component
 * @category Time Entry
 * @description Entry area for approval information.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetApprovalInput = ({
    approval,
    CurrentUserID,
    type,
    EmployeeID,
    updatePayrollApprovalDispatch,
    updateSupervisorApprovalDispatch,
}) => {
    const [supervisorComment, setSupervisorComment] = useState(null);
    const [payrollComment, setPayrollComment] = useState(null);
    const [currentState, setCurrentState] = useState(null);

    const [nextState, setNextState] = useState({
        state: 1,
        action: "Approve Timesheet",
    });

    const approvalStates = useMemo(
        () => ({
            0: {
                name: "Rejected",
                nextStates: [
                    {
                        state: "submitted",
                        action: "Cancel Rejection",
                    },
                ],
            },
            1: {
                name: "Manager Approved",
                nextStates:
                    type === "payroll"
                        ? [
                              {
                                  state: 2,
                                  action: "Approve Timesheet",
                              },
                              {
                                  state: "submitted",
                                  action: "Cancel Manager Approval",
                              },
                          ]
                        : [
                              {
                                  state: "submitted",
                                  action: "Cancel Approval",
                              },
                          ],
            },
            2: {
                name: "Payroll Approved",
                nextStates:
                    type === "payroll"
                        ? [
                              {
                                  state: "submitted",
                                  action: "Cancel Approval",
                              },
                          ]
                        : [],
            },
            submitted: {
                name: "Submitted",
                nextStates: [
                    {
                        state: type === "payroll" ? 2 : 1,
                        action: "Approve Timesheet",
                    },
                    {
                        state: 0,
                        action: "Reject Timesheet",
                    },
                ],
            },
        }),
        [type]
    );

    useEffect(() => {
        if (approval.ApprovalStatus === null) {
            setCurrentState(approvalStates.submitted);
            setNextState(approvalStates.submitted.nextStates[0]);
        } else {
            setCurrentState(approvalStates[approval.ApprovalStatus]);
            setNextState(
                approvalStates[approval.ApprovalStatus].nextStates[0]
                    ? approvalStates[approval.ApprovalStatus].nextStates[0]
                    : { action: "Approved" }
            );
        }

        setPayrollComment(approval.PayrollComment);
        setSupervisorComment(approval.SupervisorComment);
    }, [approval, approvalStates]);

    // Handles changes to the comment fields input.
    const handleCommentChange = ({ target }) => {
        if (type === "manager") setSupervisorComment(target.value);
        else setPayrollComment(target.value);
    };

    // Button name and style variants for different states.
    const buttonVariants = useMemo(
        () => ({
            "Approve Timesheet": "outline-success",
            "Reject Timesheet": "outline-danger",
            "Cancel Rejection": "outline-secondary",
            "Cancel Approval": "outline-secondary",
        }),
        []
    );

    // States of approval and thier list of next states.

    // Handles submitting an approval
    const handleSubmit = () => {
        const newApprovalStatus =
            nextState.state === "submitted" ? null : nextState.state;
        if (type === "manager") {
            const newComment =
                newApprovalStatus === null ? null : supervisorComment;
            updateSupervisorApprovalDispatch(
                EmployeeID,
                CurrentUserID,
                approval.ApprovalID,
                newApprovalStatus,
                newComment
            );
        } else {
            const newComment =
                newApprovalStatus === null ? null : payrollComment;
            updatePayrollApprovalDispatch(
                EmployeeID,
                CurrentUserID,
                approval.ApprovalID,
                newApprovalStatus,
                newComment
            );
        }
    };

    return (
        <>
            <ErrorBoundary>
                {currentState && (
                    <>
                        <div className="float-right">
                            <div style={{ width: 400 }}>
                                <Row>
                                    <Col>
                                        Supervisor Comment:
                                        <Form.Control
                                            as="textarea"
                                            rows="2"
                                            type="text"
                                            onChange={handleCommentChange}
                                            value={
                                                supervisorComment
                                                    ? supervisorComment
                                                    : ""
                                            }
                                            readOnly={
                                                !(
                                                    type === "manager" &&
                                                    approval.ApprovalStatus ===
                                                        null
                                                ) || !approval.ApprovalID
                                            }
                                        />
                                    </Col>
                                    <Col>
                                        Payroll Comment:
                                        <Form.Control
                                            as="textarea"
                                            rows="2"
                                            type="text"
                                            onChange={handleCommentChange}
                                            value={
                                                payrollComment
                                                    ? payrollComment
                                                    : ""
                                            }
                                            readOnly={
                                                !(
                                                    type === "payroll" &&
                                                    (approval.ApprovalStatus ===
                                                        1 ||
                                                        approval.ApprovalStatus ===
                                                            null)
                                                ) || !approval.ApprovalID
                                            }
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div
                                style={{ marginTop: 10 }}
                                className="float-right"
                            >
                                <Dropdown as={ButtonGroup}>
                                    <Button
                                        style={{ marginLeft: 10 }}
                                        onClick={handleSubmit}
                                        variant={
                                            buttonVariants[nextState.action]
                                        }
                                        disabled={
                                            currentState.nextStates.length ===
                                                0 || !approval.ApprovalID
                                        }
                                    >
                                        {nextState.action}
                                    </Button>

                                    <Dropdown.Toggle
                                        disabled={
                                            currentState.nextStates.length ===
                                                0 || !approval.ApprovalID
                                        }
                                        split
                                        variant={
                                            buttonVariants[nextState.action]
                                        }
                                        id="dropdown-split-basic"
                                    />

                                    <Dropdown.Menu>
                                        {currentState.nextStates.map(state => (
                                            <Dropdown.Item
                                                key={state.state}
                                                onClick={() =>
                                                    setNextState(state)
                                                }
                                            >
                                                {state.action}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </>
                )}
            </ErrorBoundary>
        </>
    );
};
TimesheetApprovalInput.propTypes = {
    approval: PropTypes.object.isRequired,
    CurrentUserID: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired, //Will either be user, payroll, or manager.
    EmployeeID: PropTypes.number.isRequired,
    updatePayrollApprovalDispatch: PropTypes.func.isRequired,
    updateSupervisorApprovalDispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        CurrentUserID: state.currentUser.user.EmployeeID,
    };
};

const mapDispatchToProps = {
    updatePayrollApprovalDispatch,
    updateSupervisorApprovalDispatch,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimesheetApprovalInput);
