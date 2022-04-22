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
    CreateTimeEntryRowDocument,
    GetTimeEntryRowsDocument,
    useCreateTimeEntryRowMutation,
    useGetorCreateTimesheetMutation,
    useGetTimeEntryRowsQuery,
} from "../../../api";
import { readUserWorkCodesDispatch } from "../../../redux/actions/employeesActions";
import { readSubordinateWorkCodesDispatch } from "../../../redux/actions/subordinatesActions";
import { readTemplatesDispatch } from "../../../redux/actions/templatesActions";
import {
    createTimeEntryRowDispatch,
    readTimesheetDispatch,
} from "../../../redux/actions/timesheetsActions";
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

// const useTimesheet = ({
//     settings,
//     timesheet,
//     readTimesheetDispatch,
//     readUserWorkCodesDispatch,
//     readTemplatesDispatch,
//     userInfo,
//     type,
//     readSubordinateWorkCodesDispatch,
// }) => {
//     const [timeEntryPeriodStartDate, setTimeEntryPeriodStartDate] = useState(
//         moment.utc(settings.CutOffDate)
//     );
//     const [skipPageReset, setSkipPageReset] = useState(false); // For inidcating to table plugin that it need to update or not.
//     const [timeSheetLoading, setTimeSheetLoading] = useState(true);
//     const [disableModification, setDisableModification] = useState(false);
//     const [dailyTotals, setDailyTotals] = useState([]);
//     const [periodTotalHours, setPeriodTotalHours] = useState(0);
//     const [isLocked, setIsLocked] = useState(false);

//     // Computes daily total hours
//     const getDailyTotals = useCallback(() => {
//         const totals = new Array(timesheet.workDays.length).fill(0);
//         timesheet.hourEntries.map((row) => {
//             row.dates.map((col, i) => {
//                 totals[i] += parseFloat(col.HoursWorked)
//                     ? parseFloat(col.HoursWorked)
//                     : 0;
//             });
//         });
//         return totals.map((total) => total.toFixed(2));
//     }, [timesheet.hourEntries, timesheet.workDays]);

//     // Computes period total hours
//     const sumDailyTotals = useCallback(() => {
//         return dailyTotals
//             .reduce((total, num) => total + parseFloat(num), 0)
//             .toFixed(2);
//     }, [dailyTotals]);

//     // Loads the timesheet and sets modification status when parametrs change
//     useEffect(() => {
//         setDisableModification(
//             timeEntryPeriodStartDate.isBefore(moment.utc(settings.CutOffDate))
//         );
//         readTimesheetDispatch(
//             userInfo.user.EmployeeID,
//             moment.utc(timeEntryPeriodStartDate).toDate(),
//             type
//         ).then((res) => {
//             if (res.status === 423 && type === "user") {
//                 setIsLocked(true);
//                 setTimeSheetLoading(false);
//                 // toast.warn(res.data)
//             }
//         });
//     }, [
//         timeEntryPeriodStartDate,
//         userInfo.user.EmployeeID,
//         type,
//         settings.CutOffDate,
//         readTimesheetDispatch,
//     ]);

//     // Runs at begining to load entry templates and workc codes
//     useEffect(() => {
//         readTemplatesDispatch(userInfo.user.EmployeeID);
//         if (type === "manager" || type === "payroll") {
//             readSubordinateWorkCodesDispatch(userInfo.user.EmployeeID);
//         } else {
//             readUserWorkCodesDispatch(userInfo.user.EmployeeID);
//         }
//     }, [
//         userInfo.user.EmployeeID,
//         type,
//         readTemplatesDispatch,
//         readSubordinateWorkCodesDispatch,
//         readUserWorkCodesDispatch,
//     ]);

//     // Runs whenever the timesheet is updated and updates the daily totals and the laoding bool
//     useEffect(() => {
//         if (timesheet.initialLoad) {
//             setDailyTotals(getDailyTotals());
//             setTimeSheetLoading(false);
//         }
//     }, [timesheet.initialLoad, getDailyTotals, timesheet.hourEntries]);

//     // Handles modification status based on date and payroll status.
//     useEffect(() => {
//         if (type === "payroll" && timesheet.approval.ApprovalStatus > 1) {
//             setDisableModification(true);
//         } else if (timesheet.approval.ApprovalStatus > 0) {
//             setDisableModification(true);
//         } else {
//             setDisableModification(
//                 timeEntryPeriodStartDate.isBefore(
//                     moment.utc(settings.CutOffDate)
//                 )
//             );
//         }
//     }, [
//         type,
//         timesheet.approval,
//         settings.CutOffDate,
//         timeEntryPeriodStartDate,
//     ]);

//     // const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1279 });
//     const [isTablet, setIsTablet] = React.useState(false);

//     // Sets local state when computations of hours are complete.
//     useEffect(() => {
//         setPeriodTotalHours(sumDailyTotals());
//     }, [dailyTotals, sumDailyTotals]);

//     return {
//         timeEntryPeriodStartDate,
//         setTimeEntryPeriodStartDate,
//         skipPageReset,
//         setSkipPageReset,
//         timeSheetLoading,
//         setTimeSheetLoading,
//         disableModification,
//         setDisableModification,
//         dailyTotals,
//         setDailyTotals,
//         periodTotalHours,
//         isLocked,
//         setIsLocked,
//         isTablet,
//     };
// };

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

    const { timesheetDates } = useTimesheetDates(timesheetData);

    const { timesheet } = useTimesheet(
        data,
        timesheetDates,
        getorCreateTimesheetMutation,
        userId
    );

    const [createTimeEntryRowMutation] = useCreateTimeEntryRowMutation();

    const createTimeEntryRow = () => {
        createTimeEntryRowMutation({
            variables: {
                timesheetId: timesheetData?.getorCreateTimesheet?.id ?? "-1",
            },
            //refetchQueries: [GetTimeEntryRowsDocument],
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
                const { getTimeEntryRows } = cache.readQuery({
                    query: GetTimeEntryRowsDocument,
                    variables: {
                        timesheetId:
                            timesheetData?.getorCreateTimesheet?.id ?? "-1",
                    },
                });
                cache.writeQuery({
                    query: GetTimeEntryRowsDocument,
                    variables: {
                        timesheetId:
                            timesheetData?.getorCreateTimesheet?.id ?? "-1",
                    },
                    data: {
                        getTimeEntryRows: [
                            ...getTimeEntryRows,
                            data?.createTimeEntryRow,
                        ],
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
                Cell: ({ value, row, column }) => (
                    <TimesheetWorkCodeInput
                        value={value}
                        row={row}
                        column={column}
                        userId={userId}
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

    // const tableData = React.useMemo(() => timesheet ?? [], [timesheet]);

    // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    //     useTable({
    //         columns,
    //         data: tableData,
    //     });

    // Initiates request to download the timesheet report printout.

    return (
        <>
            {data && (
                <>
                    <TimesheetTable
                        timesheetId={
                            timesheetData?.getorCreateTimesheet?.id ?? "-1"
                        }
                        data={timesheet}
                        columns={columns}
                        addNewEntryRow={createTimeEntryRow}
                    />
                </>
            )}
        </>
    );
};

export default Timesheet;
