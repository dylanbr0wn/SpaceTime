import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import ErrorBoundary from "../../ErrorBoundary";
import {
  createEmployeePinnedRowAction,
  deleteEmployeePinnedRowAction,
} from "../../../../redux/reducers/currentUserReducer";

/**
 * TimesheetPinInput handles the pinning and unpinning of timesheet rows. It displays a filled or outlined star button to inidicate a pinned or unpinned row. Clicking the button will invert the current preference.
 */
const TimesheetPinInput = ({
  pinned = false,
  // EmployeeID = 0,
  disableModification = false,
  isTablet = false,
  // pinnedRows,
  row,
  type,
}) => {
  const [iconHover, setIconHover] = useState(false);
  const [rowIsValidPin, setRowIsValidPin] = useState(false);

  const EmployeeID = useSelector(
    (state) => state.currentUser.user.EmployeeID ?? 0
  );
  const pinnedRows = useSelector(
    (state) => state.currentUser.preferences.PinnedRows.Value
  );

  const dispatch = useDispatch();

  const addRow = () => {
    dispatch(
      createEmployeePinnedRowAction({
        EmployeeID,
        DepartmentID: row.original.DepartmentID,
        ProjectID: row.original.ProjectID,
        WorkCodeID: row.original.WorkCodeID,
      })
    );
  };

  const removeRow = () => {
    let rowToRemove = pinnedRows.find((pinnedRow) => {
      if (pinnedRow.ProjectID !== row.original.ProjectID) return false;
      if (pinnedRow.DepartmentID !== row.original.DepartmentID) return false;
      if (pinnedRow.WorkCodeID !== row.original.WorkCodeID) return false;
      return true;
    });
    dispatch(
      deleteEmployeePinnedRowAction({
        EmployeeID,
        EmployeePinnedRowID: rowToRemove.EmployeePinnedRowID,
      })
    );
  };

  useEffect(() => {
    let hasDepartmentID = row.original.DepartmentID !== -1;
    let hasProjectID = row.original.ProjectID !== -1;
    let hasWorkCodeID = row.original.WorkCodeID !== -1;

    if (hasDepartmentID && hasProjectID && hasWorkCodeID)
      setRowIsValidPin(true);
    else setRowIsValidPin(false);
  }, [row.original]);

  return (
    <>
      <ErrorBoundary>
        {pinned && type === "user" ? (
          <Tippy content={"Remove from favourites"}>
            <Button
              onMouseEnter={() => setIconHover(true)}
              onMouseLeave={() => setIconHover(false)}
              style={{
                padding: isTablet ? "0.2rem" : "0.2rem 0.375rem",
              }}
              disabled={disableModification || type !== "user"}
              variant="link"
              onClick={removeRow}
              className="pinButton"
              aria-label="Remove from favourites"
            >
              <i className={`${iconHover ? "far" : "fas"} fa-star`} />
            </Button>
          </Tippy>
        ) : (
          <Tippy content={"Add row to favourites"}>
            <Button
              onMouseEnter={() => setIconHover(true)}
              onMouseLeave={() => setIconHover(false)}
              style={{
                padding: isTablet ? "0.2rem" : "0.2rem 0.375rem",
              }}
              disabled={
                disableModification || type !== "user" || !rowIsValidPin
              }
              variant="link"
              onClick={addRow}
              className="pinButton"
              aria-label="Add row to favourites"
            >
              <i className={`${iconHover ? "fas" : "far"} fa-star`} />
            </Button>
          </Tippy>
        )}
      </ErrorBoundary>
    </>
  );
};

TimesheetPinInput.propTypes = {
  /** Dispatcher for creating a new pinned row. */
  // createEmployeePinnedRowDispatch: PropTypes.func.isRequired,
  /** Dispatcher for removing a row from pinned list. */
  // deleteEmployeePinnedRowDispatch: PropTypes.func.isRequired,
  /** Bool indicating whether the current row is pinned*/
  pinned: PropTypes.bool,
  /** Bool indicating whether modification of the current timesheet is allowed*/
  disableModification: PropTypes.bool.isRequired,
  /** Bool indicating whether the user is in tablet mode or not*/
  isTablet: PropTypes.bool,
  /** Array of the currently pinned rows of the timesheet*/
  // pinnedRows: PropTypes.array,
  /** Object with details of the row.*/
  row: PropTypes.object,
  /** Indicates the type of user interacting with the timesheet.*/
  type: PropTypes.string,
  /** The Employee ID of the timesheet which is being edited.*/
  // EmployeeID: PropTypes.number.isRequired,
};

export default TimesheetPinInput;
