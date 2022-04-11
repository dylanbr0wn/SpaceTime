import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import Tippy from "@tippyjs/react";

import { sortTimesheetDispatch } from "../../../../redux/actions/timesheetsActions";
import { getSortedRows } from "../../../../services/utils";
import ErrorBoundary from "../../ErrorBoundary";

/**
 * @name TimesheetSortRows
 * @component
 * @category Time Entry
 * @description Sort the timesheet rows.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetSortRows = ({
    projects,
    rows,
    departments,
    workCodes,
    EmployeeID,
    sortTimesheetDispatch,
    disableModification,
}) => {
    const sortRows = () => {
        const sortedRows = getSortedRows({
            rows,
            projects,
            departments,
            workCodes,
        });

        sortTimesheetDispatch(sortedRows, EmployeeID);
    };

    return (
        <ErrorBoundary>
            <Tippy content={"Sort timesheet rows"}>
                <button
                    type="button"
                    disabled={disableModification}
                    onClick={sortRows}
                    aria-label="Sort timesheet rows"
                >
                    <i className="fas fa-list-ol" />
                </button>
            </Tippy>
        </ErrorBoundary>
    );
};

TimesheetSortRows.propTypes = {
    projects: PropTypes.array.isRequired,
    workCodes: PropTypes.array.isRequired,
    departments: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    EmployeeID: PropTypes.number.isRequired,
    sortTimesheetDispatch: PropTypes.func.isRequired,
    disableModification: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => {
    return {
        departments: state.departments,
        workCodes: state.workCodes,
        projects: state.projects,
        rows: state.timesheet[props.EmployeeID]
            ? state.timesheet[props.EmployeeID].hourEntries
            : [],
    };
};

const mapDispatchToProps = {
    sortTimesheetDispatch,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimesheetSortRows);
