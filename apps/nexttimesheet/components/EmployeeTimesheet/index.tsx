import { Session } from "next-auth";
import React from "react";

import { UserFromAuthIdQuery } from "../../lib/apollo";
import Timesheet from "../Timesheet";

// import "react-dates/lib/css/_datepicker.css";

/**
 * @name TimeEntry
 * @component
 * @category Time Entry
 * @description Root time entry screen componenet.
 * @param {Object} props Props. See propTypes for details.
 */
const EmployeeTimesheet = ({
    userData,
    user,
}: {
    userData: UserFromAuthIdQuery["userFromAuthId"];
    user: Session["user"];
}) => {
    return (
        <div className="w-full">
            <Timesheet authUser={user} user={userData} />
        </div>
    );
};

export default EmployeeTimesheet;
