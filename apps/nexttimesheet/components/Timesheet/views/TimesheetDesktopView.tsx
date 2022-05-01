import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import MediaQuery from "react-responsive";

import ErrorBoundary from "../../common/ErrorBoundary";
import TimesheetApprovalInput from "../components/TimesheetApprovalInput";
import TimesheetApprovalStatus from "../components/TimesheetApprovalStatus";
import TimesheetDateInput from "../DateInput";
import TimesheetDeleteUnused from "../components/TimesheetDeleteUnused";
import TimesheetPrintSummary from "../components/TimesheetPrintSummary";
import TimesheetShowAllComments from "../components/TimesheetShowAllComments";
import TimesheetSortRows from "../components/TimesheetSortRows";
import TimesheetSubmitInput from "../components/TimesheetSubmitInput";
import TimesheetTemplateInput from "../components/TimesheetTemplateInput";
import TimesheetTable from "../Table";

/**
 * @name TimesheetDesktopView
 * @component
 * @category Time Entry
 * @description Provides a view for desktop size screens.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetDesktopView = ({
    userInfo,
    disableModification,
    timesheet,
    setTimeEntryPeriodStartDate,
    timeEntryPeriodStartDate,
    updateEntryStartDate,
    type,
    dailyTotals,
    timeSheetLoading,
    addNewEntryRow,
    columns,
    skipPageReset,
    setSkipPageReset,
    setIsLocked,
    periodTotalHours,
    pinnedRows,
}) => {
    return (
        <MediaQuery minWidth={1280}>
            <div className="">
                <div>
                    <div>
                        <div>
                            <h5>Timesheet</h5>
                            <h4 style={{ fontWeight: "bold" }}>
                                {userInfo.user.FirstName +
                                    " " +
                                    userInfo.user.LastName}
                            </h4>
                        </div>
                        <div className="text-center my-auto">
                            <TimesheetDateInput
                                onDateChange={(date) =>
                                    setTimeEntryPeriodStartDate(
                                        moment(date).subtract(12, "hours")
                                    )
                                }
                                startDate={timeEntryPeriodStartDate}
                                updateEntryStartDate={updateEntryStartDate}
                            />
                        </div>
                        <div className="text-right">
                            <TimesheetPrintSummary
                                Employee={userInfo.user}
                                timeEntryPeriodStartDate={
                                    timeEntryPeriodStartDate
                                }
                            />
                        </div>
                    </div>
                    <hr />

                    <div style={{ marginBottom: 10 }}>
                        <div>
                            <TimesheetTemplateInput
                                disableModification={disableModification}
                                timesheetEntries={[
                                    ...timesheet.hourEntries,
                                    {
                                        ProjectID: 514,
                                        WorkCodeID: 62,
                                        dates: timesheet.alternateEntries,
                                    },
                                ]}
                                timesheet={timesheet}
                                lastDay={
                                    timesheet.workDays.slice(-1)[0]
                                        ? timesheet.workDays.slice(-1)[0]
                                              .DateofWork
                                        : null
                                }
                                templates={timesheet.templates}
                                userInfo={userInfo}
                            />
                            <TimesheetSortRows
                                disableModification={disableModification}
                                EmployeeID={userInfo.user.EmployeeID}
                            />
                            <TimesheetDeleteUnused
                                disableModification={disableModification}
                                EmployeeID={userInfo.user.EmployeeID}
                                timeEntryPeriodStartDate={
                                    timeEntryPeriodStartDate
                                }
                            />
                            <TimesheetShowAllComments
                                disableModification={disableModification}
                                timesheet={timesheet}
                                userInfo={userInfo}
                                timeEntryPeriodStartDate={
                                    timeEntryPeriodStartDate
                                }
                            />
                        </div>

                        <div>
                            <div className="float-right">
                                <TimesheetApprovalStatus
                                    approval={timesheet.approval}
                                    timesheet={[
                                        ...timesheet.hourEntries,
                                        {
                                            ProjectID: 514,
                                            WorkCodeID: 62,
                                            dates: timesheet.alternateEntries,
                                        },
                                    ]}
                                    type={type}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div>
                            {timesheet.initialLoad && (
                                <>
                                    <ErrorBoundary>
                                        <TimesheetTable
                                            dailyTotals={dailyTotals}
                                            loading={timeSheetLoading}
                                            disableModification={
                                                disableModification
                                            }
                                            addNewEntryRow={addNewEntryRow}
                                            alternateData={
                                                timesheet.alternateEntries
                                            }
                                            columns={columns}
                                            data={timesheet.hourEntries}
                                            skipPageReset={skipPageReset}
                                            workCodes={userInfo.workCodes}
                                            setSkipPageReset={setSkipPageReset}
                                            dayComments={timesheet.dayComments}
                                            workDays={timesheet.workDays}
                                            EmployeeID={
                                                userInfo.user.EmployeeID
                                            }
                                            setIsLocked={setIsLocked}
                                            timeEntryPeriodStartDate={
                                                timeEntryPeriodStartDate
                                            }
                                            pinnedRows={pinnedRows}
                                            type={type}
                                        />
                                    </ErrorBoundary>
                                </>
                            )}
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div className="text-right">
                            <h4>Period Total: {periodTotalHours} Hours</h4>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div className="text-right">
                            <TimesheetSubmitInput
                                disableModification={disableModification}
                                workDays={timesheet.workDays}
                                totalHours={periodTotalHours}
                                userInfo={userInfo}
                                timesheet={[
                                    ...timesheet.hourEntries,
                                    {
                                        ProjectID: 514,
                                        WorkCodeID: 62,
                                        dates: timesheet.alternateEntries,
                                    },
                                ]}
                                ApprovalID={timesheet.approval.ApprovalID}
                                lastDay={
                                    timesheet.workDays.slice(-1)[0]
                                        ? timesheet.workDays.slice(-1)[0]
                                              .DateofWork
                                        : null
                                }
                                timeEntryPeriodStartDate={
                                    timeEntryPeriodStartDate
                                }
                                type={type}
                            />
                        </div>
                    </div>
                    {(type === "manager" || type === "payroll") && (
                        <>
                            <hr />
                            <div className="float-right">
                                <TimesheetApprovalInput
                                    approval={timesheet.approval}
                                    EmployeeID={userInfo.user.EmployeeID}
                                    type={type}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MediaQuery>
    );
};

TimesheetDesktopView.propTypes = {
    userInfo: PropTypes.object.isRequired,
    disableModification: PropTypes.bool.isRequired,
    timesheet: PropTypes.object.isRequired,
    setTimeEntryPeriodStartDate: PropTypes.func.isRequired,
    timeEntryPeriodStartDate: PropTypes.object.isRequired,
    updateEntryStartDate: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    dailyTotals: PropTypes.array.isRequired,
    timeSheetLoading: PropTypes.bool.isRequired,
    addNewEntryRow: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    skipPageReset: PropTypes.bool.isRequired,
    setSkipPageReset: PropTypes.func.isRequired,
    setIsLocked: PropTypes.func.isRequired,
    periodTotalHours: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,

    pinnedRows: PropTypes.array,
};

export default TimesheetDesktopView;
