import express from "express";
import {
    validate,
    timeEntryRowUpdateValidationRules,
    timeEntryRowDeleteValidationRules,
    timesheetSubmitValidationRules,
    employeeTimeSheetReadValidationRules,
    timesheetDeleteUnusedRowsValidationRules,
} from "../../services/validate";
const router = express.Router();
import entries from "./entries";
import templates from "./templates";
import dayComments from "./dayComments";
import managers from "./managers";
import {
    checkLock,
    checkSupervisor,
    checkPayroll,
    checkApproval,
} from "../../services/middleware";
import {
    updateRowController,
    deleteRowController,
    submitTimesheetController,
    readEmployeeTimesheetController,
    createRowController,
    getPayrollSubordinateController,
    deleteUnusedRowsController,
} from "../../controllers/timesheets/timesheetsController";

router.use("/managers", checkSupervisor(), managers);

router.use(
    "/payroll/:id/subordinates",
    checkPayroll(),
    getPayrollSubordinateController
);

router.post(
    "/:id/createRow",
    checkLock(),
    checkApproval(),
    createRowController
);
/**
 * @api {put} /timeEntry/updateRow Update Row.
 * @apiName UpdateTimeEntryRow
 * @apiGroup TimeEntry
 * @apiDescription Update a whole row of time entries.
 * @apiParam {Object} row Row of entries to update.
 * @todo makes this more standard
 */
router.put(
    "/:id/updateRow",
    checkLock(),
    checkApproval(),
    validate(timeEntryRowUpdateValidationRules),
    updateRowController
);

/**
 * @api {delete} /timeEntry/deleteRow Delete Row.
 * @apiName DeleteTimeEntryRow
 * @apiGroup TimeEntry
 * @apiDescription Delete a whole row of time entries.
 * @apiParam {Object} row Row of entries to delete.
 * @todo makes this more standard
 */
router.delete(
    "/:id/deleteRow",
    checkLock(),
    checkApproval(),
    validate(timeEntryRowDeleteValidationRules),
    deleteRowController
);

router.delete(
    "/:id/deleteUnusedRows",
    checkLock(),
    checkApproval(),
    validate(timesheetDeleteUnusedRowsValidationRules),
    deleteUnusedRowsController
);

/**
 * @api {post} /timeEntry/submit Submit Timesheet.
 * @apiName SubmitTimesheet
 * @apiGroup TimeEntry
 * @apiDescription Submit a timesheet.
 * @apiParam {Array} timeSheet Array of time entry rows.
 * @apiParam {Number} employeeID ID of an employee.
 * @apiParam {Date} lastDay Last day of timesheet.
 */
router.post(
    "/:id/submit",
    checkLock(),
    checkApproval(),
    validate(timesheetSubmitValidationRules),
    submitTimesheetController
);
/**
 * @api {get} /:id/timeSheet Read Employee Time Sheet.
 * @apiName GetEmployeeTimeSheet
 * @apiGroup Employee
 * @apiDescription Read timesheet associated with an employee ID in a time frame. Includes day comments.
 * @apiParam {Number} id Employee ID to fetch time sheet.
 * @apiParam {String} startDate Date string specifying the first day of timesheet to fetch entries for.
 */
router.get(
    "/:id",
    validate(employeeTimeSheetReadValidationRules),
    readEmployeeTimesheetController
);

router.use("/:id/entries", checkLock(), checkApproval(), entries);
router.use("/:id/templates", checkLock(), templates);
router.use(
    "/:id/dayComments",
    checkLock(),
    checkLock(),
    checkApproval(),
    dayComments
);

export default router;
