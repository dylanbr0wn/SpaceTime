import React from "react";

import { UserProfile } from "@auth0/nextjs-auth0";

import { User } from "../../lib/apollo";
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
    userData: Partial<User>;
    user: UserProfile;
}) => {
    return (
        <div className="w-full">
            <Timesheet auth0User={user} user={userData} />
        </div>
    );
};

export default EmployeeTimesheet;
