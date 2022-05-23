/* eslint-disable react/jsx-key */
/* eslint react/prop-types: 0 */
import { DateTime } from "luxon";
import { Session } from "next-auth";
import * as React from "react";

import { useQuery } from "@apollo/client";

import {
    Status as TimesheetStatus,
    TimesheetDocument,
    UserFromAuthIdQuery,
} from "../../lib/apollo";
import ApprovalTree from "../ApprovalTree";
import Loading from "../common/Loading";

import TimesheetDateInput from "./DateInput";
import { useTimesheetDates } from "./hooks";
import Status from "./Status";
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
    authUser,
}: {
    user: UserFromAuthIdQuery["userFromAuthId"];
    authUser: Session["user"];
}) => {
    // const [type, setType] = React.useState("user");
    // const { userId } = useParams();

    const [timesheetQueryDate, setTimesheetQueryDate] = React.useState<string>(
        DateTime.now().startOf("day").toUTC().startOf("day").toISO()
    );

    const { data: timesheetData, loading: timesheetLoading } = useQuery(
        TimesheetDocument,
        {
            variables: {
                userId: String(user?.id),
                date: timesheetQueryDate,
            },
        }
    );

    const { timesheetDates, startDate, periodLength } = useTimesheetDates(
        timesheetData?.timesheetFromDate?.period?.endDate,
        timesheetData?.timesheetFromDate?.period?.startDate,
        timesheetData?.timesheetFromDate?.isChanged,
        // getorCreateTimesheetMutation,
        String(user?.id)
    );

    // React.useEffect(() => {
    //     if (timesheetData?.timesheetFromDate) {
    //         IsChanged(timesheetData.timesheetFromDate.isChanged);
    //     }
    // }, [timesheetData, timesheetLoading]);

    // Updates the timesheet start date by subtracting or adding 14 days

    return (
        <>
            <div className="w-full flex flex-col">
                <div className="w-full flex max-w-screen-xl mx-auto">
                    <div className="w-full flex flex-col">
                        <div className="my-auto">
                            <div className="dropdown dropdown-hover ">
                                <label tabIndex={0} className="btn m-1">
                                    Hover
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-52"
                                >
                                    <li>
                                        <a>Item 1</a>
                                    </li>
                                    <li>
                                        <a>Item 2</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col ">
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
                    <div className="w-full flex justify-end">
                        {/* <label
                            htmlFor="my-drawer-4"
                            className="drawer-button btn btn-primary"
                        >
                            Open drawer
                        </label> */}
                        <Status
                            timesheetChanged={
                                !!timesheetData?.timesheetFromDate?.isChanged
                            }
                            status={
                                timesheetData?.timesheetFromDate?.status ??
                                TimesheetStatus.Unsubmitted
                            }
                            timesheetId={
                                timesheetData?.timesheetFromDate?.id ?? "-1"
                            }
                            user={user}
                        />
                    </div>
                </div>
                {!timesheetLoading && timesheetData?.timesheetFromDate ? (
                    <TimesheetTable
                        timesheetId={timesheetData?.timesheetFromDate?.id}
                        timesheetDates={timesheetDates}
                        user={user}
                    />
                ) : (
                    <div className="w-full h-full mt-10">
                        <Loading />
                    </div>
                )}
                <ApprovalTree
                    user={user}
                    timesheetId={timesheetData?.timesheetFromDate?.id ?? "-1"}
                />
            </div>
        </>
    );
};

export default Timesheet;
