import cuid from "cuid";
/* eslint-disable react/jsx-key */
/* eslint react/prop-types: 0 */
import { DateTime } from "luxon";
import moment from "moment";
import PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { useTable } from "react-table";

import {
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    GetUserFromAuth0Query,
    useCreateTimeEntryRowMutation,
    useGetTimeEntryRowsQuery,
    useGetTimesheetQuery,
    User,
} from "../../../api";
import { getDayFeatures } from "../../../services/utils";

import TimesheetDateInput from "./components/TimesheetDateInput";
import TimesheetDeleteEntryInput from "./components/TimesheetDeleteEntryInput";
import TimesheetDepartmentInput from "./components/TimesheetDepartmentInput";
import TimesheetEntryInput from "./components/TimesheetEntryInput";
import TimesheetPinInput from "./components/TimesheetPinInput";
import TimesheetProjectInput from "./components/TimesheetProjectInput";
import TimesheetWorkCodeInput from "./components/TimesheetWorkCodeInput";
import TimesheetDesktopView from "./views/TimesheetDesktopView";
import TimesheetMobileView from "./views/TimesheetMobileView";
import TimesheetTabletView from "./views/TimesheetTabletView";
import { useTimesheet, useTimesheetDates } from "./hooks";
import TimesheetTable from "./TimesheetTable";

import "../../style/UserAdmin.css";

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
const Timesheet = ({ user }: { user: Partial<User> }) => {
    const [type, setType] = React.useState("user");
    // const { userId } = useParams();

    const [timesheetQueryDate, setTimesheetQueryDate] = React.useState<string>(
        DateTime.now().startOf("day").toUTC().startOf("day").toISO()
    );

    const {
        data: timesheetData,
        loading,
        error,
    } = useGetTimesheetQuery({
        variables: {
            timesheet: {
                userId: String(user?.id),
                date: timesheetQueryDate,
            },
        },
    });
    const { data, _loading, _error } = useGetTimeEntryRowsQuery({
        variables: {
            timesheetId: timesheetData?.getTimesheet?.id ?? "-1",
        },
        skip: !timesheetData?.getTimesheet?.id,
    });

    const { timesheetDates, startDate, periodLength } = useTimesheetDates(
        timesheetData,
        // getorCreateTimesheetMutation,
        String(user?.id)
    );

    const { timesheet } = useTimesheet(data, timesheetDates, String(user?.id));

    const [createTimeEntryRowMutation] = useCreateTimeEntryRowMutation();

    const createTimeEntryRow = () => {
        createTimeEntryRowMutation({
            variables: {
                timesheetId: timesheetData?.getTimesheet?.id ?? "-1",
            },
            // refetchQueries: [GetTimeEntryRowsDocument],
            optimisticResponse: {
                createTimeEntryRow: {
                    __typename: "TimeEntryRow",
                    id: cuid(),
                    createdAt: DateTime.now().toISO(),
                    updatedAt: DateTime.now().toISO(),
                    timeEntries: [],
                    workType: {
                        __typename: "WorkType",
                        id: "-1",
                    },
                    project: {
                        __typename: "Project",
                        id: "-1",
                    },
                    department: {
                        __typename: "Department",
                        id: "-1",
                    },
                },
            },
            update: (cache, { data }) => {
                const timeEntryRow = data?.createTimeEntryRow;
                if (!timeEntryRow) return;
                const timeEntryRowsData = cache.readQuery<
                    GetTimeEntryRowsQuery,
                    GetTimeEntryRowsQueryVariables
                >({
                    query: GetTimeEntryRowsDocument,
                    variables: {
                        timesheetId: timesheetData?.getTimesheet?.id ?? "-1",
                    },
                });
                const timeEntryRows = timeEntryRowsData?.getTimeEntryRows;
                if (!timeEntryRows) return;
                cache.writeQuery<
                    GetTimeEntryRowsQuery,
                    GetTimeEntryRowsQueryVariables
                >({
                    query: GetTimeEntryRowsDocument,
                    variables: {
                        timesheetId: timesheetData?.getTimesheet?.id ?? "-1",
                    },
                    data: {
                        getTimeEntryRows: [...timeEntryRows, timeEntryRow],
                    },
                });
            },
        });
    };

    // Updates the timesheet start date by subtracting or adding 14 days

    const columns = React.useMemo(
        () => [
            {
                Header: "",
                id: "workdescription",
                columns: [
                    {
                        Header: "Department",
                        accessor: (row) => row.department.id,
                        id: "department",
                        minWidth: 75,
                        Cell: ({ value, row, column, timesheetId }) => (
                            <TimesheetDepartmentInput
                                value={value}
                                row={row}
                                column={column}
                                userId={String(user?.id)}
                                timesheetId={timesheetId}
                            />
                        ),
                    },
                    {
                        Header: "Project",
                        accessor: (row) => row.project.id,
                        id: "project",
                        minWidth: 75,
                        Cell: ({ value, row, column, timesheetId, rows }) => (
                            <TimesheetProjectInput
                                value={value}
                                row={row}
                                rows={rows}
                                column={column}
                                userId={String(user?.id)}
                                timesheetId={timesheetId}
                            />
                        ),
                    },
                    {
                        Header: "Work Type",
                        accessor: (row) => row.workType.id,
                        id: "workType",
                        minWidth: 75,
                        Cell: ({ value, row, column, timesheetId, rows }) => (
                            <TimesheetWorkCodeInput
                                value={value}
                                row={row}
                                rows={rows}
                                column={column}
                                userId={String(String(user?.id))}
                                timesheetId={timesheetId}
                            />
                        ),
                    },
                ],
            },

            {
                Header: "Hours",
                columns: timesheetDates.map((date, i) => {
                    const dayFeatures = getDayFeatures(date);

                    return {
                        // eslint-disable-next-line react/display-name
                        Header: () => {
                            return (
                                <div
                                    className={`w-full box-border ${dayFeatures.style}`}
                                >
                                    <div className="text-center">
                                        {date.toFormat("dd")}
                                    </div>
                                    <div
                                        className="text-center"
                                        style={{ fontWeight: 400 }}
                                    >
                                        {date.toFormat("L/d")}
                                    </div>
                                </div>
                            );
                        },
                        width: 40,
                        accessor: (row) => row.timeEntries[i],
                        id: date.toFormat("dd"),
                        Cell: ({ value, row, timesheetId }) => (
                            <TimesheetEntryInput
                                value={value}
                                timesheetId={timesheetId}
                                row={row}
                                date={date}
                                userId={String(user?.id)}
                            />
                        ),
                    };
                }),
            },
            {
                // specifies delete row button column.
                Header: () => null, // No header
                id: "deleter", // It needs an ID
                // eslint-disable-next-line react/display-name, react/prop-types
                width: 30,
                Cell: (props) => (
                    <TimesheetDeleteEntryInput
                        {...props}
                        userId={String(user?.id)}
                    />
                ),
            },
        ],
        [timesheetDates, user]
    );

    return (
        <>
            {data && (
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
                    <TimesheetTable
                        timesheetId={timesheetData?.getTimesheet?.id ?? "-1"}
                        data={timesheet}
                        columns={columns}
                        addNewEntryRow={createTimeEntryRow}
                    />
                </div>
            )}
        </>
    );
};

export default Timesheet;
