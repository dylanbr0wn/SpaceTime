import { Button, Spinner } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import { readEmployeePayrollPeriodReport } from "../../../../services/api/reportsAPI";
import ErrorBoundary from "../../ErrorBoundary";
import Tippy from "@tippyjs/react";

/**
 * @name TimesheetPrintSummary
 * @component
 * @category Time Entry
 * @description Creates a PDF summary of the current timesheet.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetPrintSummary = ({ Employee, timeEntryPeriodStartDate }) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setFileName(
      `${Employee.FirstName}${Employee.LastName}TimesheetSummary${moment(
        timeEntryPeriodStartDate
      ).format("DDMMYYYY")}`
    );
  }, [Employee, timeEntryPeriodStartDate]);

  const getReport = async () => {
    setLoading(true);
    const result = await readEmployeePayrollPeriodReport(
      Employee.EmployeeID,
      moment.utc(timeEntryPeriodStartDate).toDate(),
      fileName
    );
    if (!result.success) {
      toast.warn("Error: " + result.data);
    }
    setLoading(false);
  };

  return (
    <>
      <ErrorBoundary>
        {loading && (
          <div style={{ margin: "0 10px", display: "inline-block" }}>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              style={{ marginRight: 5 }}
            />
            Loading...
          </div>
        )}
        <Tippy content="Print timesheet period summary">
          <Button
            aria-label="Print timesheet summary"
            style={{ marginRight: 10 }}
            variant="outline-secondary"
            onClick={getReport}
          >
            <i className="fas fa-print" />
          </Button>
        </Tippy>
      </ErrorBoundary>
    </>
  );
};
TimesheetPrintSummary.propTypes = {
  Employee: PropTypes.object.isRequired,
  timeEntryPeriodStartDate: PropTypes.object.isRequired,
};

export default TimesheetPrintSummary;
