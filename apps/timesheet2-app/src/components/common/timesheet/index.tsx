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
    useCreateTimeEntryRowMutation,
    useGetorCreateTimesheetMutation,
    useGetTimeEntryRowsQuery,
} from "../../../api";
import { getDayFeatures } from "../../../services/utils";

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
import TimesheetDateInput from "./components/TimesheetDateInput";

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
const Timesheet = () => {
    const [type, setType] = React.useState("user");
    const { id: userId } = useParams();

    const [
        getorCreateTimesheetMutation,
        { data: timesheetData, loading, error },
    ] = useGetorCreateTimesheetMutation();

    const { data, _loading, _error } = useGetTimeEntryRowsQuery({
        variables: {
            timesheetId: timesheetData?.getorCreateTimesheet?.id ?? "-1",
        },
    });

    const { timesheetDates, startDate, periodLength } =
        useTimesheetDates(timesheetData);

    const { timesheet } = useTimesheet(
        data,
        timesheetDates,
        getorCreateTimesheetMutation,
        String(userId)
    );

    const [createTimeEntryRowMutation] = useCreateTimeEntryRowMutation();

    const createTimeEntryRow = () => {
        createTimeEntryRowMutation({
            variables: {
                timesheetId: timesheetData?.getorCreateTimesheet?.id ?? "-1",
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
                        timesheetId:
                            timesheetData?.getorCreateTimesheet?.id ?? "-1",
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
                        timesheetId:
                            timesheetData?.getorCreateTimesheet?.id ?? "-1",
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
                Header: "Department",
                accessor: (row) => row.department.id,
                id: "department",
                Cell: ({ value, row, column, timesheetId }) => (
                    <TimesheetDepartmentInput
                        value={value}
                        row={row}
                        column={column}
                        userId={userId}
                        timesheetId={timesheetId}
                    />
                ),
            },
            {
                Header: "Project",
                accessor: (row) => row.project.id,
                id: "project",
                Cell: ({ value, row, column, timesheetId }) => (
                    <TimesheetProjectInput
                        value={value}
                        row={row}
                        column={column}
                        userId={userId}
                        timesheetId={timesheetId}
                    />
                ),
            },
            {
                Header: "Work Type",
                accessor: (row) => row.workType.id,
                id: "workType",
                Cell: ({ value, row, column, timesheetId }) => (
                    <TimesheetWorkCodeInput
                        value={value}
                        row={row}
                        column={column}
                        userId={userId}
                        timesheetId={timesheetId}
                    />
                ),
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
                                    className={`w-16 box-border ${dayFeatures.style}`}
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
                        accessor: (row) => row.timeEntries[i],
                        id: date.toFormat("dd"),
                        Cell: ({ value, row, timesheetId }) => (
                            <TimesheetEntryInput
                                value={value}
                                timesheetId={timesheetId}
                                row={row}
                                date={date}
                                userId={userId}
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
                Cell: (props) => (
                    <TimesheetDeleteEntryInput {...props} userId={userId} />
                ),
            },
        ],
        [timesheetDates, userId]
    );

    return (
        <>
            {data && (
                <div className="w-full flex flex-col">
                    <div className="text-center w-full">
                        <TimesheetDateInput
                            periodLength={periodLength}
                            startDate={startDate}
                            userId={userId}
                        />
                    </div>
                    <TimesheetTable
                        timesheetId={
                            timesheetData?.getorCreateTimesheet?.id ?? "-1"
                        }
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
