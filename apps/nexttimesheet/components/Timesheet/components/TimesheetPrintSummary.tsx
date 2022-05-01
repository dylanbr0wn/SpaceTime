import moment from "moment";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Tippy from "@tippyjs/react";

import { readEmployeePayrollPeriodReport } from "../../../../services/api/reportsAPI";
import ErrorBoundary from "../../common/ErrorBoundary";
import Loading from "../../common/Loading";

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
                        <Loading />
                        Loading...
                    </div>
                )}
                <Tippy content="Print timesheet period summary">
                    <button
                        aria-label="Print timesheet summary"
                        style={{ marginRight: 10 }}
                        onClick={getReport}
                    >
                        <i className="fas fa-print" />
                    </button>
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
