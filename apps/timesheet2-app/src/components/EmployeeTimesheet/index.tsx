import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { timesheetInital } from "../../redux/reducers/initialState";
import Timesheet from "../common/Timesheet";

//import "react-dates/lib/css/_datepicker.css";
import "../style/UserAdmin.css";

/**
 * @name TimeEntry
 * @component
 * @category Time Entry
 * @description Root time entry screen componenet.
 * @param {Object} props Props. See propTypes for details.
 */
const EmployeeTimesheet = ({ ...props }) => {
    return (
        <div className="w-full">
            <Timesheet {...props} />
        </div>
    );
};

export default EmployeeTimesheet;
