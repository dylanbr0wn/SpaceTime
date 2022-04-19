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

import { useGetorCreateTimesheetMutation } from "../../../api";
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
    // const {
    //     dailyTotals,

    //     timeEntryPeriodStartDate,
    //     setTimeSheetLoading,
    //     setTimeEntryPeriodStartDate,
    //     timeSheetLoading,
    //     disableModification,
    //     skipPageReset,
    //     setSkipPageReset,
    //     periodTotalHours,
    //     isLocked,
    //     setIsLocked,
    //     isTablet,
    // } = useTimesheet({
    //     settings,
    //     timesheet,
    //     readTimesheetDispatch,
    //     readUserWorkCodesDispatch,
    //     readTemplatesDispatch,
    //     userInfo,
    //     type,
    //     readSubordinateWorkCodesDispatch,
    // }); // Calling the cutom hook
    const [type, setType] = React.useState("user");
    const { id: userId } = useParams();
    const [timesheet, setTimesheet] = React.useState([]);
    const [timesheetDates, setTimesheetDates] = React.useState<DateTime[]>([]);

    const [getorCreateTimesheetMutation, { data, loading, error }] =
        useGetorCreateTimesheetMutation({
            variables: {
                timesheet: {
                    userId: parseInt(userId ?? ""),
                    date: DateTime.now()
                        .startOf("day")
                        .toUTC()
                        .startOf("day")
                        .toISO(),
                },
            },
        });

    React.useEffect(() => {
        if (data) {
            const dates: DateTime[] = [];
            const endDate = DateTime.fromISO(
                data?.getorCreateTimesheet?.period.endDate,
                { zone: "utc" }
            );
            const startDate = DateTime.fromISO(
                data?.getorCreateTimesheet?.period.startDate,
                { zone: "utc" }
            );

            let current = startDate;
            while (current < endDate) {
                dates.push(current);
                current = current.plus({ days: 1 });
            }

            setTimesheetDates(dates);

            const timeEntryRows = data?.getorCreateTimesheet?.timeEntryRows.map(
                (row) => {
                    return {
                        ...row,
                        PeriodTimeEntries: dates.map((date) => {
                            const timeEntry = row.timeEntries.find(
                                (entry) => entry.date === date.toISO()
                            );

                            if (timeEntry) {
                                return {
                                    ...timeEntry,
                                    date,
                                };
                            } else {
                                return {
                                    date,
                                    id: null,
                                };
                            }
                        }),
                    };
                }
            );

            setTimesheet(timeEntryRows);
        } else {
            getorCreateTimesheetMutation({
                variables: {
                    timesheet: {
                        userId: parseInt(userId ?? ""),
                        date: DateTime.now()
                            .startOf("day")
                            .toUTC()
                            .startOf("day")
                            .toISO(),
                    },
                },
            });
        }
    }, [data, getorCreateTimesheetMutation, userId]);

    // Updates the timesheet start date by subtracting or adding 14 days

    const columns = React.useMemo(
        () => [
            {
                Header: "Department",
                accessor: "department.id",
                Cell: ({ value, row, column }) => (
                    <TimesheetDepartmentInput
                        value={value}
                        row={row}
                        column={column}
                        userId={userId}
                    />
                ),
            },
            {
                Header: "Project",
                accessor: "project.id",
                Cell: ({ value, row, column }) => (
                    <TimesheetProjectInput
                        value={value}
                        row={row}
                        column={column}
                        userId={userId}
                    />
                ),
            },
            {
                Header: "Work Type",
                accessor: "workType.id",
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
                    return {
                        Header: date.toFormat("dd"),
                        accessor: (row) => row.PeriodTimeEntries[i],
                        id: date.toFormat("dd"),
                        Cell: ({ value, row }) => (
                            <TimesheetEntryInput
                                value={value}
                                row={row}
                                date={date}
                                userId={userId}
                            />
                        ),
                    };
                }),
            },
        ],
        [timesheetDates, userId]
    );

    const tableData = React.useMemo(() => timesheet ?? [], [timesheet]);

    // React Table column setup.
    // const columns = useMemo(
    //     () => [
    //         // {
    //         //     // specifies delete row button column.
    //         //     Header: () => null, // No header
    //         //     id: "pinner", // It needs an ID
    //         //     // eslint-disable-next-line react/display-name
    //         //     Cell: (props) => (
    //         //         <TimesheetPinInput
    //         //             {...props}
    //         //             type={type}
    //         //             disableModification={disableModification}
    //         //             isTablet={isTablet}
    //         //         />
    //         //     ),
    //         // },
    //         // {
    //         //     Header: "Work", // Specifies type of work columns. Project, department and work code.
    //         //     columns: [
    //         //         {
    //         //             Header: "Department",
    //         //             accessor: "department.id",
    //         //             // eslint-disable-next-line react/display-name
    //         //             Cell: ({
    //         //                 value,
    //         //                 row,
    //         //                 column,
    //         //                 workCodes,
    //         //                 disableModification,
    //         //                 setIsLocked,
    //         //             }) => (
    //         //                 <TimesheetDepartmentInput
    //         //                     type={type}
    //         //                     isTablet={isTablet}
    //         //                     // {...props}
    //         //                     disableModification={disableModification}
    //         //                     value={value}
    //         //                     row={row}
    //         //                     column={column}
    //         //                     workCodes={workCodes}
    //         //                     setIsLocked={setIsLocked}
    //         //                     EmployeeID={userInfo.user.EmployeeID}
    //         //                     timeEntryPeriodStartDate={
    //         //                         timeEntryPeriodStartDate
    //         //                     }
    //         //                 />
    //         //             ),
    //         //         },
    //         //         {
    //         //             Header: "Project",
    //         //             accessor: "project.id",
    //         //             // eslint-disable-next-line react/display-name, react/prop-types
    //         //             Cell: ({
    //         //                 value,
    //         //                 row,
    //         //                 column,
    //         //                 data,
    //         //                 workCodes,
    //         //                 disableModification,
    //         //                 setIsLocked,
    //         //             }) => (
    //         //                 <TimesheetProjectInput
    //         //                     type={type}
    //         //                     isTablet={isTablet}
    //         //                     disableModification={disableModification}
    //         //                     value={value}
    //         //                     data={data}
    //         //                     row={row}
    //         //                     column={column}
    //         //                     workCodes={workCodes}
    //         //                     setIsLocked={setIsLocked}
    //         //                     EmployeeID={userInfo.user.EmployeeID}
    //         //                     timeEntryPeriodStartDate={
    //         //                         timeEntryPeriodStartDate
    //         //                     }
    //         //                 />
    //         //             ),
    //         //         },
    //         //         {
    //         //             Header: "Work Code",
    //         //             accessor: "workType.id",
    //         //             // eslint-disable-next-line react/display-name, react/prop-types
    //         //             Cell: ({
    //         //                 value,
    //         //                 row,
    //         //                 column,
    //         //                 workCodes,
    //         //                 disableModification,
    //         //                 data,
    //         //                 setIsLocked,
    //         //             }) => (
    //         //                 <TimesheetWorkCodeInput
    //         //                     type={type}
    //         //                     isTablet={isTablet}
    //         //                     disableModification={disableModification}
    //         //                     value={value}
    //         //                     row={row}
    //         //                     data={data}
    //         //                     column={column}
    //         //                     setIsLocked={setIsLocked}
    //         //                     workCodes={workCodes}
    //         //                     EmployeeID={userInfo.user.EmployeeID}
    //         //                     timeEntryPeriodStartDate={
    //         //                         timeEntryPeriodStartDate
    //         //                     }
    //         //                 />
    //         //             ),
    //         //         },
    //         //     ],
    //         //     id: "work",
    //         // },
    //         {
    //             Header: "Hours per Day", // specifies hours of work columns.
    //             columns: new Array(14).fill(undefined).map((v, i) => {
    //                 if (!timesheet.workDays || !timesheet.workDays[i])
    //                     return null;
    //                 const day = moment(timesheet.workDays[i].DateofWork);
    //                 const dayFeatures = getDayFeatures(day);

    //                 return {
    //                     // eslint-disable-next-line react/display-name
    //                     Header: () => {
    //                         return (
    //                             <div
    //                                 className={`w-16 box-border ${dayFeatures.style}`}
    //                             >
    //                                 <div className="text-center">
    //                                     {day.format("dd")}
    //                                 </div>
    //                                 <div
    //                                     className="text-center"
    //                                     style={{ fontWeight: 400 }}
    //                                 >
    //                                     {day.format("M/D")}
    //                                 </div>
    //                             </div>
    //                         );
    //                     },
    //                     accessor: `dates[${i}]`,
    //                     id: i + 1,
    //                     // eslint-disable-next-line react/display-name, react/prop-types
    //                     Cell: ({
    //                         value,
    //                         row,
    //                         columnIndex,
    //                         disableModification,
    //                         setIsLocked,
    //                     }) => (
    //                         <TimesheetEntryInput
    //                             disableModification={disableModification}
    //                             value={value}
    //                             row={row}
    //                             columnIndex={columnIndex}
    //                             setIsLocked={setIsLocked}
    //                             type={type}
    //                             EmployeeID={userInfo.user.EmployeeID}
    //                             timeEntryPeriodStartDate={
    //                                 timeEntryPeriodStartDate
    //                             }
    //                         />
    //                     ),
    //                 };
    //             }),
    //             id: "hours",
    //         },
    //         {
    //             // specifies delete row button column.
    //             Header: () => null, // No header
    //             id: "deleter", // It needs an ID
    //             // eslint-disable-next-line react/display-name, react/prop-types
    //             Cell: (props) => (
    //                 <TimesheetDeleteEntryInput
    //                     {...props}
    //                     disableModification={disableModification}
    //                     EmployeeID={userInfo.user.EmployeeID}
    //                     timeEntryPeriodStartDate={timeEntryPeriodStartDate}
    //                     // hourEntries={timesheet.hourEntries}
    //                 />
    //             ),
    //         },
    //     ],
    //     [
    //         timesheet.workDays,
    //         disableModification,
    //         userInfo.user.EmployeeID,
    //         timeEntryPeriodStartDate,
    //         type,
    //     ]
    // );

    // Callback to create a new row when the add new row button is pressed.
    // const addNewEntryRow = useCallback(
    //     () =>
    //         createTimeEntryRowDispatch(
    //             userInfo.user.EmployeeID,
    //             timeEntryPeriodStartDate
    //         ),
    //     [
    //         createTimeEntryRowDispatch,
    //         userInfo.user.EmployeeID,
    //         timeEntryPeriodStartDate,
    //     ]
    // );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({
            columns,
            data: tableData,
        });

    // Initiates request to download the timesheet report printout.

    return (
        <>
            {data && (
                <div className="text-white">
                    <table
                        className="bg-slate-900 my-2 border-cyan-500 border rounded-md table-auto"
                        {...getTableProps()}
                    >
                        <thead>
                            {headerGroups.map((headerGroup, headerIndex) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(
                                        (column, headerColumnIndex) => (
                                            <th {...column.getHeaderProps()}>
                                                {column.render("Header")}
                                            </th>
                                        )
                                    )}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row, rowIndex) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell, cellIndex) => {
                                            return (
                                                <td
                                                    className="border border-sky-500 p-0 m-0 box-border"
                                                    {...cell.getCellProps()}
                                                >
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* <TimesheetDesktopView
                userInfo={userInfo}
                disableModification={disableModification}
                timesheet={timesheet}
                setTimeEntryPeriodStartDate={setTimeEntryPeriodStartDate}
                timeEntryPeriodStartDate={timeEntryPeriodStartDate}
                updateEntryStartDate={updateEntryStartDate}
                type={type}
                dailyTotals={dailyTotals}
                timeSheetLoading={timeSheetLoading}
                addNewEntryRow={addNewEntryRow}
                columns={columns}
                skipPageReset={skipPageReset}
                setSkipPageReset={setSkipPageReset}
                setIsLocked={setIsLocked}
                periodTotalHours={periodTotalHours}
                pinnedRows={pinnedRows}
            /> */}
            {/* <TimesheetTabletView
                        isTablet={isTablet}
                        userInfo={userInfo}
                        disableModification={disableModification}
                        timesheet={timesheet}
                        setTimeEntryPeriodStartDate={
                            setTimeEntryPeriodStartDate
                        }
                        timeEntryPeriodStartDate={timeEntryPeriodStartDate}
                        updateEntryStartDate={updateEntryStartDate}
                        type={type}
                        dailyTotals={dailyTotals}
                        timeSheetLoading={timeSheetLoading}
                        addNewEntryRow={addNewEntryRow}
                        columns={columns}
                        skipPageReset={skipPageReset}
                        setSkipPageReset={setSkipPageReset}
                        setIsLocked={setIsLocked}
                        periodTotalHours={periodTotalHours}
                        pinnedRows={pinnedRows}
                    />

                    <TimesheetMobileView
                        userInfo={userInfo}
                        timesheet={timesheet}
                        type={type}
                        setIsLocked={setIsLocked}
                        disableModification={disableModification}
                        timeEntryPeriodStartDate={timeEntryPeriodStartDate}
                        workCodes={userInfo.workCodes}
                        departments={departments}
                        projects={projects}
                        setSkipPageReset={setSkipPageReset}
                        addNewEntryRow={addNewEntryRow}
                        periodTotalHours={periodTotalHours}
                    /> */}
        </>
    );
};
// Timesheet.propTypes = {
//     userInfo: PropTypes.object.isRequired,
//     createTimeEntryRowDispatch: PropTypes.func.isRequired,
//     readUserWorkCodesDispatch: PropTypes.func.isRequired,
//     settings: PropTypes.object.isRequired,
//     readTimesheetDispatch: PropTypes.func.isRequired,
//     timesheet: PropTypes.object.isRequired,
//     readTemplatesDispatch: PropTypes.func.isRequired,
//     type: PropTypes.string,
//     readSubordinateWorkCodesDispatch: PropTypes.func.isRequired,
//     projects: PropTypes.array.isRequired,
//     workCodes: PropTypes.array.isRequired,
//     departments: PropTypes.array.isRequired,
//     pinnedRows: PropTypes.array.isRequired,
// };

// const mapStateToProps = (state) => {
//     return {
//         loading: state.apiCallsInProgress > 0,
//         workCodes: state.workCodes,
//         settings: state.settings || {},
//         projects: state.projects,
//         departments: state.departments,
//         pinnedRows: state.currentUser.preferences.PinnedRows.Value,
//     };
// };

// const mapDispatchToProps = {
//     readTimesheetDispatch,
//     createTimeEntryRowDispatch,
//     readTemplatesDispatch,
//     readSubordinateWorkCodesDispatch,
//     readUserWorkCodesDispatch,
//     // loadPinnedRows,
// };

export default Timesheet;
