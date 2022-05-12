/* eslint-disable react/jsx-key */
/* eslint react/prop-types: 0 */
import { DateTime } from "luxon";
import * as React from "react";

import { UserProfile } from "@auth0/nextjs-auth0";

import { useGetTimesheetQuery, User } from "../../lib/apollo";
import Loading from "../common/Loading";

import TimesheetDateInput from "./DateInput";
import { useTimesheetDates } from "./hooks";
import TimesheetTable from "./Table";

/**
 * @name useTimesheet
 * @function
 * @category Time Entry
 * @description TimeEntry custom hook. This is a custom hook. It is for organizational purposes.
 * Information on custom hooks here https://reactjs.org/docs/hooks-custom.html
 * @param {Object} settings Time sheet settings.
 * @param {Object} userTimeEntry User time sheet information.
 * @param {Function} loadTimeSheet Function to load timesheet.
 * @param {Function} loadUserWorkCodes Function to load user work codes.
 * @param {Function} loadTimeEntryTemplates Function to load user time entry templates.
 * @param {Object} currentUser Currently logged in user information.
 */

/**
 * @name Timesheet
 * @component
 * @category Time Entry
 * @description Root timesheet screen componenet.
 * @param {Object} props Props. See propTypes for details.
 */
const Timesheet = ({
    user,
    auth0User,
}: {
    user: Partial<User>;
    auth0User: UserProfile;
}) => {
    // const [type, setType] = React.useState("user");
    // const { userId } = useParams();

    const [timesheetQueryDate, setTimesheetQueryDate] = React.useState<string>(
        DateTime.now().startOf("day").toUTC().startOf("day").toISO()
    );

    const { data: timesheetData, loading: timesheetLoading } =
        useGetTimesheetQuery({
            variables: {
                timesheet: {
                    userId: String(user?.id),
                    date: timesheetQueryDate,
                },
            },
        });

    const { timesheetDates, startDate, periodLength } = useTimesheetDates(
        timesheetData,
        // getorCreateTimesheetMutation,
        String(user?.id)
    );

    // Updates the timesheet start date by subtracting or adding 14 days

    return (
        <>
            <div className="w-full flex flex-col">
                <div className="text-center w-full">
                    <TimesheetDateInput
                        timesheetQueryDate={timesheetQueryDate}
                        setTimesheetQueryDate={setTimesheetQueryDate}
                        // getorCreateTimesheetMutation={
                        //     getorCreateTimesheetMutation
                        // }
                        periodLength={periodLength}
                        startDate={startDate}
                        userId={String(user?.id)}
                    />
                </div>
                {!timesheetLoading ? (
                    <TimesheetTable
                        timesheetData={timesheetData?.getTimesheet}
                        timesheetDates={timesheetDates}
                        user={user}
                    />
                ) : (
                    <div className="w-full h-full mt-10">
                        <Loading />
                    </div>
                )}
            </div>
        </>
    );
};

export default Timesheet;
