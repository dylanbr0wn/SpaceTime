import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Col, Row, Button } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import { submitSanityChecks } from "../../../../services/utils";
import Modal from "../../ConfirmCloseModal";
import { createTimesheetSubmissionDispatch } from "../../../../redux/actions/approvalActions";
import ErrorBoundary from "../../ErrorBoundary";
import { saveEmployeePreferencesDispatch } from "../../../../redux/actions/currentUserActions";
import { deleteUnusedRowsDispatch } from "../../../../redux/actions/timesheetsActions";

/**
 * @name TimesheetSubmitInput
 * @component
 * @category Time Entry
 * @description Button to submit the timesheet.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetSubmitInput = ({
  timesheet,
  userInfo,
  lastDay,
  createTimesheetSubmissionDispatch,
  disableModification,
  ApprovalID,
  timeEntryPeriodStartDate,
  totalHours,
  workDays,
  expectedHours,
  checkExpectedHours,
  saveEmployeePreferencesDispatch,
  deleteUnusedRowsDispatch,
  type,
  departments,
  projects,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [dateOfSubmission, setDateOfSubmission] = useState(null);
  const [upToDate, setUpToDate] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSanityModal, setShowSanityModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentExpectedHours, setCurrentExpectedHours] = useState();
  // const [rowsAreValid, setRowsAreValid] = useState();

  useEffect(() => {
    setCurrentExpectedHours(expectedHours.Value);
  }, [expectedHours.Value]);

  useEffect(() => {
    let entries = [];

    timesheet.map((row) => entries.push(...row.dates));
    let submitted = entries.find((entry) => entry.SubmissionID);

    setDateOfSubmission(
      submitted ? moment.utc(submitted.SubmissionDate) : null
    );
    setHasSubmitted(submitted ? true : false);
    if (
      entries.filter((entry) => entry.TimeEntryID && !entry.SubmissionID)
        .length >= 1
    ) {
      setUpToDate(false);
    } else {
      setUpToDate(true);
    }
  }, [timesheet]);

  //Handles submit button click
  const clickHandler = () => {
    if (type === "user") {
      const errors = submitSanityChecks(
        timesheet,
        totalHours,
        workDays,
        checkExpectedHours,
        expectedHours.Value ?? 70,
        departments,
        projects
      );
      if (Object.values(errors).length > 0) {
        setErrors(errors);
        setShowSanityModal(true);
      } else {
        submitTimesheet();
      }
    } else {
      submitTimesheet();
    }
  };

  const handleChange = ({ target }) => {
    if (target.name === "checkExpectedHours") {
      saveEmployeePreferencesDispatch(
        userInfo.user.EmployeeID,
        checkExpectedHours.PreferenceID,
        target.checked,
        checkExpectedHours.EmployeePreferenceID
      );
    }
    if (target.name === "expectedHours") {
      setCurrentExpectedHours(target.value);
    }
  };

  const submitTimesheet = async () => {
    setIsSubmitting(true);
    await deleteUnusedRowsDispatch(
      timeEntryPeriodStartDate,
      userInfo.user.EmployeeID
    );
    const res = await createTimesheetSubmissionDispatch(
      userInfo.user.EmployeeID,
      lastDay,
      ApprovalID,
      timeEntryPeriodStartDate
    );
    if (!res.success) {
      toast.warn(res.data);
    } else {
      toast.success("Timesheet submitted successfully!");
    }
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  //Saving icon sub component.
  const SavingIcon = () => {
    if (!upToDate) {
      return (
        <>
          <i
            style={{ margin: "10px 5px 10px 20px" }}
            className="far fa-times-circle text-danger "
          />
          <span className="text-danger ">Not up to date</span>
        </>
      );
    } else {
      return (
        <>
          <i
            style={{ margin: "10px 5px 10px 20px" }}
            className="far fa-check-circle text-success "
          />
          <span className="text-success ">Up to date</span>
        </>
      );
    }
  };

  return (
    <>
      <ErrorBoundary>
        <span style={{ marginRight: 10 }}>
          <SavingIcon />
        </span>
        {hasSubmitted ? (
          <>
            <Button
              disabled={disableModification || isSubmitting}
              onClick={clickHandler}
            >
              Resubmit Timesheet
            </Button>
            <div style={{ marginTop: 10 }}>
              {"Last submitted on: "}
              {dateOfSubmission ? dateOfSubmission.format("LLL") : ""}
            </div>
          </>
        ) : (
          <Button
            disabled={disableModification || isSubmitting}
            onClick={clickHandler}
          >
            Submit Timesheet
          </Button>
        )}
        <Modal
          modalShow={showSanityModal}
          onConfirm={() => {
            setShowSanityModal(false);
            submitTimesheet();
          }}
          onHide={() => setShowSanityModal(false)}
          title={"Timesheet Checking"}
          body={
            <span>
              {Object.values(errors).map((error, i) => (
                <span key={i} style={{ color: "red" }}>
                  - {error}
                  <br />
                  <br />
                </span>
              ))}
              <span style={{ display: "block" }}>
                <Row>
                  <Col xs="auto" className="my-1">
                    <Form.Group controlId="checkExpectedHours">
                      <Form.Label>Check Hours</Form.Label>
                      <Form.Check
                        custom
                        label="Check expected hours?"
                        name="checkExpectedHours"
                        checked={
                          checkExpectedHours.EmployeePreferenceID
                            ? checkExpectedHours.Value
                            : true
                        }
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs="auto" className="my-1">
                    <Form.Group>
                      <Form.Label>Expected Hours</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Hours"
                        name="expectedHours"
                        value={currentExpectedHours ?? 70}
                        onBlur={() => {
                          let newHours = currentExpectedHours;
                          if (newHours === "" || !newHours) newHours = 0;
                          saveEmployeePreferencesDispatch(
                            userInfo.user.EmployeeID,
                            expectedHours.PreferenceID,
                            newHours,
                            expectedHours.EmployeePreferenceID
                          );
                        }}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </span>
            </span>
          }
          confirmButtonText="Submit"
        />
      </ErrorBoundary>
    </>
  );
};
TimesheetSubmitInput.propTypes = {
  timesheet: PropTypes.array.isRequired,
  userInfo: PropTypes.object.isRequired,
  lastDay: PropTypes.object,
  createTimesheetSubmissionDispatch: PropTypes.func.isRequired,
  disableModification: PropTypes.bool.isRequired,
  ApprovalID: PropTypes.number,
  timeEntryPeriodStartDate: PropTypes.object.isRequired,
  totalHours: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  workDays: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  departments: PropTypes.array.isRequired,
  expectedHours: PropTypes.object.isRequired,
  checkExpectedHours: PropTypes.object.isRequired,
  deleteUnusedRowsDispatch: PropTypes.func.isRequired,
  saveEmployeePreferencesDispatch: PropTypes.func.isRequired,

  type: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    checkExpectedHours: state.currentUser.preferences.CheckExpectedHours ?? {},
    expectedHours: state.currentUser.preferences.ExpectedHours ?? {},
    projects: state.projects,
    departments: state.departments,
  };
};

const mapDispatchToProps = {
  deleteUnusedRowsDispatch,
  createTimesheetSubmissionDispatch,
  saveEmployeePreferencesDispatch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimesheetSubmitInput);
