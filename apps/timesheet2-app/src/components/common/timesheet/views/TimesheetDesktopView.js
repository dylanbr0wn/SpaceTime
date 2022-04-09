import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import MediaQuery from "react-responsive";
import moment from "moment";
import PropTypes from "prop-types";

import TimesheetTable from "../TimesheetTable";
import TimesheetDateInput from "../components/TimesheetDateInput";
import TimesheetTemplateInput from "../components/TimesheetTemplateInput";
import TimesheetSubmitInput from "../components/TimesheetSubmitInput";
import ErrorBoundary from "../../ErrorBoundary";
import TimesheetApprovalInput from "../components/TimesheetApprovalInput";
import TimesheetApprovalStatus from "../components/TimesheetApprovalStatus";
import TimesheetPrintSummary from "../components/TimesheetPrintSummary";
import TimesheetSortRows from "../components/TimesheetSortRows";
import TimesheetDeleteUnused from "../components/TimesheetDeleteUnused";
import TimesheetShowAllComments from "../components/TimesheetShowAllComments";

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
      <Card className="userCard">
        <Card.Body>
          <Row>
            <Col>
              <h5>Timesheet</h5>
              <h4 style={{ fontWeight: "bold" }}>
                {userInfo.user.FirstName + " " + userInfo.user.LastName}
              </h4>
            </Col>
            <Col className="text-center my-auto">
              <TimesheetDateInput
                onDateChange={(date) =>
                  setTimeEntryPeriodStartDate(
                    moment(date).subtract(12, "hours")
                  )
                }
                startDate={timeEntryPeriodStartDate}
                updateEntryStartDate={updateEntryStartDate}
              />
            </Col>
            <Col className="text-right">
              <TimesheetPrintSummary
                Employee={userInfo.user}
                timeEntryPeriodStartDate={timeEntryPeriodStartDate}
              />
            </Col>
          </Row>
          <hr />

          <Row style={{ marginBottom: 10 }}>
            <Col>
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
                    ? timesheet.workDays.slice(-1)[0].DateofWork
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
                timeEntryPeriodStartDate={timeEntryPeriodStartDate}
              />
              <TimesheetShowAllComments
                disableModification={disableModification}
                timesheet={timesheet}
                userInfo={userInfo}
                timeEntryPeriodStartDate={timeEntryPeriodStartDate}
              />
            </Col>

            <Col>
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
            </Col>
          </Row>
          <Row>
            <Col>
              {timesheet.initialLoad && (
                <>
                  <ErrorBoundary>
                    <TimesheetTable
                      dailyTotals={dailyTotals}
                      loading={timeSheetLoading}
                      disableModification={disableModification}
                      addNewEntryRow={addNewEntryRow}
                      alternateData={timesheet.alternateEntries}
                      columns={columns}
                      data={timesheet.hourEntries}
                      skipPageReset={skipPageReset}
                      workCodes={userInfo.workCodes}
                      setSkipPageReset={setSkipPageReset}
                      dayComments={timesheet.dayComments}
                      workDays={timesheet.workDays}
                      EmployeeID={userInfo.user.EmployeeID}
                      setIsLocked={setIsLocked}
                      timeEntryPeriodStartDate={timeEntryPeriodStartDate}
                      pinnedRows={pinnedRows}
                      type={type}
                    />
                  </ErrorBoundary>
                </>
              )}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="text-right">
              <h4>Period Total: {periodTotalHours} Hours</h4>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="text-right">
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
                    ? timesheet.workDays.slice(-1)[0].DateofWork
                    : null
                }
                timeEntryPeriodStartDate={timeEntryPeriodStartDate}
                type={type}
              />
            </Col>
          </Row>
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
        </Card.Body>
      </Card>
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
