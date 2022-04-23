import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import moment from "moment";
import MediaQuery from "react-responsive";
import PropTypes from "prop-types";

import TimesheetEntryInput from "../components/TimesheetEntryInput";
import TimesheetDeleteEntryInput from "../components/TimesheetDeleteEntryInput";
import TimesheetSubmitInput from "../components/TimesheetSubmitInput";
import TimesheetApprovalStatus from "../components/TimesheetApprovalStatus";
import TimesheetPrintSummary from "../components/TimesheetPrintSummary";
import TimesheetDepartmentInput from "../components/TimesheetDepartmentInput";
import TimesheetProjectInput from "../components/TimesheetProjectInput";
import TimesheetWorkCodeInput from "../components/TimesheetWorkCodeInput";

/**
 * @name TimesheetMobileView
 * @component
 * @category Time Entry
 * @description Provides a view for Mobile size screens.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetMobileView = ({
  userInfo,
  timesheet,
  type,
  setIsLocked,
  disableModification,
  timeEntryPeriodStartDate,
  workCodes,
  departments,
  projects,
  setSkipPageReset,
  addNewEntryRow,
  periodTotalHours,
}) => {
  return (
    <MediaQuery maxWidth={768}>
      <Row>
        <Col xs={8}>
          <h5>Timesheet</h5>
          <h4 style={{ fontWeight: "bold" }}>
            {userInfo.user.FirstName + " " + userInfo.user.LastName}
          </h4>
        </Col>
        <Col className="text-right">
          <TimesheetPrintSummary
            Employee={userInfo.user}
            timeEntryPeriodStartDate={timeEntryPeriodStartDate}
          />
        </Col>
      </Row>

      <hr />
      <Row>
        <Col>
          <div className="float-right" style={{ fontSize: "0.8rem " }}>
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
      <hr />
      {timesheet.initialLoad && (
        <>
          {timesheet.hourEntries.map((row, rowIndex) => {
            let parsedValues = row.dates.map((date, index) => ({
              [index]: date,
            }));
            return (
              <Card key={rowIndex} className="my-1">
                <Card.Body>
                  <Row
                    style={{ position: "relative" }}
                    className="text-center "
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: -20,
                        right: 0,
                      }}
                    >
                      <TimesheetDeleteEntryInput
                        row={{
                          index: rowIndex,
                          values: parsedValues,
                        }}
                        data={timesheet.hourEntries}
                        setIsLocked={setIsLocked}
                        disableModification={disableModification}
                        EmployeeID={userInfo.user.EmployeeID}
                        timeEntryPeriodStartDate={timeEntryPeriodStartDate}
                      />
                    </div>
                    <Col>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          padding: 10,
                        }}
                      >
                        Department
                      </div>

                      <TimesheetDepartmentInput
                        value={row.DepartmentID}
                        row={{
                          original: row,
                          index: rowIndex,
                        }}
                        column={{
                          id: "DepartmentID",
                        }}
                        type={type}
                        data={timesheet.hourEntries}
                        workCodes={workCodes}
                        departments={departments}
                        project={projects}
                        disableModification={disableModification}
                        setSkipPageReset={setSkipPageReset}
                        setIsLocked={setIsLocked}
                        EmployeeID={userInfo.user.EmployeeID}
                        timeEntryPeriodStartDate={timeEntryPeriodStartDate}
                      />
                    </Col>
                    <Col>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          padding: 10,
                        }}
                      >
                        Project
                      </div>

                      <TimesheetProjectInput
                        value={row.ProjectID}
                        row={{
                          original: row,
                          index: rowIndex,
                        }}
                        type={type}
                        column={{ id: "ProjectID" }}
                        data={timesheet.hourEntries}
                        workCodes={workCodes}
                        departments={departments}
                        project={projects}
                        disableModification={disableModification}
                        setSkipPageReset={setSkipPageReset}
                        setIsLocked={setIsLocked}
                        EmployeeID={userInfo.user.EmployeeID}
                        timeEntryPeriodStartDate={timeEntryPeriodStartDate}
                      />
                    </Col>
                    <Col>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          padding: 10,
                        }}
                      >
                        Work Code
                      </div>

                      <TimesheetWorkCodeInput
                        value={row.WorkCodeID}
                        row={{
                          original: row,
                          index: rowIndex,
                        }}
                        column={{
                          id: "WorkCodeID",
                        }}
                        type={type}
                        data={timesheet.hourEntries}
                        workCodes={workCodes}
                        departments={departments}
                        project={projects}
                        disableModification={disableModification}
                        setSkipPageReset={setSkipPageReset}
                        setIsLocked={setIsLocked}
                        EmployeeID={userInfo.user.EmployeeID}
                        timeEntryPeriodStartDate={timeEntryPeriodStartDate}
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col>
                      <h5>Date</h5>
                    </Col>
                    <Col>
                      <h5>Hours</h5>
                    </Col>
                  </Row>
                  <div style={{ maxHeight: 1000 }}>
                    {row.dates.map((date, dateIndex) => {
                      // if (date.HoursWorked < 1) return null
                      return (
                        <Row
                          key={dateIndex}
                          style={{
                            paddingTop: 10,
                            paddingBottom: 10,
                          }}
                        >
                          <Col>{moment.utc(date.DateofWork).format("L")}:</Col>
                          <Col>
                            <div>
                              <TimesheetEntryInput
                                value={date}
                                row={{
                                  index: rowIndex,
                                  original: row,
                                }}
                                columnIndex={dateIndex + 4}
                                data={timesheet.hourEntries}
                                disableModification={disableModification}
                                setSkipPageReset={setSkipPageReset}
                                setIsLocked={setIsLocked}
                                EmployeeID={userInfo.user.EmployeeID}
                                timeEntryPeriodStartDate={
                                  timeEntryPeriodStartDate
                                }
                              />
                            </div>
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </>
      )}
      {!disableModification && (
        <div className="text-center py-2">
          <Button onClick={addNewEntryRow} size="sm" variant="success">
            New Entry Row
          </Button>
        </div>
      )}
      <hr />
      <Row>
        <Col className="text-right">
          <h5>Period Total: {periodTotalHours} Hours</h5>
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
          />
        </Col>
      </Row>
      <hr />
    </MediaQuery>
  );
};

TimesheetMobileView.propTypes = {
  userInfo: PropTypes.object.isRequired,
  disableModification: PropTypes.bool.isRequired,
  timesheet: PropTypes.object.isRequired,
  timeEntryPeriodStartDate: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  addNewEntryRow: PropTypes.func.isRequired,
  setSkipPageReset: PropTypes.func.isRequired,
  setIsLocked: PropTypes.func.isRequired,
  periodTotalHours: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  workCodes: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  departments: PropTypes.array.isRequired,
};

export default TimesheetMobileView;
