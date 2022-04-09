import express from "express";
const router = express.Router();

import {
    validate,
    employeeCreateValidationRules,
    employeeGetValidationRules,
    employeeTemplatesReadValidationRules,
    deleteEmployeePinnedRowsValidationRules,
    createEmployeePinnedRowsValidationRules,
    updateEmployeePreferenceValidationRules,
    createEmployeePreferenceValidationRules,
} from "../services/validate";
import { checkAdmin } from "../services/middleware";
import {
    readEmployeesController,
    createEmployeesController,
    readEmployeeController,
    updateEmployeeController,
    readEmployeeWorkCodesController,
    readEmployeeTemplatesController,
    createEmployeePreferenceController,
    updateEmployeePreferenceController,
    createEmployeePinnedRowsController,
    deleteEmployeePinnedRowsController,
} from "../controllers/employeesController";
import { readEmployeeFromEmail } from "../database/employeeDB";

router.get("/loadEmployee", readEmployeeFromEmail);

/**
 * @api {get} /employee Read Employees.
 * @apiName GetEmployees
 * @apiGroup Employee
 * @apiDescription Read all employees.
 */
router.get("/", checkAdmin(), readEmployeesController);

/**
 * @api {post} /employee Create Employee.
 * @apiName PostEmployee
 * @apiGroup Employee
 * @apiDescription Create a new employee.
 * @apiParam {Object} employee Employee information to create new employee.
 * @apiParam {Object} workCodes Work codes to attach to new employee.
 */
router.post(
    "/",
    checkAdmin(),
    validate(employeeCreateValidationRules),
    createEmployeesController
);

/**
 * @api {get} /employee/:id Read Employee.
 * @apiName GetEmployee
 * @apiGroup Employee
 * @apiDescription Read an employee.
 * @apiParam {Number} id Employee ID to fetch information for.
 */
router.get(
    "/:id",
    validate(employeeGetValidationRules),
    readEmployeeController
);

/**
 * @api {put} /employee/:id Update Employee.
 * @apiName PutEmployee
 * @apiGroup Employee
 * @apiDescription Update a employee.
 * @apiParam {Number} id Employee ID to update.
 * @apiParam {Object} employee Employee information to create new employee.
 * @apiParam {Object} workCodes Work codes to attach to new employee.
 */
router.put(
    "/:id",
    validate(employeeCreateValidationRules),
    checkAdmin(),
    updateEmployeeController
);

/**
 * @api {get} /:id/workCodes Read Employee Work Codes.
 * @apiName GetEmployeeWorkCodes
 * @apiGroup Employee
 * @apiDescription Read work codes associated with an employee id.
 * @apiParam {Number} id Employee ID to fetch work codes.
 */
router.get(
    "/:id/workCodes",
    validate(employeeGetValidationRules),
    readEmployeeWorkCodesController
);

/**
 * @api {get} /:id/templates Read Employee Templates.
 * @apiName GetEmployeeTemplates
 * @apiGroup Employee
 * @apiDescription Read templates associated with an employee ID.
 * @apiParam {Number} id Employee ID to fetch templates.
 */
router.get(
    "/:id/templates",
    validate(employeeTemplatesReadValidationRules),
    readEmployeeTemplatesController
);

/**
 * @api {post} /:id/preferences Create Employee Preference.
 * @apiName createEmployeePreference
 * @apiGroup Employee
 * @apiDescription Create a preference entry for an employee.
 * @apiParam {Number} id Employee ID to create preference for.
 */
router.post(
    "/:id/preferences",
    validate(createEmployeePreferenceValidationRules),
    createEmployeePreferenceController
);

/**
 * @api {post} /:id/preferences/pinnedRows Create Employee Pinned Row.
 * @apiName createEmployeePinnedRows
 * @apiGroup Employee
 * @apiDescription Create a pinned row for an employee
 * @apiParam {Number} id Employee ID to create pinned row for.
 */
router.post(
    "/:id/preferences/pinnedRows",
    validate(createEmployeePinnedRowsValidationRules),
    createEmployeePinnedRowsController
);

/**
 * @api {put} /:id/preferences/:EmployeePreferenceID Update Employee Preference.
 * @apiName updateEmployeePreference
 * @apiGroup Employee
 * @apiDescription Update a preference entry for an employee.
 * @apiParam {Number} id Employee ID to create preference for.
 * @apiParam {Number} :EmployeePreferenceID ID of preference to update.
 */
router.put(
    "/:id/preferences/:EmployeePreferenceID",
    validate(updateEmployeePreferenceValidationRules),
    updateEmployeePreferenceController
);

/**
 * @api {delete} /:id/preferences/:EmployeePinnedRowID Delete Employee Pinned Row.
 * @apiName deleteEmployeePinnedRows
 * @apiGroup Employee
 * @apiDescription Delete a pinned row for an employee.
 * @apiParam {Number} id Employee ID to delete pinned row for.
 * @apiParam {Number} :EmployeePinnedRowID ID of pinned row to delete.
 */
router.delete(
    "/:id/preferences/pinnedRows/:EmployeePinnedRowID",
    validate(deleteEmployeePinnedRowsValidationRules),
    deleteEmployeePinnedRowsController
);

export default router;
