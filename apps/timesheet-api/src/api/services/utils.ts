import { HttpException } from "./error";
import moment from "moment";
import { checkTimesheetLock } from "../database/timesheetDB";
import {
    ConnectionError,
    PreparedStatementError,
    RequestError,
    TransactionError,
} from "mssql";
import {
    DayComment,
    PinnedRow,
    Preference,
    Template,
    TemplateRow,
    TimeEntry,
    TimeEntryRow,
    WorkCode,
} from "./types";
import { DatabaseResponse } from "../../config/database";
import { Response } from "express";

/**
 * @function parseCSV
 * @param {Object} data Request object
 * @description
 * Parse databse output into csv string.
 */
export const parseCSV = (data: any[]) => {
    if (data.length === 0) return "";
    const items = data;
    // const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(items[0]);
    const csv = items.map((row) =>
        header
            .map((fieldName) => (row[fieldName] === null ? "" : row[fieldName]))
            .join(",")
    );
    return csv.join("\r\n") + "\r\n";
};

/**
 * @function handleDatabaseError
 * @param {Object} error Error thrown from database.
 * @param {Number} status Status to send back in response.
 * @description
 * Handle an error thrown from any database call.
 */
export const handleDatabaseError = (
    error: RequestError | Error | unknown,
    status = 1000
): DatabaseResponse => {
    let message = "";
    if (error instanceof RequestError) {
        if (error.code === "EREQUEST") message = error.message;
        if (error.code === "ETIMEOUT") message = "Database timed out.";
        if (error.code === "ECANCEL") message = "Database request cancelled.";
        if (error.code === "EINJECT") message = "SQL injection warning.";
    } else if (error instanceof TransactionError) {
        if (error.code === "EALREADYBEGUN")
            message = "Transaction has already begun.";
        if (error.code === "EREQINPROG")
            message =
                "Can't commit/rollback transaction. There is a request in progress.";
        if (error.code === "EABORT") message = "Transaction has been aborted.";
    } else if (error instanceof ConnectionError) {
        if (error.code === "ELOGIN") message = "Database login failed.";
        if (error.code === "ETIMEOUT") message = "Database timed out.";
        if (error.code === "ESOCKET") message = "Database socket error.";
    } else if (error instanceof PreparedStatementError) {
        if (error.code === "EINJECT") message = "SQL injection warning.";
        if (error.code === "ENOTPREPARED")
            message = "Statement is not prepared.";
        if (error.code === "EARGS") message = "Invalid number of arguments.";
    } else if (error instanceof Error) {
        message = error.message;
    } else {
        message = "An unknown error occured";
    }

    //console.log(error);
    return {
        success: false,
        data: null,
        message,
        status,
    };
};

/**
 * @function handleDatabaseResult
 * @param {Object} result Result object from successful database call.
 * @param {Number} status Status to send back in response.
 * @description
 * Handle a successful database call.
 */
export const handleDatabaseResult = (
    result?: any,
    status?: number
): DatabaseResponse => {
    return {
        success: true,
        data: result ?? null,
        message: "",
        status: status ?? 200,
    };
};

/**
 * @function handleDatabaseResult
 * @param {Object} res API response object.
 * @param {Object} result Result object to send back in response.
 * @description
 * Send response object back.
 */
export const sendResponse = (
    res: Response,
    { data, status }: DatabaseResponse
) => {
    if (status !== 200) {
        res.sendStatus(status);
    } else {
        res.status(status).json({
            status: "success",
            data: data,
        });
    }
};

/**
 * @function parseEntryRow
 * @param {Object} row Time entry row object.
 * @description
 * Parse time entry row so it can be updated in the database.
 */
export const parseEntryRow = ({
    ProjectID,
    WorkCodeID,
    dates,
}: TimeEntryRow) => {
    const entryIDs = dates
        .filter((entry) => entry.TimeEntryID)
        .map((entry) => entry.TimeEntryID)
        .map((entry) => `TimeEntryID = ${entry}`)
        .join(" OR ");
    return { ProjectID, WorkCodeID, timeEntries: entryIDs };
};

/**
 * @function parseTimeSheet
 * @param {Array} timeSheet Array of time entry rows.
 * @description
 * Parse time sheet array so it can be manipulated in database.
 */
export const parseTimeSheetRows = (timeSheet: TimeEntryRow[]) => {
    const TimeEntryRowIDs: number[] = [];
    timeSheet.forEach((row) => {
        if (row.TimeEntryRowID) TimeEntryRowIDs.push(row.TimeEntryRowID);
    });
    return TimeEntryRowIDs.map((entry) => `TimeEntryRowID = ${entry}`).join(
        " OR "
    );
};

/**
 * @function parseTemplate
 * @param {Array} Entries Array of time entry objects.
 * @param {Number} TemplateID ID of template.
 * @param {Number} EmployeeID ID of employee.
 * @description
 * Parse time entries into a template format.
 */
export const parseTemplate = (
    EmployeeID: number,
    TemplateID: number,
    timesheet: TimeEntryRow[]
) => {
    const defaultTemplateEntry: TemplateRow = {
        TemplateID,
        ProjectID: null,
        WorkCodeID: null,
        HoursWorked: 0,
    };

    const templateEntries: TemplateRow[] = [];

    timesheet.forEach((row) => {
        templateEntries.push({
            ...defaultTemplateEntry,
            ProjectID: row.ProjectID,
            WorkCodeID: row.WorkCodeID,
            DepartmentID: row.DepartmentID ?? -1,
        });
    });

    return templateEntries;
};

interface TimeEntryRowWithActive extends TimeEntryRow {
    ProjActive: boolean;
    DepActive: boolean;
}

/**
 * @function templateSorter
 * @param {Array} entries Array of template entries.
 * @param {String | Date} startDate Date string for start of time entry.
 * @param {Number} EmployeeID ID of employee.
 * @description
 * Parse tempalte entries into time entries.
 */
export const templateSorter = (
    rows: TimeEntryRowWithActive[],
    StartDate: Date,
    EmployeeID: number
) => {
    //filter rows with depreciated
    const newRows = rows.filter((row) => {
        if (row.ProjectID && !row.ProjActive) return false;
        if (row.DepartmentID && !row.DepActive) return false;
        return true;
    });
    return newRows.map(({ WorkCodeID, ProjectID, DepartmentID }) => {
        return {
            WorkCodeID,
            ProjectID,
            EmployeeID,
            DepartmentID,
            StartDate,
        };
    });
};

/**
 * @function parseBulkEntry
 * @param {Array} newTimeSheet Array of time entry rows.
 * @description
 * Parse time sheet into an array of time entries.
 */
export const parseBulkEntry = (newTimeSheet: TimeEntryRow[]) => {
    const newEntries: TimeEntry[] = [];
    newTimeSheet.map((row) => newEntries.push(...row.dates));
    return newEntries
        .filter((entry) => entry.HoursWorked)
        .map(
            ({
                WorkCodeID,
                ProjectID,
                EmployeeID,
                DateofWork,
                HoursWorked,
            }) => ({
                WorkCodeID,
                ProjectID,
                EmployeeID,
                DateofWork,
                HoursWorked,
            })
        );
};

/**
 * @function parseDayComments
 * @param {Array} DayComments Array of day comments.
 * @param {String | Date} startDate Date string for start of time entry.
 * @param {Number} EmployeeID ID of employee.
 * @description
 * Parse day comments into a format digestable by the front end.
 */
export const parseDayComments = (
    DayComments: DayComment[],
    startDate: Date,
    EmployeeID: number
) => {
    return new Array(14)
        .fill(undefined)
        .map((value, i) => {
            const DateofComment = moment.utc(startDate);
            return {
                EmployeeID: EmployeeID,
                DateofComment: DateofComment.add(i, "days"),
                Comment: null,
            };
        })
        .map((emptyDay) => {
            const newDay = DayComments.find(
                (dayComment) =>
                    moment.utc(dayComment.DateofComment).date() ===
                    emptyDay.DateofComment.date()
            );
            if (newDay) return newDay;
            else return emptyDay;
        });
};

//Checks routes to see if a lock exists
export const checkEmployeeRoutes = async (EmployeeID: number) => {
    const isLocked = await checkTimesheetLock(EmployeeID);
    if (isLocked.data.locked) {
        throw new HttpException(
            423,
            "Timesheet is locked. Contact your supervisor for assistance."
        );
    }
    return;
};

//takes rows and entries and combines them into a timesheet
export const EntryRowSorter = (
    rows: TimeEntryRow[],
    entries: TimeEntry[],
    StartDate: Date,
    EmployeeID: number
) => {
    //create default empty workdays
    const workDays = new Array(14).fill(undefined).map((entry, i) => {
        const workDate = moment.utc(StartDate);
        return {
            WorkCodeID: -1,
            ProjectID: -1,
            EmployeeID,
            HoursWorked: 0,
            DateofWork: workDate.add(i, "days"),
            Comment: null,
        };
    });

    const cleansedRows = Array.from(new Set(rows));

    //create base timesheet using rows, should cleanse rows first
    const timesheet = [...cleansedRows].map((row) => {
        return {
            ...row,
            WorkCodeID: row.WorkCodeID ?? -1,
            ProjectID: row.ProjectID ?? -1,
            DepartmentID: row.DepartmentID ?? -1,
            dates: [...workDays].map((day) => {
                return {
                    ...day,
                    WorkCodeID: row.WorkCodeID ?? -1,
                    ProjectID: row.ProjectID ?? -1,
                };
            }),
        };
    });

    const workTypes: { [index: string]: TimeEntryRow } = {};

    // parse entries
    entries.forEach((element) => {
        const newElement = element;
        //if work exists, add it to the workType
        if (workTypes[`${element.ProjectID},${element.WorkCodeID}`]) {
            workTypes[`${element.ProjectID},${element.WorkCodeID}`].dates =
                workTypes[
                    `${element.ProjectID},${element.WorkCodeID}`
                ].dates.map((day) => {
                    const SubmissionDate = moment.utc(
                        newElement.SubmissionDate
                    );
                    const DateofWork = moment.utc(element.DateofWork);

                    if (
                        moment.utc(day.DateofWork).date() === DateofWork.date()
                    ) {
                        return { ...newElement, DateofWork };
                    }
                    return {
                        ...day,
                        WorkCodeID: newElement.WorkCodeID,
                        ProjectID: newElement.ProjectID,
                    };
                });
        } else {
            //If work does not exist, create a new workType
            workTypes[`${element.ProjectID},${element.WorkCodeID}`] = {
                dates: workDays.map((day) => {
                    const DateofWork = moment.utc(element.DateofWork);

                    const SubmissionDate = moment.utc(
                        newElement.SubmissionDate
                    );
                    if (
                        moment.utc(day.DateofWork).date() === DateofWork.date()
                    ) {
                        return { ...newElement, DateofWork };
                    }
                    return {
                        ...day,
                        WorkCodeID: newElement.WorkCodeID,
                        ProjectID: newElement.ProjectID,
                    };
                }),
                DepartmentID: newElement.DepartmentID,
                WorkCodeID: newElement.WorkCodeID,
                ProjectID: newElement.ProjectID,
                EmployeeID: newElement.EmployeeID,
                DeptName: newElement.DeptName,
                ProjName: newElement.ProjName,
                WCName: newElement.WCName,
                StartDate,
            };
        }
    });

    let newTimesheet: TimeEntryRow[] = timesheet;
    // match parsed entries to a row
    for (const type in workTypes) {
        let match = false;
        newTimesheet = timesheet.map((row) => {
            if (`${row.ProjectID},${row.WorkCodeID}` === type) {
                match = true;
                return {
                    ...row,
                    dates: workTypes[type].dates,
                };
            }
            return row;
        });
        if (!match) {
            newTimesheet.push(workTypes[type]);
        }
    }

    newTimesheet.sort(rowCompare);
    return newTimesheet.map((row) => {
        const newRow = row;
        delete newRow.DeptName;
        delete newRow.ProjName;
        delete newRow.WCName;
        return newRow;
    });
};

//gets total hours worked in a timesheet period
export const getTotalHours = (timesheet: TimeEntry[]) => {
    let total = 0;

    const filteredEntries = timesheet.filter(
        (entry) => entry.WorkCodeID !== 62
    );
    filteredEntries.forEach((entry) => {
        if (entry.HoursWorked) {
            total += entry.HoursWorked;
        }
    });

    return total;
};

//compare function for rows
const rowCompare = (row1: TimeEntryRow, row2: TimeEntryRow) => {
    if ((row1.DeptName ?? "") > (row2.DeptName ?? "")) return 1;
    if ((row1.DeptName ?? "") < (row2.DeptName ?? "")) return -1;
    if ((row1.ProjName ?? "") > (row2.ProjName ?? "")) return 1;
    if ((row1.ProjName ?? "") < (row2.ProjName ?? "")) return -1;
    if ((row1.WCName ?? "") > (row2.WCName ?? "")) return 1;
    if ((row1.WCName ?? "") < (row2.WCName ?? "")) return -1;
    return 0;
};

//get template rows not already present in current timesheet
export const getTrimmedTemplateRows = (
    timesheet: TimeEntryRow[],
    rows: TemplateRow[]
) => {
    const existingRows = timesheet.map(
        (row) => `${row.WorkCodeID},${row.ProjectID}`
    );
    return rows.filter(
        (row) => !existingRows.includes(`${row.WorkCodeID},${row.ProjectID}`)
    );
};

export const getFilteredTemplateRows = (
    rows: TemplateRow[],
    workCodes: WorkCode[]
) => {
    const workCodeIDs = workCodes.map((code) => code.WorkCodeID);
    return rows.filter((row) => workCodeIDs.includes(row.WorkCodeID ?? -1));
};

export const getUnusedTimesheetRows = (timesheet: TimeEntryRow[]) => {
    return timesheet.filter((row) => {
        if (!row.TimeEntryRowID) return false;
        let keepRow = true;

        row.dates.forEach((day) => {
            if (day.TimeEntryID) {
                keepRow = false;
            }
        });
        return keepRow;
    });
};

export const getParsedPrefs = (
    prefs: Preference[],
    pinnedRows: PinnedRow[]
) => {
    const parsedPrefs: { [index: string]: Preference } = {};
    prefs.map((pref) => {
        let Value: string | PinnedRow[] | number | boolean = "";

        if (pref.PreferenceType === "bool") {
            Value = pref.Value === "true";
        } else if (pref.PreferenceType === "number") {
            if (typeof pref.Value == "string") {
                Value = parseFloat(pref.Value ?? "");
            }
        } else if (pref.PreferenceType === "array") {
            if (pref.PreferenceCode === "PinnedRows") {
                Value = pinnedRows;
            }
        }
        parsedPrefs[pref.PreferenceCode] = { ...pref, Value };
    });
    return parsedPrefs;
};

export const getParsedPref = (pref: Preference) => {
    let Value: number | boolean | string = "";

    if (pref.PreferenceType === "bool") {
        Value = pref.Value === "true";
    } else if (pref.PreferenceType === "number") {
        if (typeof pref.Value == "string") {
            Value = parseFloat(pref.Value ?? "");
        }
    }

    return {
        ...pref,
        Value,
    };
};

export const getEndDateFromStartDate = (startDate: Date) => {
    const EndDate = moment(startDate).add(13, "d");
    if (EndDate.isDST()) EndDate.add(1, "h");
    return EndDate.toDate();
};
