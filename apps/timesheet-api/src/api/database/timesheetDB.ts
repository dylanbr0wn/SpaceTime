import {
    BigInt,
    DateTime,
    Int,
    Numeric,
    NVarChar,
    RequestError,
    VarChar,
} from "mssql";

import { getPool } from "../../config/database";
import { HttpException } from "../services/error";
import { TemplateRow, TimeEntry, TimeEntryRow } from "../services/types";
import {
    EntryRowSorter,
    getEndDateFromStartDate,
    handleDatabaseError,
    handleDatabaseResult,
    parseEntryRow,
    parseTemplate,
    templateSorter,
} from "../services/utils";

/**
 * @async
 * @function createTimeEntries
 * @param {TimeEntry} TimeEntry Time entry to create in database
 * @returns {Object}
 * @description Create a time entry in the database for the the employee defined by EmployeeID
 */
export const createTimeEntries = async ({
    EmployeeID,
    ProjectID,
    WorkCodeID,
    HoursWorked,
    DateofWork,
    Comment,
}: TimeEntry) => {
    try {
        const pool = await getPool();
        const timeEntries = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .input("ProjectID", Int, ProjectID)
            .input("WorkCodeID", Int, WorkCodeID)
            .input("DateofWork", DateTime, DateofWork)
            .input("HoursWorked", Numeric(4, 2), HoursWorked)
            .input("Comment", VarChar, Comment).query(`
                INSERT INTO TimeEntry (EmployeeID, ProjectID, WorkCodeID, DateofWork, HoursWorked, Comment)
                OUTPUT inserted.*
                VALUES (@EmployeeID, @ProjectID, @WorkCodeID, @DateofWork, @HoursWorked, @Comment)`);

        return handleDatabaseResult(timeEntries.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function createBulkRowEntries
 * @param {Array} timeSheet Array of time entries
 * @param {String} StartDate Start of time sheet period
 * @param {Number} EmployeeID ID of Employee to attach to time entries
 * @returns {Object}
 * @description Create a number of time entries in the database.
 */
export const createBulkRowEntries = async (
    rows: TimeEntryRow[] | TemplateRow[],
    StartDate: Date,
    EmployeeID: number
) => {
    try {
        const pool = await getPool();

        const newRows: TimeEntryRow[] = await Promise.all(
            rows.map(async (row: TimeEntryRow | TemplateRow) => {
                const DepartmentID = row.DepartmentID ?? -1;
                const ProjectID = row.ProjectID;
                const WorkCodeID = row.WorkCodeID;

                const newRow = await pool
                    .request()
                    .input("EmployeeID", Int, EmployeeID)
                    .input("StartDate", DateTime, StartDate)
                    .input("DepartmentID", Int, DepartmentID)
                    .input("ProjectID", Int, ProjectID)
                    .input("WorkCodeID", Int, WorkCodeID)
                    .input("SortOrder", Int, null).query(`
            INSERT INTO TimeEntryRow (EmployeeID, WorkCodeID, ProjectID, DepartmentID, StartDate, SortOrder)
            OUTPUT inserted.*
            VALUES (@EmployeeID, @WorkCodeID, @ProjectID, @DepartmentID, @StartDate, @SortOrder)`);

                return newRow.recordset[0];
            })
        );

        return handleDatabaseResult(
            EntryRowSorter(newRows, [], StartDate, EmployeeID)
        );
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function updateTimeEntry
 * @param {Object} TimeEntry Time entry to update in database
 * @returns {Object}
 * @description update a time entry in the database defined by the TimeEntryID
 */
export const updateTimeEntry = async ({
    TimeEntryID,
    EmployeeID,
    ProjectID,
    WorkCodeID,
    HoursWorked,
    DateofWork,
    Comment,
}: TimeEntry) => {
    try {
        const pool = await getPool();
        const timeEntries = await pool
            .request()
            .input("TimeEntryID", Int, TimeEntryID)
            .input("EmployeeID", Int, EmployeeID)
            .input("ProjectID", Int, ProjectID)
            .input("WorkCodeID", Int, WorkCodeID)
            .input("DateofWork", DateTime, DateofWork)
            .input("HoursWorked", Numeric(4, 2), HoursWorked)
            .input("Comment", VarChar, Comment).query(`
                UPDATE TimeEntry 
                SET EmployeeID = @EmployeeID, 
                ProjectID = @ProjectID, 
                WorkCodeID = @WorkCodeID, 
                DateofWork = @DateofWork, 
                HoursWorked = @HoursWorked, 
                Comment = @Comment
                OUTPUT inserted.*
                WHERE TimeEntryID = @TimeEntryID;
                `);

        return handleDatabaseResult(timeEntries.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function updateTimeEntries
 * @param {Object} row Time entry row to update
 * @returns {Object}
 * @description update time entries in the database defined by the TimeEntryIDs
 */
export const updateTimeEntries = async (row: TimeEntryRow) => {
    try {
        const { ProjectID, WorkCodeID, timeEntries } = parseEntryRow(row);
        if (!timeEntries) return handleDatabaseResult(true, 204);
        const pool = await getPool();
        await pool
            .request()
            .input("ProjectID", Int, ProjectID)
            .input("WorkCodeID", Int, WorkCodeID).query(`
                UPDATE TimeEntry 
                SET 
                ProjectID = @ProjectID, 
                WorkCodeID = @WorkCodeID
                WHERE ${timeEntries};
                `);

        return handleDatabaseResult(true, 204);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function deleteTimeEntries
 * @param {Object} row Time entry row to delete
 * @returns {Object}
 * @description Delete all time entries in the database defined by the TimeEntryIDs in the timsheet row.
 */
export const deleteTimeEntries = async (row: TimeEntryRow) => {
    try {
        const { timeEntries } = parseEntryRow(row);
        if (!timeEntries) return handleDatabaseResult(true, 204);
        const pool = await getPool();
        await pool.request().query(`
            DELETE FROM TimeEntry
                WHERE ${timeEntries};
                `);

        return handleDatabaseResult(true, 204);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function clearTimeEntries
 * @param {Array} timeSheet Array of timesheet rows to clear
 * @returns {Object}
 * @description Delete all time entries in the database defined by the TimeEntryIDs on the entire timesheet.
 */
export const clearTimesheet = async (EmployeeID: number, startDate: Date) => {
    try {
        // first delete entries
        const EndDate = getEndDateFromStartDate(startDate);
        const pool = await getPool();
        await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .input("StartDate", DateTime, startDate)
            .input("EndDate", DateTime, EndDate).query(`
                DELETE
                FROM TimeEntry
                WHERE (DateofWork BETWEEN @StartDate AND @EndDate) 
                AND (TimeEntry.EmployeeID = @EmployeeID)`);

        // second delete rows

        await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .input("StartDate", DateTime, startDate).query(`
            DELETE FROM TimeEntryRow
            WHERE EmployeeID = @EmployeeID AND StartDate = @StartDate;`);

        // Timesheet should now be clear

        return handleDatabaseResult(true, 204);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function deleteTimeEntry
 * @param {Number} TimeEntryID Time entry ID to delete.
 * @returns {Object}
 * @description Delete the time entry defined by TimeEntryID
 */
export const deleteTimeEntry = async (TimeEntryID: number) => {
    try {
        const pool = await getPool();
        await pool.request().input("TimeEntryID", Int, TimeEntryID).query(`
            DELETE FROM TimeEntry
            WHERE TimeEntryID = @TimeEntryID;
                `);

        return handleDatabaseResult(true, 204);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function createTimeSheetTemplate
 * @param {Object} Template Template to create
 * @returns {Object}
 * @description Create a new template in the database.
 */
export const createTimeSheetTemplate = async ({
    EmployeeID,
    TemplateName,
    timesheet,
}: {
    EmployeeID: number;
    TemplateName: string;
    timesheet: TimeEntryRow[];
}) => {
    try {
        const pool = await getPool();
        const template = await pool
            .request()
            .input("TemplateName", NVarChar, TemplateName)
            .input("EmployeeID", Int, EmployeeID).query(`
                INSERT INTO Template (TemplateName, EmployeeID)
                OUTPUT inserted.*
                VALUES (@TemplateName, @EmployeeID);
                `);
        const parsedEntries = parseTemplate(
            EmployeeID,
            template.recordset[0].TemplateID,
            timesheet
        );
        const templateEntries = await Promise.all(
            parsedEntries.map(
                async ({
                    TemplateID,
                    ProjectID,
                    WorkCodeID,
                    DepartmentID,
                    HoursWorked,
                }) => {
                    const timeEntry = await pool
                        .request()
                        .input("TemplateID", Int, TemplateID)
                        .input("ProjectID", Int, ProjectID)
                        .input("DepartmentID", Int, DepartmentID)
                        .input("WorkCodeID", Int, WorkCodeID)
                        .input("HoursWorked", Numeric(4, 2), HoursWorked)
                        .query(`
                INSERT INTO TemplateEntry (TemplateID, ProjectID, WorkCodeID, DepartmentID, HoursWorked)
                OUTPUT inserted.*
                VALUES (@TemplateID, @ProjectID, @WorkCodeID, @DepartmentID, @HoursWorked)`);
                    return timeEntry.recordset[0];
                }
            )
        );
        return handleDatabaseResult(
            { entries: templateEntries, template: template.recordset[0] },
            200
        );
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function readTemplateEntries
 * @param {Number} TemplateID TemplateID to read entries for.
 * @param {String} StartDate Date to add to begin timesheet on.
 * @param {Number} EmployeeID EmployeeID attached to template and entries.
 * @returns {Object}
 * @description Read a templates entries from the database
 */
export const readTemplateEntries = async (
    TemplateID: number,
    StartDate: Date,
    EmployeeID: number
) => {
    try {
        const pool = await getPool();
        const templateEntries = await pool
            .request()
            .input("TemplateID", Int, TemplateID).query(`
            SELECT TemplateEntry.*, Template.EmployeeID, Template.TemplateName, Project.IsActive as ProjActive, Department.IsActive as DepActive  FROM TemplateEntry 
            LEFT JOIN Template ON Template.TemplateID = TemplateEntry.TemplateID
            LEfT JOIN Project ON TemplateEntry.ProjectID = Project.ProjectID
            LEFT JOIN Department ON TemplateEntry.DepartmentID = Department.DepartmentID
            Where Template.TemplateID = @TemplateID;
                `);

        return handleDatabaseResult(
            templateSorter(templateEntries.recordset, StartDate, EmployeeID),
            200
        );
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function updateTimeSheetTemplate
 * @param {number} TemplateID TemplateID to read entries for.
 * @param {TimeEntry[]} Entries Template entries entries to insert as replacement.
 * @param {number} EmployeeID EmployeeID attached to template and entries.
 * @returns {Object}
 * @description Update a template by deleting existing entries and replacing them with new entries.
 */
export const updateTimeSheetTemplate = async (
    TemplateID: number,
    Entries: TimeEntryRow[],
    EmployeeID: number
) => {
    try {
        const pool = await getPool();
        await pool.request().input("TemplateID", Int, TemplateID).query(`
            DELETE FROM TemplateEntry
            WHERE TemplateID = @TemplateID;
                `);
        const parsedEntries = parseTemplate(EmployeeID, TemplateID, Entries);
        const templateEntries = await Promise.all(
            parsedEntries.map(
                async ({
                    TemplateID,
                    ProjectID,
                    WorkCodeID,
                    DepartmentID,
                    HoursWorked,
                }) => {
                    const timeEntry = await pool
                        .request()
                        .input("TemplateID", Int, TemplateID)
                        .input("ProjectID", Int, ProjectID)
                        .input("DepartmentID", Int, DepartmentID)
                        .input("WorkCodeID", Int, WorkCodeID)
                        .input("HoursWorked", Numeric(4, 2), HoursWorked)
                        .query(`
                INSERT INTO TemplateEntry (TemplateID, ProjectID, WorkCodeID, DepartmentID,  HoursWorked)
                OUTPUT inserted.*
                VALUES (@TemplateID, @ProjectID, @WorkCodeID, @DepartmentID, @HoursWorked)`);
                    return timeEntry.recordset[0];
                }
            )
        );

        return handleDatabaseResult(
            { entries: templateEntries, TemplateID },
            200
        );
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function deleteTimeSheetTemplate
 * @param {number} TemplateID TemplateID to delete.
 * @returns {Object}
 * @description Delete template entries and the template itself.
 */
export const deleteTimeSheetTemplate = async (TemplateID: number) => {
    try {
        const pool = await getPool();
        await pool.request().input("TemplateID", Int, TemplateID).query(`
            DELETE FROM TemplateEntry
            WHERE TemplateID = @TemplateID;
                `);

        await pool.request().input("TemplateID", Int, TemplateID).query(`
                DELETE FROM Template
                WHERE TemplateID = @TemplateID;
                    `);
        return handleDatabaseResult(true, 204);
    } catch (err) {
        if (err instanceof RequestError) return handleDatabaseError(err);
        else throw new HttpException(500, (err as Error).message);
    }
};

/**
 * @async
 * @function createTimeSheetDayComment
 * @param {Object} Comment A day comment entry.
 * @returns {Object}
 * @description Create a new day comment in the database.
 */
export const createTimeSheetDayComment = async ({
    EmployeeID,
    DateofComment,
    Comment,
}: {
    EmployeeID: number;
    DateofComment: Date;
    Comment: string;
}) => {
    try {
        const pool = await getPool();
        const comments = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .input("DateofComment", DateTime, DateofComment)
            .input("Comment", VarChar, Comment).query(`
                INSERT INTO DayComment (EmployeeID, DateofComment, Comment)
                OUTPUT inserted.*
                VALUES (@EmployeeID, @DateofComment, @Comment)`);

        return handleDatabaseResult(comments.recordset[0]);
    } catch (err) {
        if (err instanceof RequestError) return handleDatabaseError(err);
        else throw new HttpException(500, (err as Error).message);
    }
};

/**
 * @async
 * @function createTimeSheetDayComment
 * @param {Number} DayCommentID ID of day comment to update
 * @param {String} Comment Comment to update.
 * @returns {Object}
 * @description Update a comment in a day comment entry.
 */
export const updateTimeSheetDayComment = async (
    DayCommentID: number,
    Comment: string
) => {
    try {
        const pool = await getPool();
        const dayComment = await pool
            .request()
            .input("DayCommentID", Int, DayCommentID)
            .input("Comment", VarChar, Comment).query(`
                UPDATE DayComment 
                SET
                Comment = @Comment
                OUTPUT inserted.*
                WHERE DayCommentID = @DayCommentID;
                `);

        return handleDatabaseResult(dayComment.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function deleteTimeSheetDayComment
 * @param {Number} DayCommentID ID of day comment to delete.
 * @returns {Object}
 * @description Delete a day comment.
 */
export const deleteTimeSheetDayComment = async (DayCommentID: number) => {
    try {
        const pool = await getPool();
        await pool.request().input("DayCommentID", Int, DayCommentID).query(`
            DELETE FROM DayComment
            WHERE DayCommentID = @DayCommentID;
                `);
        return handleDatabaseResult(true, 204);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

/**
 * @async
 * @function createTimesheetSubmission
 * @param {Object} body Body of request object
 * @returns {Object}
 * @description create a timesheet submission
 */
export const createTimesheetSubmission = async (
    { employeeID, lastDay }: { employeeID: number; lastDay: Date },
    timeSheet: TimeEntry[]
) => {
    try {
        const pool = await getPool();
        const submission = await pool
            .request()
            .input("EmployeeID", Int, employeeID)
            .input("SubmissionEndDate", DateTime, lastDay)
            .input("Comment", VarChar, "").query(`
            INSERT INTO SubmittedTimesheets (EmployeeID, SubmissionEndDate, Comment, SubmissionDate)
            OUTPUT inserted.*
            VALUES (@EmployeeID, @SubmissionEndDate, @Comment, CURRENT_TIMESTAMP)`);

        const entries = timeSheet // parse entries
            .map((entry) => entry.TimeEntryID)
            .map((entry) => `TimeEntryID = ${entry}`)
            .join(" OR ");
        if (entries) {
            await pool
                .request()
                .input(
                    "SubmissionID",
                    BigInt,
                    submission.recordset[0].SubmissionID
                ).query(`
            UPDATE TimeEntry 
            SET
            SubmissionID = @SubmissionID
            WHERE ${entries}`);
        }

        return handleDatabaseResult(submission.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const lockTimesheet = async (
    SupervisorID: number,
    EmployeeID: number
) => {
    try {
        const pool = await getPool();
        const lock = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .input("SupervisorID", Int, SupervisorID).query(`
                INSERT INTO TimesheetLock (EmployeetoLock, LockedBy, DateofLock)
                OUTPUT inserted.*
                VALUES (@EmployeeID, @SupervisorID, CURRENT_TIMESTAMP)`);

        return handleDatabaseResult(lock.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const unlockTimesheet = async (EmployeeID: number) => {
    try {
        const pool = await getPool();
        await pool.request().input("EmployeeID", Int, EmployeeID).query(`
            DELETE FROM TimesheetLock
            WHERE EmployeetoLock = @EmployeeID;`);

        return handleDatabaseResult(true, 204);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const checkTimesheetLock = async (EmployeeID: number) => {
    try {
        const pool = await getPool();
        const employee = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID).query(`
            SELECT * FROM TimesheetLock WHERE EmployeetoLock = @EmployeeID;`);

        return handleDatabaseResult({
            locked: employee.recordset.length > 0,
        });
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const createTimesheetRow = async ({
    EmployeeID,
    StartDate,
    SortOrder = null,
}: {
    EmployeeID: number;
    StartDate: Date;
    SortOrder: number | null;
}) => {
    try {
        const pool = await getPool();
        const row = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .input("StartDate", DateTime, StartDate)
            .input("SortOrder", Int, SortOrder).query(`
            INSERT INTO TimeEntryRow (EmployeeID, StartDate, SortOrder)
            OUTPUT inserted.*
            VALUES (@EmployeeID, @StartDate, @SortOrder)`);

        return handleDatabaseResult(row.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const updateTimesheetRow = async ({
    TimeEntryRowID,
    ProjectID,
    DepartmentID,
    WorkCodeID,
}: {
    TimeEntryRowID: number;
    ProjectID: number;
    DepartmentID: number;
    WorkCodeID: number;
}) => {
    try {
        const pool = await getPool();
        const row = await pool
            .request()
            .input("TimeEntryRowID", Int, TimeEntryRowID)
            .input("ProjectID", Int, ProjectID === -1 ? null : ProjectID)
            .input(
                "DepartmentID",
                Int,
                DepartmentID === -1 ? null : DepartmentID
            )
            .input("WorkCodeID", Int, WorkCodeID === -1 ? null : WorkCodeID)
            .query(`
            UPDATE TimeEntryRow
                SET
                ProjectID = @ProjectID,
                DepartmentID = @DepartmentID,
                WorkCodeID = @WorkCodeID
                OUTPUT inserted.*
                WHERE TimeEntryRowID = @TimeEntryRowID`);

        return handleDatabaseResult(row.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const readTimesheetRow = async (EmployeeID: number, StartDate: Date) => {
    try {
        const pool = await getPool();
        const row = await pool
            .request()
            .input("EmployeeID", Int, EmployeeID)
            .input("StartDate", DateTime, StartDate).query(`
            SELECT TimeEntryRow.*, WorkCode.Description AS WCName, Department.DeptName AS DeptName, Project.Name AS ProjName FROM TimeEntryRow
            LEFT JOIN Project ON TimeEntryRow.ProjectID = Project.ProjectID
            LEFT JOIN Department ON TimeEntryRow.DepartmentID = Department.DepartmentID
            LEFT JOIN WorkCode ON WorkCode.WorkCodeID = TimeEntryRow.WorkCodeID
            WHERE EmployeeID = @EmployeeID AND StartDate = @StartDate;`);

        return handleDatabaseResult(row.recordset);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const deleteTimesheetRow = async ({
    TimeEntryRowID,
}: {
    TimeEntryRowID: number;
}) => {
    try {
        const pool = await getPool();
        await pool.request().input("TimeEntryRowID", Int, TimeEntryRowID)
            .query(`
            DELETE FROM TimeEntryRow
            WHERE TimeEntryRowID = @TimeEntryRowID;`);

        return handleDatabaseResult(true, 204);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const deleteTimesheetRows = async (timesheetRows: string) => {
    try {
        const pool = await getPool();
        await pool.request().query(`
            DELETE FROM TimeEntryRow
                WHERE ${timesheetRows};
                `);

        return handleDatabaseResult(true, 204);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const readTimesheetEmployeeApprovals = async (startDate: Date) => {
    try {
        const EndDate = getEndDateFromStartDate(startDate);
        const pool = await getPool();
        const loggedTime = await pool
            .request()
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
                ORDER BY LastName
                `);

        return handleDatabaseResult(loggedTime.recordset, 200);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const readEmployeeApproval = async (
    startDate: Date,
    EmployeeID: number
) => {
    try {
        const EndDate = getEndDateFromStartDate(startDate);

        const pool = await getPool();
        const approval = await pool
            .request()
            .input("StartDate", DateTime, startDate)
            .input("EndDate", DateTime, EndDate)
            .input("EmployeeID", Int, EmployeeID).query(`
               SELECT TimesheetApprovals.* 
               FROM TimesheetApprovals LEFT JOIN SubmittedTimesheets ON SubmittedTimesheets.SubmissionID = TimesheetApprovals.SubmissionID
               WHERE (SubmittedTimesheets.SubmissionEndDate BETWEEN @StartDate AND @EndDate) AND SubmittedTimesheets.EmployeeID = @EmployeeID;
                `);
        return handleDatabaseResult(approval.recordset[0], 200);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const readEmployeeSubmittedSheets = async (
    startDate: Date,
    EmployeeID: number
) => {
    try {
        const EndDate = getEndDateFromStartDate(startDate);
        const pool = await getPool();
        const submitCount = await pool
            .request()
            .input("StartDate", DateTime, startDate)
            .input("EndDate", DateTime, EndDate)
            .input("EmployeeID", Int, EmployeeID)
            .query(`SELECT SubmittedTimesheets.Comment, A.SubmitCount 
            FROM SubmittedTimesheets
            LEFT JOIN 
            (SELECT EmployeeID, COUNT(EmployeeID) as SubmitCount
            From SubmittedTimesheets 
            WHERE (SubmittedTimesheets.SubmissionEndDate BETWEEN @StartDate AND @EndDate) AND SubmittedTimesheets.EmployeeID = @EmployeeID
            GROUP BY EmployeeID ) AS A ON A.EmployeeID = SubmittedTimesheets.EmployeeID
            WHERE (SubmittedTimesheets.SubmissionEndDate BETWEEN @StartDate AND @EndDate) AND SubmittedTimesheets.EmployeeID = @EmployeeID;
                `);
        return handleDatabaseResult(submitCount.recordset[0], 200);
    } catch (err) {
        return handleDatabaseError(err);
    }
};
