import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import {
    deleteTimeEntryAlternateDispatch,
    saveTimeEntryAlternateDispatch,
} from "../../../../redux/actions/timesheetsActions";
import ErrorBoundary from "../../ErrorBoundary";

import "../../../style/TimeEntry.css";

/**
 * @name AlternativeEntryInput
 * @component
 * @category Time Entry
 * @description Input for alternate transport. Provides a checkbox for a boolean result.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetAlternativeEntryInput = ({
    work,
    disableModification,
    saveTimeEntryAlternateDispatch,
    deleteTimeEntryAlternateDispatch,
    setIsLocked,
    EmployeeID,
    timeEntryPeriodStartDate,
}) => {
    const [value, setValue] = useState(!!work.TimeEntryID);

    useEffect(() => {
        setValue(!!work.TimeEntryID);
    }, [work]);

    // Checks to see if the checkbox is marked as checked. If yes, add time entry for alternative transport. If no, remove it.
    const onChange = async ({ target }) => {
        setValue(target.checked);
        if (target.checked) {
            const res = await saveTimeEntryAlternateDispatch(
                { ...work, HoursWorked: target.checked ? 1 : "" },
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
        } else {
            const res = await deleteTimeEntryAlternateDispatch(
                { ...work, HoursWorked: target.checked ? 1 : "" },
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
    };

    return (
        <>
            <ErrorBoundary>
                <div className="mx-auto">
                    {/* {!loading && */}
                    <input
                        aria-label="Alternate Transport Input"
                        style={{ transform: "translateX(3px)" }}
                        title="Alternative transport used?"
                        name={`Alt${work.DateofWork}`}
                        id={`Alt${work.DateofWork}`}
                        checked={value}
                        onChange={onChange}
                        disabled={disableModification}
                    />

                    {/* } */}
                </div>
            </ErrorBoundary>
        </>
    );
};

TimesheetAlternativeEntryInput.propTypes = {
    work: PropTypes.object.isRequired,
    disableModification: PropTypes.bool.isRequired,
    saveTimeEntryAlternateDispatch: PropTypes.func.isRequired,
    deleteTimeEntryAlternateDispatch: PropTypes.func.isRequired,
    setIsLocked: PropTypes.func.isRequired,
    EmployeeID: PropTypes.number.isRequired,
    timeEntryPeriodStartDate: PropTypes.object.isRequired,
};

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = {
    deleteTimeEntryAlternateDispatch,
    saveTimeEntryAlternateDispatch,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimesheetAlternativeEntryInput);
