import React from "react";
import { Container } from "react-bootstrap";
import "react-dates/lib/css/_datepicker.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Timesheet from "../common/timesheet/Timesheet";
import { timesheetInital } from "../../redux/reducers/initialState";
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
        <Container fluid className="userContainer bg-light">
            <Timesheet
                userInfo={userInfo}
                timesheet={{
                    ...timesheetInital,
                    ...timesheet[userInfo.user.EmployeeID],
                }}
            />
        </Container>
    );
};
EmployeeTimesheet.propTypes = {
    userInfo: PropTypes.object.isRequired,
    timesheet: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        userInfo: state.currentUser,
        timesheet: state.timesheet,
    };
};

export default connect(mapStateToProps)(EmployeeTimesheet);
