import { getPool } from "../../config/database";
import { DateTime, DateTimeOffset, Int } from "mssql";
import {
  getEndDateFromStartDate,
  handleDatabaseError,
  handleDatabaseResult,
} from "../services/utils";

/**
 * @async
 * @function dynamicsExport
 * @param {String} startDate Beggining of report period
 * @param {String} endDate End of report period
 * @returns {Object}
 * @description Execute procedure to produce dynamics report for period defined.
 */
export const dynamicsExport = async (startDate: Date, endDate: Date) => {
  try {
    let StartDate = new Date(startDate);
    let EndDate = new Date(endDate);
    let pool = await getPool();
    let report = await pool
      .request()
      .input("StartDate", DateTimeOffset, StartDate)
      .input("EndDate", DateTimeOffset, EndDate)
      .execute("pDynamicsExport");

    return handleDatabaseResult(report.recordset);
  } catch (err) {
    return handleDatabaseError(err);
  }
};

/**
 * @async
 * @function employeeTimeSheet
 * @param {int} EmployeeID Employee to report on.
 * @param {String} startDate Beggining of report period
 * @param {String} endDate End of report period
 * @returns {Object}
 * @description Execute procedure to produce empoloyee timesheet report for period defined.
 */
export const employeeTimeSheet = async (
  EmployeeID: number,
  startDate: Date,
  endDate: Date
) => {
  try {
    let StartDate = new Date(startDate);
    let EndDate = new Date(endDate);
    let pool = await getPool();
    let report = await pool
      .request()
      .input("EmployeeID", Int, EmployeeID)
      .input("StartDate", DateTime, StartDate)
      .input("EndDate", DateTime, EndDate)
      .execute("pEmployeeTimeSheet_s");

    return handleDatabaseResult(report.recordset);
  } catch (err) {
    return handleDatabaseError(err);
  }
};

/**
 * @async
 * @function tardyEmployeeTimeSheet
 * @param {String} startDate Tardy date period start
 * @returns {Object}
 * @description Execute procedure to read all employees who have yet to submit a timesheet.
 */
export const tardyEmployeeTimeSheet = async (startDate: Date) => {
  try {
    let EndDate = getEndDateFromStartDate(startDate);
    let StartDate = new Date(startDate);
    let pool = await getPool();
    let report = await pool
      .request()
      .input("StartDate", DateTime, StartDate)
      .input("EndDate", DateTime, EndDate)
      .execute("pTardyEmployeeList_s");

    return handleDatabaseResult(report.recordset);
  } catch (err) {
    return handleDatabaseError(err);
  }
};

/**
 * @async
 * @function readEmployeeTimeEntries
 * @param {int} EmployeeID Employee to get time entries for.
 * @param {String} startDate Start of time sheet period.
 * @returns {Object}
 * @description Read time entries for a 2 week period beginning at the startdate for an employee
 * defined by the EmployeeID
 */
export const employeeTimesheetPrint = async (
  EmployeeID: number,
  startDate: Date,
  endDate: Date
) => {
  try {
    let StartDate = new Date(startDate);
    let EndDate = new Date(endDate);
    let pool = await getPool();
    let timeEntries = await pool
      .request()
      .input("EmployeeID", Int, EmployeeID)
      .input("StartDate", DateTime, StartDate)
      .input("EndDate", DateTime, EndDate).query(`
                SELECT 
                    TimeEntry.*, 
                    Department.DeptName, 
                    SubmittedTimesheets.SubmissionDate, 
                    Project.Name as Project, 
                    Project.Description as ProjDescription,
                    WorkCode.Code as WorkCode,
                    WorkCode.Description as WorkCodeDescription,
                    Employee.LastName,
                    Employee.FirstName

                FROM TimeEntry
                LEFT JOIN Project LEFT JOIN Department ON Project.DepartmentID = Department.DepartmentID ON Project.ProjectID = TimeEntry.ProjectID
                LEFT JOIN WorkCode ON WorkCode.WorkCodeID = TimeEntry.WorkCodeID
                LEFT JOIN SubmittedTimesheets ON TimeEntry.SubmissionID = SubmittedTimesheets.SubmissionID
                LEFT JOIN Employee ON Employee.EmployeeID = TimeEntry.EmployeeID
                WHERE (DateofWork BETWEEN @StartDate AND @EndDate) 
                AND (TimeEntry.EmployeeID = @EmployeeID)
                AND (WorkCode.ExportToDynamics = 1)
                `);

    return handleDatabaseResult(timeEntries.recordset);
  } catch (err) {
    return handleDatabaseError(err);
  }
};
