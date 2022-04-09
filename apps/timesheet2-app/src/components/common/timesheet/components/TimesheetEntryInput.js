import React, { useState, useEffect, useMemo } from "react";
import Tippy from "@tippyjs/react/headless";
import { Form, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import SavingIcon from "../../SavingIcon";
import "../../../style/TimeEntry.css";
import {
  saveTimeEntryDispatch,
  deleteTimeEntryDispatch,
} from "../../../../redux/actions/timesheetsActions";
import ErrorBoundary from "../../ErrorBoundary";
import { Fragment } from "react";

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
  saveTimeEntryDispatch,
  deleteTimeEntryDispatch,
  setIsLocked,
  EmployeeID,
  timeEntryPeriodStartDate,
  isTablet,
  projects,
  departments,
  workCodes,
}) => {
  // We need to keep and update the state of the cell normally
  const [work, setWork] = useState(initialValue);
  const [hoursWorked, setHoursWorked] = useState(
    initialValue ? initialValue.HoursWorked : ""
  );
  const [comment, setComment] = useState(
    initialValue ? initialValue.Comment : ""
  );

  const tippyDelay = useMemo(() => [500, 0], []);

  const [timeoutID, setTimeoutID] = useState(null);
  const [savingComment, setSavingComment] = useState(false);
  const [validTypes, setValidTypes] = useState(false);
  const [lastTimeOut, setLastTimeOut] = useState(null);

  useEffect(() => {
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

  //Updates time entries with updated hoursworked and comment.
  const updateHourEntry = async (rowIndex, newWork) => {
    // setSkipPageReset(true);
    if (parseFloat(newWork.HoursWorked) === 0 || newWork.HoursWorked === "") {
      let result = await deleteTimeEntryDispatch(
        rowIndex,
        columnIndex,
        { ...newWork, Comment: "" },
        EmployeeID,
        timeEntryPeriodStartDate
      );
      if (!result.success) {
        if (result.status === 423) {
          setIsLocked(true);
        } else {
          toast.warn(result.data);
        }
      }
    } else {
      let result = await saveTimeEntryDispatch(
        rowIndex,
        columnIndex,
        newWork,
        EmployeeID,
        timeEntryPeriodStartDate
      );
      if (!result.success) {
        if (result.status === 423) {
          setIsLocked(true);
        } else {
          toast.warn(result.data);
        }
      }
    }
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    if (parseFloat(hoursWorked) === 0 && "" === initialValue.HoursWorked) {
      setHoursWorked("");
      return;
    }

    if (hoursWorked === initialValue.HoursWorked) return;

    updateHourEntry(row.index, { ...work, HoursWorked: hoursWorked });
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setWork(initialValue);
    if (lastTimeOut === timeoutID && comment !== initialValue.Comment)
      setComment(initialValue ? initialValue.Comment : "");
    setHoursWorked(initialValue ? initialValue.HoursWorked : "");
  }, [comment, initialValue, lastTimeOut, savingComment, timeoutID]);

  //when comment change detected, will wait 0.75s to update. If updated before end of 0.75s, timer will restart.
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
        setLastTimeOut(timeoutID);
        await updateHourEntry(row.index, {
          ...work,
          Comment: target.value,
        });
        setSavingComment(false);
      }, 750)
    );
  };

  return (
    <Fragment>
      <ErrorBoundary>
        {/* {!loading && */}

        <Tippy
          interactive={true}
          interactiveBorder={5}
          delay={tippyDelay}
          disabled={!hoursWorked}
          trigger="mouseenter"
          placement="bottom"
          render={(attr) => (
            <Card border="dark" className="shadow" {...attr}>
              <Card.Header>
                {disableModification ? (
                  "Comment"
                ) : (
                  <>
                    Add a comment <SavingIcon saving={savingComment} />
                  </>
                )}
              </Card.Header>

              <Card.Body>
                <Form.Control
                  as="textarea"
                  rows="2"
                  type="text"
                  disabled={disableModification}
                  onChange={onCommentChange}
                  style={{}}
                  value={comment ? comment : ""}
                />
              </Card.Body>
              <Card.Footer>
                <div style={{ fontSize: "0.8rem" }}>
                  Comment Length: {comment ? comment.length : 0}/255
                </div>
              </Card.Footer>
            </Card>
          )}
        >
          <div>
            <Form.Control
              size="sm"
              style={{
                marginLeft: "auto",
                padding: isTablet ? "0.15rem" : "0.25rem 0.5rem",
                fontSize: isTablet ? "0.75rem" : "0.875rem",
              }}
              aria-label="timesheetEntryInput"
              type="number"
              // value={(hoursWorked === null) ? hoursWorked : ''}
              value={hoursWorked === 0 ? "" : hoursWorked}
              onChange={onHourChange}
              onBlur={onBlur}
              className={work.Comment ? "border border-green" : ""}
              disabled={disableModification || validTypes}
              step="0.01"
            />
          </div>
        </Tippy>
        {/* } */}
      </ErrorBoundary>
    </Fragment>
  );
};

TimesheetEntryInput.propTypes = {
  value: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  columnIndex: PropTypes.number.isRequired,
  disableModification: PropTypes.bool.isRequired,
  saveTimeEntryDispatch: PropTypes.func.isRequired,
  deleteTimeEntryDispatch: PropTypes.func.isRequired,
  setIsLocked: PropTypes.func.isRequired,
  EmployeeID: PropTypes.number.isRequired,
  timeEntryPeriodStartDate: PropTypes.object.isRequired,
  isTablet: PropTypes.bool,
  projects: PropTypes.array.isRequired,
  departments: PropTypes.array.isRequired,
  workCodes: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  projects: state.projects,
  departments: state.departments,
  workCodes: state.workCodes,
});

const mapDispatchToProps = {
  saveTimeEntryDispatch,
  deleteTimeEntryDispatch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimesheetEntryInput);
