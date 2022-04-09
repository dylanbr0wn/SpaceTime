import { NextFunction, Request, Response } from "express";
import {
    body,
    validationResult,
    query,
    param,
    oneOf,
    ValidationChain,
    ValidationError,
} from "express-validator";
import { HttpException, handleError } from "./error";

export const userLoginValidationRules = [
    // username must be an email
    body("username").notEmpty().isString(),
    // password must be at least 5 chars long
    body("password").notEmpty().isString(),
];

export const userCreateValidationRules = [
    body("Username").notEmpty().isString(),
    body("Password").notEmpty().isLength({ min: 8 }).isString(),
    body("EmployeeID").notEmpty().isInt().toInt(),
];

export const userChangePasswordValidationRules = [
    body("password").notEmpty().isLength({ min: 8 }).isString(),
];

export const employeeCreateValidationRules = [
    body("employee.SAMAccountName").notEmpty().isLength({ max: 50 }).isString(),
    body("employee.LastName").isLength({ max: 50 }).isString(),
    body("employee.FirstName").isLength({ max: 50 }).isString(),
    body("employee.DiamondEmpID").isLength({ max: 50 }).isString(),
    body("employee.DepartmentID").isLength({ max: 50 }).isInt().toInt(),
    body("employee.SupervisorID").isLength({ max: 50 }).isInt().toInt(),
    body("employee.IsActive")
        .notEmpty()
        .isLength({ max: 50 })
        .isBoolean()
        .toBoolean(),
    body("employee.IsPayrollClerk")
        .notEmpty()
        .isLength({ max: 50 })
        .isBoolean()
        .toBoolean(),
    body("employee.IsAdministrator")
        .notEmpty()
        .isLength({ max: 50 })
        .isBoolean()
        .toBoolean(),
    body("employee.IsSupervisor")
        .notEmpty()
        .isLength({ max: 50 })
        .isBoolean()
        .toBoolean(),

    body("employee.Email")
        .if(body("employee.Email").notEmpty())
        .isLength({ max: 50 })
        .isEmail()
        .normalizeEmail(),
];

export const employeeGetValidationRules = [
    param("id").notEmpty().isInt().toInt(),
];

export const employeeUpdateValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    body("employee.SAMAccountName").notEmpty().isLength({ max: 50 }).isString(),
    body("employee.LastName").isLength({ max: 50 }).isString(),
    body("employee.FirstName").isLength({ max: 50 }).isString(),
    body("employee.DiamondEmpID").isLength({ max: 50 }).isString(),
    body("employee.DepartmentID").isInt().toInt(),
    body("employee.SupervisorID").isInt().toInt(),
    body("employee.IsActive").notEmpty().isBoolean().toBoolean(),
    body("employee.IsPayrollClerk").notEmpty().isBoolean().toBoolean(),
    body("employee.IsAdministrator").notEmpty().isBoolean().toBoolean(),
    body("employee.IsSupervisor").notEmpty().isBoolean().toBoolean(),
    body("employee.Email")
        .if(body("employee.Email").notEmpty())
        .isLength({ max: 50 })
        .isEmail()
        .normalizeEmail(),
];

export const projectCreateValidationRules = [
    body("Name").notEmpty().isLength({ max: 50 }).isString(),
    body("Description").notEmpty().isLength({ max: 50 }).isString(),
    body("DepartmentID").notEmpty().isInt().toInt(),
    body("IsActive").notEmpty().isBoolean().toBoolean(),
    body("GLCode")
        .if(body("GLCode").notEmpty())
        .isLength({ max: 20 })
        .isString(),
    body("DeptCode")
        .if(body("DeptCode").notEmpty())
        .isLength({ max: 20 })
        .isString(),
];

export const projectUpdateValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    body("Name").notEmpty().isLength({ max: 50 }).isString(),
    body("Description").notEmpty().isLength({ max: 50 }).isString(),
    body("DepartmentID").notEmpty().isInt().toInt(),
    body("IsActive").notEmpty().isBoolean().toBoolean(),
    body("GLCode")
        .if(body("GLCode").notEmpty())
        .isLength({ max: 20 })
        .isString(),
    body("DeptCode")
        .if(body("DeptCode").notEmpty())
        .isLength({ max: 20 })
        .isString(),
];

export const departmentCreateValidationRules = [
    body("DeptName").notEmpty().isLength({ max: 50 }).isString(),
    body("IsActive").notEmpty().isBoolean().toBoolean(),
];

export const departmentUpdateValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    body("DeptName").notEmpty().isLength({ max: 50 }).isString(),
    body("IsActive").notEmpty().isBoolean().toBoolean(),
];

export const workCodeCreateValidationRules = [
    body("Code").notEmpty().isLength({ max: 15 }).isString(),
    body("Description").notEmpty().isLength({ max: 50 }).isString(),
    body("ExportToDynamics").notEmpty().isBoolean().toBoolean(),
    body("IsDefault").notEmpty().isBoolean().toBoolean(),
    body("Multiplier").notEmpty().isNumeric().toFloat(),
];

export const workCodeUpdateValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    body("Code").notEmpty().isLength({ max: 15 }).isString(),
    body("Description").notEmpty().isLength({ max: 50 }).isString(),
    body("ExportToDynamics").notEmpty().isBoolean().toBoolean(),
    body("IsDefault").notEmpty().isBoolean().toBoolean(),
    body("Multiplier").notEmpty().isNumeric().toFloat(),
];

export const settingsUpdateValidationRules = [
    body("CutOffDate").notEmpty().isISO8601().toDate(),
    // body('HoursPerDay').isDecimal().toFloat(),
    body("RecordID").notEmpty().isInt().toInt(),
    body("SharepointURLForApproval").isLength({ max: 256 }).isString(),
];

export const tardyEmployeeValidationRules = [
    query("startDate").notEmpty().isISO8601().toDate(),
];

export const employeeTimeSheetValidationRules = [
    query("employeeID").notEmpty().isInt().toInt(),
    query("startDate").notEmpty().isISO8601().toDate(),
    query("endDate").notEmpty().isISO8601().toDate(),
];

export const payrollPeriodReportValidationRules = [
    query("employeeID").notEmpty().isInt().toInt(),
    query("startDate").notEmpty().isISO8601().toDate(),
];

export const dynamicsValidationRules = [
    query("startDate").notEmpty().isISO8601().toDate(),
    query("endDate").notEmpty().isISO8601().toDate(),
];

export const templateCreateValidationRules = [
    body("EmployeeID").notEmpty().isInt().toInt(),
    body("TemplateName").notEmpty().isLength({ max: 50 }).isString(),
    body("timesheet").isArray().toArray(),
];

export const templateUpdateValidationRules = [
    param("templateid").notEmpty().isInt().toInt(),
    body("EmployeeID").notEmpty().isInt().toInt(),
    body("Entries").isArray().toArray(),
];

export const templateDeleteValidationRules = [
    param("templateid").notEmpty().isInt().toInt(),
];

export const dayCommentCreateValidationRules = [
    body("EmployeeID").notEmpty().isInt().toInt(),
    body("DateofComment").notEmpty().isISO8601().toDate(),
    body("Comment").notEmpty().isLength({ max: 256 }).isString(),
];

export const dayCommentUpdateValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    body("comment").notEmpty().isLength({ max: 256 }).isString(),
];

export const dayCommentDeleteValidationRules = [
    param("id").notEmpty().isInt().toInt(),
];

export const templateLoadValidationRules = [
    param("templateid").notEmpty().isInt().toInt(),
    body("startDate").notEmpty().isISO8601().toDate(),
    body("EmployeeID").notEmpty().isInt().toInt(),
    // body("timeSheet").isArray().toArray(),
];

export const timeEntryCreateValidationRules = [
    body("EmployeeID").notEmpty().isInt().toInt(),
    body("ProjectID").notEmpty().isInt().toInt(),
    body("WorkCodeID").notEmpty().isInt().toInt(),
    body("Comment")
        .if(body("Comment").notEmpty())
        .isLength({ max: 256 })
        .isString(),
    body("HoursWorked").notEmpty().isDecimal().toFloat(),
    body("DateofWork").notEmpty().isISO8601().toDate(),
];

export const timeEntryRowUpdateValidationRules = [
    body("ProjectID").notEmpty().isInt().toInt(),
    body("WorkCodeID").notEmpty().isInt().toInt(),
    body("dates").isArray().toArray(),
];

export const timeEntryRowDeleteValidationRules = [
    body("ProjectID").if(body("ProjectID").notEmpty()).isInt().toInt(),
    body("WorkCodeID").if(body("WorkCodeID").notEmpty()).isInt().toInt(),
    body("dates").isArray().toArray(),
];

export const timesheetDeleteUnusedRowsValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    // query("startDate").notEmpty().isISO8601().toDate(),
];

export const timeEntryUpdateValidationRules = [
    param("entryid").notEmpty().isInt().toInt(),
    body("EmployeeID").notEmpty().isInt().toInt(),
    body("ProjectID").notEmpty().isInt().toInt(),
    body("WorkCodeID").notEmpty().isInt().toInt(),
    body("Comment")
        .if(body("Comment").notEmpty())
        .isLength({ max: 256 })
        .isString(),
    body("HoursWorked").notEmpty().isDecimal().toFloat(),
    body("DateofWork").notEmpty().isISO8601().toDate(),
];

export const timeEntryDeleteValidationRules = [
    param("entryid").notEmpty().isInt().toInt(),
];

export const timesheetSubmitValidationRules = [
    body("employeeID").notEmpty().isInt().toInt(),
    // body("timeSheet").notEmpty().isArray().toArray(),
    body("lastDay").notEmpty().isISO8601().toDate(),
    query("startDate").notEmpty().isISO8601().toDate(),
];

export const employeeTimeSheetReadValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    query("startDate").notEmpty().isISO8601().toDate(),
];

export const employeeTemplatesReadValidationRules = [
    param("id").notEmpty().isInt().toInt(),
];

export const employeeTimeEntryReadValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    query("startDate").notEmpty().isISO8601().toDate(),
];

export const readManagerSubordinatesValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    query("startDate").notEmpty().isISO8601().toDate(),
];

export const lockEmployeeTimesheetValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    param("subordinateid").notEmpty().isInt().toInt(),
];

export const unlockEmployeeTimesheetValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    param("subordinateid").notEmpty().isInt().toInt(),
];

export const updateSupervisorApprovalValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    body("ApprovalStatus")
        .if(body("ApprovalStatus").notEmpty())
        .isInt()
        .toInt(),
    body("SupervisorComment")
        .if(body("SupervisorComment").notEmpty())
        .isLength({ max: 256 })
        .isString(),
];

export const updatePayrollApprovalValidationRules = [
    param("id").notEmpty().isInt().toInt(),
    body("ApprovalStatus")
        .if(body("ApprovalStatus").notEmpty())
        .isInt()
        .toInt(),
    body("PayrollComment")
        .if(body("SupervisorComment").notEmpty())
        .isLength({ max: 256 })
        .isString(),
];

export const createApprovalValidationRules = [
    body("SubmissionID").notEmpty().isInt().toInt(),
];

export const createEmployeePreferenceValidationRules = [
    body("PreferenceID").notEmpty().isInt().toInt(),
    param("id").notEmpty().isInt().toInt(),
];

export const updateEmployeePreferenceValidationRules = [
    param("EmployeePreferenceID").notEmpty().isInt().toInt(),
    param("id").notEmpty().isInt().toInt(),
];

export const createEmployeePinnedRowsValidationRules = [
    body("DepartmentID").notEmpty().isInt().toInt(),
    body("ProjectID").notEmpty().isInt().toInt(),
    body("WorkCodeID").notEmpty().isInt().toInt(),
    param("id").notEmpty().isInt().toInt(),
];

export const deleteEmployeePinnedRowsValidationRules = [
    param("EmployeePinnedRowID").notEmpty().isInt().toInt(),
    param("id").notEmpty().isInt().toInt(),
];

/**
 * @function parseCSV
 * @param {Array} validations Array of express validator functions
 * @description
 * Validate the request object using the given validations array.
 */
export const validate = (validations: ValidationChain[]) => {
    return async (req: any, res: Response, next: NextFunction) => {
        try {
            await Promise.all(
                validations.map((validation) => validation.run(req))
            );
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return next();
            }

            const extractedErrors: string[] = [];
            errors
                .array()
                .map((err) =>
                    extractedErrors.push(`${err.msg} for ${err.param}`)
                );
            throw new HttpException(400, extractedErrors.join(". "));
        } catch (err) {
            return next(err);
        }
    };
};
