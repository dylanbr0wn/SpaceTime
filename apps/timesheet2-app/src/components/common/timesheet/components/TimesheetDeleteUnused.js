import Tippy from "@tippyjs/react";
import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { deleteUnusedRowsDispatch } from "../../../../redux/actions/timesheetsActions";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";

/**
 * @name TimesheetDeleteUnused
 * @component
 * @category Time Entry
 * @description Deletes all rows in timesheet without hour entered.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetDeleteUnused = ({
    deleteUnusedRowsDispatch,
    timeEntryPeriodStartDate,
    EmployeeID,
    disableModification,
}) => {
    const onClick = async () => {
        await deleteUnusedRowsDispatch(timeEntryPeriodStartDate, EmployeeID);
    };

    return (
        <ErrorBoundary>
            <Tippy content={"Delete empty rows"}>
                <Button
                    type="button"
                    aria-label="Delete empty rows"
                    disabled={disableModification}
                    onClick={onClick}
                    variant="secondary"
                    style={{ marginLeft: 10 }}
                >
                    <i className="far fa-trash-alt"></i>
                </Button>
            </Tippy>
        </ErrorBoundary>
    );
};

TimesheetDeleteUnused.propTypes = {
    deleteUnusedRowsDispatch: PropTypes.func.isRequired,
    timeEntryPeriodStartDate: PropTypes.object.isRequired,
    EmployeeID: PropTypes.number.isRequired,
    disableModification: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
    deleteUnusedRowsDispatch,
};

export default connect(null, mapDispatchToProps)(TimesheetDeleteUnused);
