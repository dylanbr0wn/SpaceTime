import React from "react";

import Timesheet from "../Timesheet";

// import "react-dates/lib/css/_datepicker.css";

/**
 * @name TimeEntry
 * @component
 * @category Time Entry
 * @description Root time entry screen componenet.
 * @param {Object} props Props. See propTypes for details.
 */
const EmployeeTimesheet = () => {
	return (
		<div className="w-full">
			<Timesheet />
		</div>
	);
};

export default EmployeeTimesheet;
