import { VarChar, Int, Bit, DateTime, BigInt, NVarChar } from "mssql";
import { getPool } from "../../config/database";
import { UserInfo, WorkCode } from "../services/types";
import {
    getEndDateFromStartDate,
    handleDatabaseError,
    handleDatabaseResult,
    parseDayComments,
} from "../services/utils";

/**
 * @async
 * @function readAllEmployees
 * @description Queries all user/employee objects.
 */
export const readAllEmployees = async () => {
    try {
        const pool = await getPool();
        const result1 = await pool.request()
            .query(`SELECT Employee.*, Department.DeptName, UserLogin.Username, UserLogin.UserID
            FROM Employee
            LEFT JOIN Department ON Employee.DepartmentID = Department.DepartmentID
            LEFT JOIN UserLogin ON Employee.EmployeeID = UserLogin.EmployeeID;`);

        return handleDatabaseResult(result1.recordset);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @function createEmployee
 * @async
 * @param {Object} employee
 * @description
 * Create a new employee in the the Employee table.
 */
export const createEmployee = async (employee: UserInfo) => {
    try {
        const pool = await getPool();
        const employeeInfo = await pool
            .request()
            .input("SAMAccountName", VarChar(50), employee.SAMAccountName)
            .input("LastName", VarChar(50), employee.LastName)
            .input("FirstName", VarChar(50), employee.FirstName)
            .input("DiamondEmpID", VarChar(50), employee.DiamondEmpID)
            .input("DepartmentID", Int, employee.DepartmentID)
            .input("SupervisorID", Int, employee.SupervisorID)
            .input("IsActive", Bit, employee.IsActive)
            .input("IsSupervisor", Bit, employee.IsSupervisor)
            .input("IsAdministrator", Bit, employee.IsAdministrator)
            .input("IsPayrollClerk", Bit, employee.IsPayrollClerk)
            .input("Email", VarChar(50), employee.Email)
            .execute("colsp_createEmployee");

        return handleDatabaseResult(employeeInfo.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @function readEmployee
 * @async
 * @param {int} userID
 * @description
 * For getting user/employee object after login.
 */
export const readEmployee = async (EmployeeID: number) => {
    try {
        const pool = await getPool();
        const employeeInfo = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .query(`SELECT Employee.*, Department.DeptName
            FROM Employee 
            INNER JOIN Department ON Department.DepartmentID = Employee.DepartmentID 
            WHERE EmployeeID = @EmployeeID`);

        return handleDatabaseResult(employeeInfo.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const ParseEmployee = (data: {
    DepartmentID: string | number;
    DeptName: string;
    EmployeeID: string | number;
    DiamondEmpID: string;
    Email: string;
    FirstName: string;
    LastName: string;
    IsAdministrator: boolean;
    IsPayrollClerk: boolean;
    IsActive: boolean;
    SupervisorID: string | number;
    SAMAccountName: string;
}): UserInfo => {
    const newEmployee: UserInfo = {
        DepartmentID: +data.DepartmentID,
        DeptName: data.DeptName,
        EmployeeID: +data.EmployeeID,
        DiamondEmpID: data.DiamondEmpID,
        Email: data.Email,
        FirstName: data.FirstName,
        LastName: data.LastName,
        IsAdministrator: data.IsAdministrator,
        IsSupervisor: data.IsAdministrator,
        IsPayrollClerk: data.IsPayrollClerk,
        IsActive: data.IsActive,
        SupervisorID: +data.SupervisorID,
        SAMAccountName: data.SAMAccountName,
    };

    return newEmployee;
};

export const readEmployeeFromSAMAccountName = async (
    SAMAccountName: string
) => {
    try {
        const pool = await getPool();
        const employeeInfo = await pool
            .request()
            .input("SAMAccountName", VarChar, SAMAccountName)
            .query(`SELECT Employee.*, Department.DeptName
            FROM Employee 
            INNER JOIN Department ON Department.DepartmentID = Employee.DepartmentID 
            WHERE SAMAccountName = @SAMAccountName`);

        return handleDatabaseResult(ParseEmployee(employeeInfo.recordset[0]));
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const readEmployeeFromEmail = async (Email: string) => {
    try {
        const pool = await getPool();
        const employeeInfo = await pool
            .request()
            .input("Email", VarChar, Email)
            .input("IsActive", Bit, true)
            .query(`SELECT Employee.*, Department.DeptName
            FROM Employee 
            INNER JOIN Department ON Department.DepartmentID = Employee.DepartmentID 
            WHERE Email = @Email AND Employee.IsActive = @IsActive`);

        return handleDatabaseResult(employeeInfo.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @function updateEmployee
 * @async
 * @param {Object} employee Employee object to update
 * @description
 * Update an employee in the Employee table using EmployeeID
 */
export const updateEmployee = async (employee: UserInfo) => {
    try {
        const pool = await getPool();
        const employeeInfo = await pool
            .request()
            .input("EmployeeID", Int, employee.EmployeeID)
            .input("SAMAccountName", VarChar(50), employee.SAMAccountName)
            .input("LastName", VarChar(50), employee.LastName)
            .input("FirstName", VarChar(50), employee.FirstName)
            .input("DiamondEmpID", VarChar(50), employee.DiamondEmpID)
            .input("DepartmentID", Int, employee.DepartmentID)
            .input("SupervisorID", Int, employee.SupervisorID)
            .input("IsActive", Bit, employee.IsActive)
            .input("IsSupervisor", Bit, employee.IsSupervisor)
            .input("IsAdministrator", Bit, employee.IsAdministrator)
            .input("IsPayrollClerk", Bit, employee.IsPayrollClerk)
            .input("Email", VarChar(50), employee.Email).query(`
            UPDATE Employee 
            SET SAMAccountName = @SAMAccountName,
            LastName = @LastName,
            FirstName = @FirstName,
            DiamondEmpID = @DiamondEmpID,
            DepartmentID = @DepartmentID,
            SupervisorID = @SupervisorID,
            IsActive = @IsActive,
            IsSupervisor = @IsSupervisor,
            IsAdministrator = @IsAdministrator,
            IsPayrollClerk = @IsPayrollClerk,
            Email = @Email
            OUTPUT inserted.*
            WHERE EmployeeID = @EmployeeID;
            `);

        return handleDatabaseResult(employeeInfo.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @function readUserWorkCodes
 * @async
 * @param {int} EmployeeID
 * @description
 * Queries work code objects associated with the EmployeeID
 */
export const readEmployeeWorkCodes = async (EmployeeID: number) => {
    try {
        const pool = await getPool();

        const workCodes = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .query(
                "SELECT WorkCode.* FROM EmployeeWorkCode INNER JOIN WorkCode ON EmployeeWorkCode.WorkCodeID = WorkCode.WorkCodeID WHERE EmployeeWorkCode.EmployeeID = @EmployeeID"
            );

        return handleDatabaseResult(workCodes.recordset);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @function updateEmployeeWorkCodes
 * @async
 * @param {int} EmployeeID
 * @param {Array} workCodes
 * @description
 * Updates all employee work code references in the EmployeeWorkCode table.
 * Done by deleting all current references and inserting a new set of references.
 * Saves comparing the new set to the old set and inserting and deleting by hand.
 */
export const updateEmployeeWorkCodes = async (
    EmployeeID: number,
    workCodes: WorkCode[]
) => {
    try {
        const pool = await getPool();
        await pool.request().input("EmployeeID", Int, EmployeeID).query(`
            DELETE FROM EmployeeWorkCode
            WHERE EmployeeID = @EmployeeID;
            `);

        const values = workCodes
            .map((code) => "(" + EmployeeID + "," + code.WorkCodeID + ")")
            .join();
        const employeeWorkCodes = await pool.request()
            .query(`INSERT INTO EmployeeWorkCode (EmployeeID,WorkCodeID) 
            OUTPUT inserted.* 
            VALUES ${values}`);
        return handleDatabaseResult(employeeWorkCodes.recordset);
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
export const readEmployeeTimeEntries = async (
    EmployeeID: number,
    startDate: Date
) => {
    try {
        const EndDate = getEndDateFromStartDate(startDate);
        const pool = await getPool();
        const timeEntries = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .input("StartDate", DateTime, startDate)
            .input("EndDate", DateTime, EndDate).query(`
                SELECT TimeEntry.*, Department.DepartmentID, SubmittedTimesheets.SubmissionDate, WorkCode.Description AS WCName, Department.DeptName as DeptName, Project.Name AS ProjName
                FROM TimeEntry
                LEFT JOIN Project LEFT JOIN Department ON Project.DepartmentID = Department.DepartmentID ON Project.ProjectID = TimeEntry.ProjectID
                LEFT JOIN WorkCode ON WorkCode.WorkCodeID = TimeEntry.WorkCodeID
                LEFT JOIN SubmittedTimesheets ON TimeEntry.SubmissionID = SubmittedTimesheets.SubmissionID
                WHERE (DateofWork BETWEEN @StartDate AND @EndDate) 
                AND (TimeEntry.EmployeeID = @EmployeeID)`);

        return handleDatabaseResult(timeEntries.recordset);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function readEmployeeTimeEntryComments
 * @param {int} EmployeeID Employee to get time entry comments for.
 * @param {String} startDate Start of time sheet period.
 * @returns {Object}
 * @description Read time entry Comments for a 2 week period beginning at the startdate for an employee
 * defined by the EmployeeID
 */
export const readEmployeeTimeEntryComments = async (
    EmployeeID: number,
    startDate: Date
) => {
    try {
        const EndDate = getEndDateFromStartDate(startDate);
        const StartDate = new Date(startDate);
        const pool = await getPool();

        const timeEntries = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .input("StartDate", DateTime, StartDate)
            .input("EndDate", DateTime, EndDate).query(`
                SELECT *
                FROM DayComment
                WHERE (DateofComment BETWEEN @StartDate AND @EndDate) 
                AND (EmployeeID = @EmployeeID)`);

        return handleDatabaseResult(
            parseDayComments(timeEntries.recordset, startDate, EmployeeID)
        );
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function readTimeSheetTemplate
 * @param {int} EmployeeID Employee to get templates.
 * @returns {Object}
 * @description Read templates for an employee defined by thier EmployeeID.
 */
export const readTimeSheetTemplate = async (EmployeeID: number) => {
    try {
        const pool = await getPool();
        const templates = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID).query(`
                SELECT * FROM Template
                WHERE Template.EmployeeID = @EmployeeID;
                `);

        return handleDatabaseResult(templates.recordset, 200);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const readTimeSheetPeriodLoggedTime = async (
    SupervisorID: number,
    startDate: Date
) => {
    try {
        const EndDate = getEndDateFromStartDate(startDate);
        const pool = await getPool();
        const loggedTime = await pool
            .request()
            .input("SupervisorID", Int, SupervisorID)
            .input("StartDate", DateTime, startDate)
            .input("EndDate", DateTime, EndDate).query(`
                SELECT Employee.*, S.Total, B.SubmitCount, E.LockStatus, A.ApprovalStatus, A.ApprovalID
                FROM Employee 
                LEFT JOIN 
                    (SELECT T.EmployeeID, SUM(T.HoursWorked) as Total 
                    FROM TimeEntry as T 
                    WHERE (T.DateofWork BETWEEN @StartDate AND @EndDate) AND T.WorkCodeID != 62
                    GROUP BY T.EmployeeID) as S ON Employee.EmployeeID = S.EmployeeID
                LEFT JOIN 
                    (SELECT EmployeeID, COUNT(EmployeeID) as SubmitCount
                    From SubmittedTimesheets 
                    WHERE SubmissionEndDate BETWEEN @StartDate AND @EndDate
                    GROUP BY EmployeeID) as B ON Employee.EmployeeID = B.EmployeeID
                LEFT JOIN 
                    (SELECT DISTINCT EmployeetoLock, 'Locked' AS LockStatus FROM TimesheetLock) AS E ON E.EmployeetoLock = Employee.EmployeeID
                LEFT JOIN 
                    (SELECT TimesheetApprovals.*,  SubmittedTimesheets.EmployeeID
                    FROM TimesheetApprovals LEFT JOIN SubmittedTimesheets ON SubmittedTimesheets.SubmissionID = TimesheetApprovals.SubmissionID
                    WHERE (SubmittedTimesheets.SubmissionEndDate BETWEEN @StartDate AND @EndDate)) AS A ON A.EmployeeID = Employee.EmployeeID
                WHERE Employee.SupervisorID = @SupervisorID ORDER BY LastName
                `);

        return handleDatabaseResult(loggedTime.recordset, 200);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const readEmployeeSupervisor = async (EmployeeID: number) => {
    try {
        const pool = await getPool();
        const supervisor = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID).query(`
                SELECT * FROM Employee 
                LEFT JOIN Employee AS Supervisor ON Employee.SupervisorID = Supervisor.EmployeeID
                WHERE Employee.EmployeeID = @EmployeeID;
                `);

        return handleDatabaseResult(supervisor.recordset[0], 200);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const createEmployeePreference = async (
    EmployeeID: number,
    PreferenceID: number,
    Value: string
) => {
    try {
        const pool = await getPool();
        const newPreference = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .input("PreferenceID", BigInt, PreferenceID)
            .input("Value", NVarChar(50), Value).query(`
                INSERT INTO EmployeePreference (EmployeeID, PreferenceID, Value)
                OUTPUT inserted.*
                VALUES (@EmployeeID, @PreferenceID, @Value);
                
                `);

        const preference = await pool
            .request()
            .input(
                "EmployeePreferenceID",
                Int,
                newPreference.recordset[0].EmployeePreferenceID
            ).query(`
                        SELECT Preferences.PreferenceName, Preferences.PreferenceCode, Preferences.PreferenceType, Preferences.Description, Preferences.PreferenceID, EP.EmployeeID, EP.EmployeePreferenceID, EP.Value FROM Preferences
                        LEFT JOIN EmployeePreference AS EP ON EP.PreferenceID = Preferences.PreferenceID
                        WHERE EP.EmployeePreferenceID = @EmployeePreferenceID
                        
                        `);

        return handleDatabaseResult(preference.recordset[0], 200);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const readEmployeePreferences = async (EmployeeID: number) => {
    try {
        const pool = await getPool();
        const preferences = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID).query(`
                SELECT Preferences.PreferenceName, Preferences.PreferenceType, Preferences.PreferenceCode, Preferences.Description, Preferences.PreferenceID, EP.EmployeeID, EP.EmployeePreferenceID, EP.Value FROM Preferences
                LEFT JOIN (SELECT * FROM EmployeePreference WHERE EmployeePreference.EmployeeID = @EmployeeID) AS EP ON EP.PreferenceID = Preferences.PreferenceID
                
                `);

        return handleDatabaseResult(preferences.recordset, 200);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const updateEmployeePreference = async (
    EmployeePreferenceID: number,
    Value: string
) => {
    try {
        const pool = await getPool();
        await pool
            .request()
            .input("EmployeePreferenceID", Int, EmployeePreferenceID)
            .input("Value", NVarChar(50), Value).query(`
                UPDATE EmployeePreference 
                SET Value = @Value
                OUTPUT inserted.*
                WHERE EmployeePreference.EmployeePreferenceID = @EmployeePreferenceID;
                `);

        const preference = await pool
            .request()
            .input("EmployeePreferenceID", Int, EmployeePreferenceID).query(`
                    SELECT Preferences.PreferenceName, Preferences.PreferenceCode, Preferences.PreferenceType, Preferences.Description, Preferences.PreferenceID, EP.EmployeeID, EP.EmployeePreferenceID, EP.Value FROM Preferences
                    LEFT JOIN EmployeePreference AS EP ON EP.PreferenceID = Preferences.PreferenceID
                    WHERE EP.EmployeePreferenceID = @EmployeePreferenceID
                    
                    `);
        return handleDatabaseResult(preference.recordset[0], 200);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const readEmployeePinnedRows = async (EmployeeID: number) => {
    try {
        const pool = await getPool();
        const pinnedRows = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID).query(`
        SELECT * FROM EmployeePinnedRows
        WHERE EmployeeID = @EmployeeID;
        `);
        return handleDatabaseResult(pinnedRows.recordset, 200);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const createEmployeePinnedRows = async (
    EmployeeID: number,
    DepartmentID: number,
    ProjectID: number,
    WorkCodeID: number
) => {
    try {
        const pool = await getPool();
        const pinnedRow = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .input("DepartmentID", Int, DepartmentID)
            .input("ProjectID", Int, ProjectID)
            .input("WorkCodeID", Int, WorkCodeID).query(`
        INSERT INTO EmployeePinnedRows (EmployeeID, DepartmentID, ProjectID, WorkCodeID)
        OUTPUT inserted.*
        VALUES (@EmployeeID, @DepartmentID, @ProjectID, @WorkCodeID)
        `);
        return handleDatabaseResult(pinnedRow.recordset[0], 200);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const deleteEmployeePinnedRows = async (EmployeePinnedRowID: number) => {
    try {
        const pool = await getPool();
        await pool
            .request()
            .input("EmployeePinnedRowID", Int, EmployeePinnedRowID).query(`
            DELETE FROM EmployeePinnedRows 
            WHERE EmployeePinnedRowID = @EmployeePinnedRowID
        `);
        return handleDatabaseResult(true, 204);
    } catch (err) {
        return handleDatabaseError(err);
    }
};
