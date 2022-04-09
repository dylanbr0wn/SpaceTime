/* eslint react/prop-types: 0 */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import moment from "moment";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LoadingOverlay from "react-loading-overlay";
import { useMediaQuery } from "react-responsive";

import TimesheetEntryInput from "./components/TimesheetEntryInput";
import TimesheetDeleteEntryInput from "./components/TimesheetDeleteEntryInput";
import {
    readTimesheetDispatch,
    createTimeEntryRowDispatch,
} from "../../../redux/actions/timesheetsActions";
import { readTemplatesDispatch } from "../../../redux/actions/templatesActions";
import { readSubordinateWorkCodesDispatch } from "../../../redux/actions/subordinatesActions";
import { readUserWorkCodesDispatch } from "../../../redux/actions/employeesActions";
import TimesheetMobileView from "./views/TimesheetMobileView";
import TimesheetDesktopView from "./views/TimesheetDesktopView";
import TimesheetTabletView from "./views/TimesheetTabletView";
import TimesheetDepartmentInput from "./components/TimesheetDepartmentInput";
import TimesheetProjectInput from "./components/TimesheetProjectInput";
import TimesheetWorkCodeInput from "./components/TimesheetWorkCodeInput";
import TimesheetPinInput from "./components/TimesheetPinInput";
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

const useTimesheet = ({
    settings,
    timesheet,
    readTimesheetDispatch,
    readUserWorkCodesDispatch,
    readTemplatesDispatch,
    userInfo,
    type,
    readSubordinateWorkCodesDispatch,
}) => {
    const [timeEntryPeriodStartDate, setTimeEntryPeriodStartDate] = useState(
        moment.utc(settings.CutOffDate)
    );
    const [skipPageReset, setSkipPageReset] = useState(false); //For inidcating to table plugin that it need to update or not.
    const [timeSheetLoading, setTimeSheetLoading] = useState(true);
    const [disableModification, setDisableModification] = useState(false);
    const [dailyTotals, setDailyTotals] = useState([]);
    const [periodTotalHours, setPeriodTotalHours] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    // Computes daily total hours
    const getDailyTotals = useCallback(() => {
        let totals = new Array(timesheet.workDays.length).fill(0);
        timesheet.hourEntries.map((row) => {
            row.dates.map((col, i) => {
                totals[i] += parseFloat(col.HoursWorked)
                    ? parseFloat(col.HoursWorked)
                    : 0;
            });
        });
        return totals.map((total) => total.toFixed(2));
    }, [timesheet.hourEntries, timesheet.workDays]);

    // Computes period total hours
    const sumDailyTotals = useCallback(() => {
        return dailyTotals
            .reduce((total, num) => total + parseFloat(num), 0)
            .toFixed(2);
    }, [dailyTotals]);

    //Loads the timesheet and sets modification status when parametrs change
    useEffect(() => {
        setDisableModification(
            timeEntryPeriodStartDate.isBefore(moment.utc(settings.CutOffDate))
        );
        readTimesheetDispatch(
            userInfo.user.EmployeeID,
            moment.utc(timeEntryPeriodStartDate).toDate(),
            type
        ).then((res) => {
            if (res.status === 423 && type === "user") {
                setIsLocked(true);
                setTimeSheetLoading(false);
                // toast.warn(res.data)
            }
        });
    }, [
        timeEntryPeriodStartDate,
        userInfo.user.EmployeeID,
        type,
        settings.CutOffDate,
        readTimesheetDispatch,
    ]);

    //Runs at begining to load entry templates and workc codes
    useEffect(() => {
        readTemplatesDispatch(userInfo.user.EmployeeID);
        if (type === "manager" || type === "payroll") {
            readSubordinateWorkCodesDispatch(userInfo.user.EmployeeID);
        } else {
            readUserWorkCodesDispatch(userInfo.user.EmployeeID);
        }
    }, [
        userInfo.user.EmployeeID,
        type,
        readTemplatesDispatch,
        readSubordinateWorkCodesDispatch,
        readUserWorkCodesDispatch,
    ]);

    //Runs whenever the timesheet is updated and updates the daily totals and the laoding bool
    useEffect(() => {
        if (timesheet.initialLoad) {
            setDailyTotals(getDailyTotals());
            setTimeSheetLoading(false);
        }
    }, [timesheet.initialLoad, getDailyTotals, timesheet.hourEntries]);

    //Handles modification status based on date and payroll status.
    useEffect(() => {
        if (type === "payroll" && timesheet.approval.ApprovalStatus > 1) {
            setDisableModification(true);
        } else if (timesheet.approval.ApprovalStatus > 0) {
            setDisableModification(true);
        } else {
            setDisableModification(
                timeEntryPeriodStartDate.isBefore(
                    moment.utc(settings.CutOffDate)
                )
            );
        }
    }, [
        type,
        timesheet.approval,
        settings.CutOffDate,
        timeEntryPeriodStartDate,
    ]);

    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1279 });

    //Sets local state when computations of hours are complete.
    useEffect(() => {
        setPeriodTotalHours(sumDailyTotals());
    }, [dailyTotals, sumDailyTotals]);

    return {
        timeEntryPeriodStartDate,
        setTimeEntryPeriodStartDate,
        skipPageReset,
        setSkipPageReset,
        timeSheetLoading,
        setTimeSheetLoading,
        disableModification,
        setDisableModification,
        dailyTotals,
        setDailyTotals,
        periodTotalHours,
        isLocked,
        setIsLocked,
        isTablet,
    };
};

/**
 * @name Timesheet
 * @component
 * @category Time Entry
 * @description Root timesheet screen componenet.
 * @param {Object} props Props. See propTypes for details.
 */
const Timesheet = ({
    userInfo,
    readTimesheetDispatch,
    createTimeEntryRowDispatch,
    readTemplatesDispatch,
    readSubordinateWorkCodesDispatch,
    readUserWorkCodesDispatch,
    settings,
    projects,
    departments,
    timesheet,
    type = "user",
    pinnedRows,
}) => {
    const {
        dailyTotals,

        timeEntryPeriodStartDate,
        setTimeSheetLoading,
        setTimeEntryPeriodStartDate,
        timeSheetLoading,
        disableModification,
        skipPageReset,
        setSkipPageReset,
        periodTotalHours,
        isLocked,
        setIsLocked,
        isTablet,
    } = useTimesheet({
        settings,
        timesheet,
        readTimesheetDispatch,
        readUserWorkCodesDispatch,
        readTemplatesDispatch,
        userInfo,
        type,
        readSubordinateWorkCodesDispatch,
    }); //Calling the cutom hook

    // Updates the timesheet start date by subtracting or adding 14 days
    const updateEntryStartDate = useCallback(
        (type) => {
            setTimeSheetLoading(true);
            let newDate = timeEntryPeriodStartDate;
            if (type === "add") newDate.add(14, "days");
            if (type === "subtract") newDate.subtract(14, "days");

            setTimeEntryPeriodStartDate(moment.utc(newDate));
        },
        [
            setTimeEntryPeriodStartDate,
            setTimeSheetLoading,
            timeEntryPeriodStartDate,
        ]
    );

    // React Table column setup.
    const columns = useMemo(
        () => [
            {
                // specifies delete row button column.
                Header: () => null, // No header
                id: "pinner", // It needs an ID
                // eslint-disable-next-line react/display-name
                Cell: (props) => (
                    <TimesheetPinInput
                        {...props}
                        type={type}
                        disableModification={disableModification}
                        isTablet={isTablet}
                    />
                ),
            },
            {
                Header: "Work", //Specifies type of work columns. Project, department and work code.
                columns: [
                    {
                        Header: "Department",
                        accessor: "DepartmentID",
                        // eslint-disable-next-line react/display-name
                        Cell: ({
                            value,
                            row,
                            column,
                            workCodes,
                            disableModification,
                            setIsLocked,
                        }) => (
                            <TimesheetDepartmentInput
                                type={type}
                                isTablet={isTablet}
                                // {...props}
                                disableModification={disableModification}
                                value={value}
                                row={row}
                                column={column}
                                workCodes={workCodes}
                                setIsLocked={setIsLocked}
                                EmployeeID={userInfo.user.EmployeeID}
                                timeEntryPeriodStartDate={
                                    timeEntryPeriodStartDate
                                }
                            />
                        ),
                    },
                    {
                        Header: "Project",
                        accessor: "ProjectID",
                        // eslint-disable-next-line react/display-name, react/prop-types
                        Cell: ({
                            value,
                            row,
                            column,
                            data,
                            workCodes,
                            disableModification,
                            setIsLocked,
                        }) => (
                            <TimesheetProjectInput
                                type={type}
                                isTablet={isTablet}
                                disableModification={disableModification}
                                value={value}
                                data={data}
                                row={row}
                                column={column}
                                workCodes={workCodes}
                                setIsLocked={setIsLocked}
                                EmployeeID={userInfo.user.EmployeeID}
                                timeEntryPeriodStartDate={
                                    timeEntryPeriodStartDate
                                }
                            />
                        ),
                    },
                    {
                        Header: "Work Code",
                        accessor: "WorkCodeID",
                        // eslint-disable-next-line react/display-name, react/prop-types
                        Cell: ({
                            value,
                            row,
                            column,
                            workCodes,
                            disableModification,
                            data,
                            setIsLocked,
                        }) => (
                            <TimesheetWorkCodeInput
                                type={type}
                                isTablet={isTablet}
                                disableModification={disableModification}
                                value={value}
                                row={row}
                                data={data}
                                column={column}
                                setIsLocked={setIsLocked}
                                workCodes={workCodes}
                                EmployeeID={userInfo.user.EmployeeID}
                                timeEntryPeriodStartDate={
                                    timeEntryPeriodStartDate
                                }
                            />
                        ),
                    },
                ],
                id: "work",
            },
            {
                Header: "Hours per Day", //specifies hours of work columns.
                columns: new Array(14).fill(undefined).map((v, i) => {
                    if (!timesheet.workDays || !timesheet.workDays[i]) return;
                    let day = moment(timesheet.workDays[i].DateofWork);
                    return {
                        // eslint-disable-next-line react/display-name
                        Header: () => {
                            return (
                                <>
                                    <div className="text-center">
                                        {day.format("dd")}
                                    </div>
                                    <div
                                        className="text-center"
                                        style={{ fontWeight: 400 }}
                                    >
                                        {day.format("M/D")}
                                    </div>
                                </>
                            );
                        },
                        accessor: `dates[${i}]`,
                        id: i + 1,
                        // eslint-disable-next-line react/display-name, react/prop-types
                        Cell: ({
                            value,
                            row,
                            columnIndex,
                            disableModification,
                            setIsLocked,
                        }) => (
                            <TimesheetEntryInput
                                isTablet={isTablet}
                                disableModification={disableModification}
                                value={value}
                                row={row}
                                columnIndex={columnIndex}
                                setIsLocked={setIsLocked}
                                type={type}
                                EmployeeID={userInfo.user.EmployeeID}
                                timeEntryPeriodStartDate={
                                    timeEntryPeriodStartDate
                                }
                            />
                        ),
                    };
                }),
                id: "hours",
            },
            {
                // specifies delete row button column.
                Header: () => null, // No header
                id: "deleter", // It needs an ID
                // eslint-disable-next-line react/display-name, react/prop-types
                Cell: (props) => (
                    <TimesheetDeleteEntryInput
                        isTablet={isTablet}
                        {...props}
                        disableModification={disableModification}
                        EmployeeID={userInfo.user.EmployeeID}
                        timeEntryPeriodStartDate={timeEntryPeriodStartDate}
                        // hourEntries={timesheet.hourEntries}
                    />
                ),
            },
        ],
        [
            isTablet,
            timesheet.workDays,
            disableModification,
            userInfo.user.EmployeeID,
            timeEntryPeriodStartDate,
            type,
        ]
    );

    //Callback to create a new row when the add new row button is pressed.
    const addNewEntryRow = useCallback(
        () =>
            createTimeEntryRowDispatch(
                userInfo.user.EmployeeID,
                timeEntryPeriodStartDate
            ),
        [
            createTimeEntryRowDispatch,
            userInfo.user.EmployeeID,
            timeEntryPeriodStartDate,
        ]
    );

    // Initiates request to download the timesheet report printout.

    return (
        <>
            <LoadingOverlay
                active={isLocked}
                text={
                    "Timesheet is locked. \n\n Your manager is reviewing your timesheet."
                }
                fadeSpeed={100}
                spinner={
                    <div>
                        <i className="fas fa-lock fa-7x" />
                    </div>
                }
                styles={{
                    overlay: (base) => ({
                        ...base,
                        background: "rgba(255, 255, 255, 0.7)",
                    }),
                    spinner: (base) => ({
                        ...base,
                        width: "100px",
                        "& svg circle": {
                            stroke: "rgba(50, 50, 50, 0.7)",
                        },
                    }),
                    content: (base) => ({
                        ...base,
                        color: "rgba(50, 50, 50, 0.7)",
                    }),
                }}
            >
                <LoadingOverlay
                    active={timeSheetLoading}
                    text="Loading timesheet..."
                    fadeSpeed={100}
                    spinner
                    styles={{
                        overlay: (base) => ({
                            ...base,
                            background: "rgba(255, 255, 255, 0.7)",
                        }),
                        spinner: (base) => ({
                            ...base,
                            width: "100px",
                            "& svg circle": {
                                stroke: "rgba(50, 50, 50, 0.7)",
                            },
                        }),
                        content: (base) => ({
                            ...base,
                            color: "rgba(50, 50, 50, 0.7)",
                        }),
                    }}
                >
                    <TimesheetDesktopView
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
                    <TimesheetTabletView
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
                    />
                </LoadingOverlay>
            </LoadingOverlay>
        </>
    );
};
Timesheet.propTypes = {
    userInfo: PropTypes.object.isRequired,
    createTimeEntryRowDispatch: PropTypes.func.isRequired,
    readUserWorkCodesDispatch: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    readTimesheetDispatch: PropTypes.func.isRequired,
    timesheet: PropTypes.object.isRequired,
    readTemplatesDispatch: PropTypes.func.isRequired,
    type: PropTypes.string,
    readSubordinateWorkCodesDispatch: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
    workCodes: PropTypes.array.isRequired,
    departments: PropTypes.array.isRequired,
    pinnedRows: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
    return {
        loading: state.apiCallsInProgress > 0,
        workCodes: state.workCodes,
        settings: state.settings || {},
        projects: state.projects,
        departments: state.departments,
        pinnedRows: state.currentUser.preferences.PinnedRows.Value,
    };
};

const mapDispatchToProps = {
    readTimesheetDispatch,
    createTimeEntryRowDispatch,
    readTemplatesDispatch,
    readSubordinateWorkCodesDispatch,
    readUserWorkCodesDispatch,
    // loadPinnedRows,
};

export default connect(mapStateToProps, mapDispatchToProps)(Timesheet);
