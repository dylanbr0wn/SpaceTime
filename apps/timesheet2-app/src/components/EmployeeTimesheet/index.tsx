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
const EmployeeTimesheet = ({ userInfo, timesheet }) => {
    return (
        <div className="w-full">
            <Timesheet
                userInfo={userInfo}
                timesheet={{
                    ...timesheetInital,
                    ...timesheet[userInfo.user.EmployeeID],
                }}
            />
        </div>
    );
};
EmployeeTimesheet.propTypes = {
    userInfo: PropTypes.object.isRequired,
    timesheet: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser,
        timesheet: state.timesheet,
    };
};

export default connect(mapStateToProps)(EmployeeTimesheet);
