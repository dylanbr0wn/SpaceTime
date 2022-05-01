import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "../style/UserAdmin.css";
import { connect } from "react-redux";
import Timesheet from "../common/timesheet/Timesheet";
import { timesheetInital } from "../../redux/reducers/initialState";
import {
    readPayrollSubordinatesDispatch,
    createTimesheetLockDispatch,
    deleteTimesheetLockDispatch,
} from "../../redux/actions/subordinatesActions";
import { useParams, useHistory } from "react-router-dom";
import ErrorBoundary from "../common/ErrorBoundary";
import PropTypes from "prop-types";
import moment from "moment";
import CustModal from "../common/Modal";

/**
 * @name ManagerTimesheet
 * @component
 * @category Time Entry
 * @description Manager view of subordinate timesheet.
 * @param {Object} props Props. See propTypes for details.
 */
const PayrollTimesheet = ({
    timesheet,
    createTimesheetLockDispatch,
    deleteTimesheetLockDispatch,
    SupervisorID,
    tableRows,
    subordinates,
    readPayrollSubordinatesDispatch,
    settings,
}) => {
    const { id } = useParams();
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [nextUserUp, setNextUserUp] = useState(null);
    const [nextUserDown, setNextUserDown] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [showLockModal, setShowLockModal] = useState(false);
    const [timeoutID, setTimeoutID] = useState(null);

    // Lock timesheet when arriving on page, unlock timesheet when leaving.
    useEffect(() => {
        if (!isLocked) {
            createTimesheetLockDispatch(SupervisorID, id);
            setIsLocked(true);
        }
        return () => {
            if (isLocked) {
                deleteTimesheetLockDispatch(SupervisorID, id);
            }
        };
    }, [
        SupervisorID,
        id,
        isLocked,
        createTimesheetLockDispatch,
        deleteTimesheetLockDispatch,
    ]);

    useEffect(() => {
        return () => {
            if (timeoutID) {
                clearTimeout(timeoutID);
            }
        };
    }, [timeoutID]);

    useEffect(() => {
        if (subordinates.length > 0) {
            //If subordinates exist, find selected user from url param and set them as the current user for the timesheet.
            subordinates.forEach((sub) => {
                if (sub.user.EmployeeID === parseInt(id)) {
                    setUser(sub);
                }
            });
            tableRows.forEach((row, i) => {
                // Finds the correct users for the forwards/backwards user button functionality.
                if (row.EmployeeID === parseInt(id)) {
                    const nextIndex = i === tableRows.length - 1 ? 0 : i + 1;
                    const lastIndex = i === 0 ? tableRows.length - 1 : i - 1;
                    setNextUserUp(tableRows[lastIndex]);
                    setNextUserDown(tableRows[nextIndex]);
                }
            });
        } else {
            readPayrollSubordinatesDispatch(
                SupervisorID,
                moment.utc(settings.CutOffDate).toDate()
            );
        }
    }, [
        id,
        tableRows,
        subordinates,
        SupervisorID,
        settings.CutOffDate,
        readPayrollSubordinatesDispatch,
    ]);

    useEffect(() => {
        if (user) {
            if (user.user.EmployeeID) {
                setLoaded(true);
                setTimeoutID(
                    setTimeout(() => {
                        setShowLockModal(true);
                    }, 1000 * 60 * 58)
                );
            }
        }
    }, [user]);

    const SubmitButton = () => {
        return (
            <Button onClick={() => window.location.reload()}>Refresh</Button>
        );
    };

    return (
        <Container fluid className="userContainer bg-light">
            <ErrorBoundary>
                <Row>
                    <Col>
                        <Button
                            onClick={() =>
                                history.push("/payrollTimesheetDashboard")
                            }
                            style={{ marginBottom: 10 }}
                        >
                            <i
                                style={{ marginRight: 5, marginLeft: 10 }}
                                className="fas fa-arrow-left"
                            />{" "}
                            Payroll Timesheet Dashboard
                        </Button>
                    </Col>
                    <Col className="text-right">
                        <i
                            style={{
                                marginRight: 5,
                                marginLeft: 10,
                                marginTop: 20,
                            }}
                            className="fas fa-lock"
                        />{" "}
                        Timesheet is locked
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {loaded && (
                            <Timesheet
                                userInfo={user}
                                timesheet={{
                                    ...timesheetInital,
                                    ...timesheet[id],
                                }}
                                type="payroll"
                            />
                        )}
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col>
                        {nextUserUp && (
                            <Button
                                style={{ color: "#233746" }}
                                variant="link"
                                onClick={() => {
                                    history.push(
                                        `/timesheet/${nextUserUp.EmployeeID}/payroll`
                                    );
                                }}
                            >
                                <i
                                    style={{
                                        color: "#233746",
                                        marginRight: 10,
                                    }}
                                    className="fas fa-chevron-left"
                                />
                                {nextUserUp.FirstName +
                                    " " +
                                    nextUserUp.LastName}
                            </Button>
                        )}
                    </Col>
                    <Col>
                        {nextUserDown && (
                            <Button
                                className="float-right"
                                variant="link"
                                onClick={() => {
                                    history.push(
                                        `/timesheet/${nextUserDown.EmployeeID}/payroll`
                                    );
                                }}
                                style={{ color: "#233746" }}
                            >
                                {nextUserDown.FirstName +
                                    " " +
                                    nextUserDown.LastName}
                                <i
                                    style={{ color: "#233746", marginLeft: 10 }}
                                    className="fas fa-chevron-right"
                                />
                            </Button>
                        )}
                    </Col>
                </Row>
            </ErrorBoundary>
            <CustModal
                closeable={false}
                backdrop="static"
                show={showLockModal}
                SubmitButton={SubmitButton}
                onHide={() => window.location.reload()}
                title={"Session will soon expire"}
            >
                <div className="text-center">
                    <div>
                        <i
                            style={{ marginBottom: 10 }}
                            className="fas fa-redo-alt fa-3x"
                        ></i>
                    </div>
                    <div>
                        Your approval lock will soon expired and others will
                        soon be able make changes. Please refresh the page to
                        renew the session.
                    </div>
                </div>
            </CustModal>
        </Container>
    );
};
PayrollTimesheet.propTypes = {
    tableRows: PropTypes.array.isRequired,
    timesheet: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    deleteTimesheetLockDispatch: PropTypes.func.isRequired,
    createTimesheetLockDispatch: PropTypes.func.isRequired,
    readPayrollSubordinatesDispatch: PropTypes.func.isRequired,
    SupervisorID: PropTypes.number.isRequired,
    subordinates: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
    return {
        tableRows: state.subordinates.tableRows,
        subordinates: state.subordinates.employeeInfo,
        timesheet: state.timesheet,
        settings: state.settings,
        SupervisorID: state.currentUser.user.EmployeeID,
    };
};

const mapDispatchToProps = {
    readPayrollSubordinatesDispatch,
    createTimesheetLockDispatch,
    deleteTimesheetLockDispatch,
};

export default connect(mapStateToProps, mapDispatchToProps)(PayrollTimesheet);
