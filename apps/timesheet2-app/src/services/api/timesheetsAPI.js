import API, { handleResponse, handleError } from "./Api";

/**
 * @name readTimeSheet
 * @param {Number} EmployeeID ID of employee.
 * @param {String} startDate Start date of the timesheet.
 * @function
 * @category API
 * @description
 * GET request to API to load timesheet of an employee given employee ID and startDate of timesheet.
 */
export const readTimeSheet = async (EmployeeID, startDate, userType) => {
    try {
        const res = await API().get(`timesheets/${EmployeeID}`, {
            params: {
                startDate,
                userType,
            },
        });
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * @name saveTimeEntry
 * @function
 * @category API
 * @param {Object} timeEntry Time entry object to save.
 * @description
 * Create or update a time entry object.
 */
export const saveTimeEntry = async (timeEntry, EmployeeID, startDate) => {
    if (timeEntry.TimeEntryID) {
        try {
            const res = await API().put(
                `timesheets/${EmployeeID}/entries/${timeEntry.TimeEntryID}`,
                { ...timeEntry },
                {
                    params: {
                        startDate: startDate.toDate(),
                    },
                }
            );
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    } else {
        try {
            const res = await API().post(
                `timesheets/${EmployeeID}/entries`,
                { ...timeEntry },
                {
                    params: {
                        startDate: startDate.toDate(),
                    },
                }
            );
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    }
};

/**
 * @name saveTimeEntryRow
 * @function
 * @category API
 * @param {Object} timeEntryRow Time entry row object to save.
 * @param {Number} EmployeeID ID of Employee
 * @param {Date} StartDate Start date of timesheet period
 * @description
 * Update a time entry row object.
 */
export const saveTimeEntryRow = async (timeEntryRow, EmployeeID, StartDate) => {
    if (timeEntryRow.TimeEntryRowID) {
        try {
            const res = await API().put(
                `timesheets/${EmployeeID}/updateRow`,
                { ...timeEntryRow, StartDate },
                {
                    params: {
                        startDate: StartDate.toDate(),
                    },
                }
            );
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    } else {
        try {
            const res = await API().post(
                `timesheets/${EmployeeID}/createRow`,
                { StartDate, EmployeeID },
                {
                    params: {
                        startDate: StartDate.toDate(),
                    },
                }
            );
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    }
};

/**
 * @name createTimeSheetTemplate
 * @function
 * @category API
 * @param {Number} EmployeeID ID of an employee.
 * @param {String} TemplateName Name of the template to save
 * @param {Object} timesheet Timesheet to save.
 * @description
 * Create a new time entry template.
 * @todo rename for consistancy
 */
export const createTemplate = async (EmployeeID, TemplateName, timesheet) => {
    try {
        const res = await API().post(`timesheets/${EmployeeID}/templates`, {
            EmployeeID,
            TemplateName,
            timesheet,
        });
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * @name updateTimeSheetTemplate
 * @function
 * @category API
 * @param {Number} EmployeeID ID of an employee.
 * @param {Number} TemplateID ID of the template to save
 * @param {Object} Entries Time entries to save.
 * @description
 * Update a time entry template.
 * @todo rename for consistancy
 */
export const updateTemplate = async (EmployeeID, TemplateID, Entries) => {
    try {
        const res = await API().put(
            `timesheets/${EmployeeID}/templates/${TemplateID}`,
            { EmployeeID, Entries }
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * @name removeTimeEntryRow
 * @function
 * @category API
 * @param {Object} timeEntryRow Time entry row object to save.
 * @param {Number} EmployeeID ID of employee
 * @param {Date} startDate Date of timesheet start
 * @description
 * Remove a time entry row object.
 * @todo rename for consistancy
 */
export const deleteTimeEntryRow = async (
    timeEntryRow,
    EmployeeID,
    startDate
) => {
    try {
        const res = await API().delete(`timesheets/${EmployeeID}/deleteRow`, {
            data: timeEntryRow,
            params: {
                startDate: startDate.toDate(),
            },
        });
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

export const deleteUnusedRows = async (EmployeeID, startDate) => {
    try {
        const res = await API().delete(
            `timesheets/${EmployeeID}/deleteUnusedRows`,
            {
                params: {
                    startDate: startDate.toDate(),
                },
            }
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * @name deleteTimeEntry
 * @function
 * @category API
 * @param {Number} TimeEntryID Time entry ID to remove.
 * @param {Number} EmployeeID ID of employee
 * @param {Date} startDate Start date of timesheet
 * @description
 * Remove a time entry object.
 * @todo rename for consistancy
 */
export const deleteTimeEntry = async (TimeEntryID, EmployeeID, startDate) => {
    try {
        const res = await API().delete(
            `timesheets/${EmployeeID}/entries/${TimeEntryID}`,
            {
                params: {
                    startDate: startDate.toDate(),
                },
            }
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * @name readTemplateEntries
 * @function
 * @category API
 * @param {Number} TemplateID Timesheet template ID to load.
 * @param {String} startDate Start date of the timesheet.
 * @param {Number} EmployeeID ID of an employee.
 * @param {Array} timeSheet Current timesheet to be cleared.
 * @description
 * Load a timesheet template.
 * @todo rename for consistancy
 */
export const readTemplate = async (
    TemplateID,
    startDate,
    EmployeeID,
    overwrite
    // timeSheet
) => {
    try {
        const res = await API().post(
            `timesheets/${EmployeeID}/templates/${TemplateID}`,
            {
                startDate,
                EmployeeID,
                overwrite,
            },
            {
                params: {
                    startDate: startDate,
                },
            }
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * @name deleteTemplate
 * @function
 * @category API
 * @param {Number} TemplateID Timesheet template ID to remove.
 * @param {Number} EmployeeID ID of an employee.
 * @description
 * Remove a timesheet template.
 * @todo rename for consistancy
 */
export const deleteTemplate = async (TemplateID, EmployeeID) => {
    try {
        const res = await API().delete(
            `timesheets/${EmployeeID}/templates/${TemplateID}`
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * @name saveDayComment
 * @function
 * @category API
 * @param {Object} dayComment Day comment object.
 * @description
 * Create or update a day comment.
 * @todo rename for consistancy
 */
export const saveDayComment = async (dayComment, EmployeeID, startDate) => {
    if (dayComment.DayCommentID) {
        try {
            const res = await API().put(
                `timesheets/${EmployeeID}/dayComments/${dayComment.DayCommentID}`,
                { comment: dayComment.Comment },
                {
                    params: {
                        startDate: startDate.toDate(),
                    },
                }
            );
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    } else {
        try {
            const res = await API().post(
                `timesheets/${EmployeeID}/dayComments`,
                { ...dayComment },
                {
                    params: {
                        startDate: startDate.toDate(),
                    },
                }
            );
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    }
};

/**
 * @name deleteDayComment
 * @function
 * @category API
 * @param {Number} DayCommentID Day comment ID to remove.
 * @description
 * Remove a day comment.
 * @todo rename for consistancy
 */
export const deleteDayComment = async (DayCommentID, EmployeeID, startDate) => {
    try {
        const res = await API().delete(
            `timesheets/${EmployeeID}/dayComments/${DayCommentID}`,
            {
                params: {
                    startDate: startDate.toDate(),
                },
            }
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

export const createTimesheetSubmission = async (
    employeeID,
    lastDay,
    ApprovalID,
    startDate
) => {
    try {
        const res = await API().post(
            `timesheets/${employeeID}/submit`,
            { employeeID, lastDay, ApprovalID },
            {
                params: {
                    startDate: startDate.toDate(),
                },
            }
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

export const readSubordinates = async (SupervisorID, startDate) => {
    try {
        const res = await API().get(
            `timesheets/managers/${SupervisorID}/subordinates`,
            {
                params: {
                    startDate,
                    userType: "manager",
                },
            }
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

export const readPayrollSubordinates = async (SupervisorID, startDate) => {
    try {
        const res = await API().get(
            `timesheets/payroll/${SupervisorID}/subordinates`,
            {
                params: {
                    startDate,
                    userType: "manager",
                },
            }
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

export const createTimesheetLock = async (LockedBy, EmployeeID) => {
    try {
        const res = await API().post(
            `timesheets/managers/${LockedBy}/lockEmployee/${EmployeeID}`,
            {
                LockedBy,
                userType: "manager",
            }
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

export const deleteTimesheetLock = async (SupervisorID, EmployeeID) => {
    try {
        const res = await API().delete(
            `timesheets/managers/${SupervisorID}/unlockEmployee/${EmployeeID}`
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

export const updatePayrollApproval = async (
    PayrollID,
    ApprovalID,
    ApprovalStatus,
    PayrollComment
) => {
    try {
        const res = await API().put(`approvals/${ApprovalID}/payroll`, {
            PayrollID,
            ApprovalStatus,
            PayrollComment,
        });
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

export const updateEmployeeApproval = async (
    EmployeeID,
    ApprovalID,
    ApprovalStatus
) => {
    try {
        const res = await API().put(`approvals/${ApprovalID}/employee`, {
            EmployeeID,
            ApprovalStatus,
        });
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

export const updateSupervisorApproval = async (
    SupervisorID,
    ApprovalID,
    ApprovalStatus,
    SupervisorComment
) => {
    try {
        const res = await API().put(`approvals/${ApprovalID}/supervisor`, {
            SupervisorID,
            ApprovalStatus,
            SupervisorComment,
        });
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};
