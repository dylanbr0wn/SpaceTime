import Tippy from "@tippyjs/react";
import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
    createTimesheetLockDispatch,
    deleteTimesheetLockDispatch,
} from "../../../redux/actions/subordinatesActions";

const LockButton = ({
    value,
    row,
    CurrentUserID,
    createTimesheetLockDispatch,
    deleteTimesheetLockDispatch,
}) => {
    return (
        <>
            {value !== "Locked" && (
                <Tippy content="Lock subordinate timesheet">
                    <div className="text-right">
                        <Button
                            variant="outline-secondary"
                            onClick={() =>
                                createTimesheetLockDispatch(
                                    CurrentUserID,
                                    row.original.EmployeeID
                                )
                            }
                            style={{ width: 94 }}
                        >
                            <i
                                style={{ marginRight: 5 }}
                                className="fas fa-unlock"
                            />
                        </Button>
                    </div>
                </Tippy>
            )}
            {value === "Locked" && (
                <Tippy content="Unlock subordinate timesheet">
                    <div className="text-right">
                        <Button
                            onClick={() =>
                                deleteTimesheetLockDispatch(
                                    CurrentUserID,
                                    row.original.EmployeeID
                                )
                            }
                            style={{ width: 94 }}
                        >
                            <i
                                style={{ marginRight: 5 }}
                                className="fas fa-lock"
                            />
                        </Button>
                    </div>
                </Tippy>
            )}
        </>
    );
};

LockButton.propTypes = {
    value: PropTypes.string,
    row: PropTypes.object.isRequired,
    CurrentUserID: PropTypes.number.isRequired,
    createTimesheetLockDispatch: PropTypes.func.isRequired,
    deleteTimesheetLockDispatch: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
    createTimesheetLockDispatch,
    deleteTimesheetLockDispatch,
};

export default connect(null, mapDispatchToProps)(LockButton);
