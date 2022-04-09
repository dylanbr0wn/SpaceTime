import express from "express";
import {
  validate,
  tardyEmployeeValidationRules,
  employeeTimeSheetValidationRules,
  dynamicsValidationRules,
  payrollPeriodReportValidationRules,
} from "../services/validate";
const router = express.Router();
import { checkPayroll } from "../services/middleware";
import {
  dynamicsReportController,
  employeeTimesheetReportController,
  tardyEmployeeReportController,
  payrollPeriodReportController,
  employeeCommentsReportController,
} from "../controllers/reportsController";

/**
 * @api {get} /report/dynamics Dynamics Report
 * @apiName GetDynamicsReport
 * @apiGroup Reports
 * @apiDescription Execute procedure to create a dynamics report.
 * @apiParam {String} startDate Start date of dynamics report.
 * @apiParam {String} endDate End date of dynamics report.
 */
router.get(
  "/dynamics",
  validate(dynamicsValidationRules),
  checkPayroll(),
  dynamicsReportController
);

/**
 * @api {get} /report/employeeTimeSheet Employee Timesheet Report
 * @apiName GetEmployeeTimesheetReport
 * @apiGroup Reports
 * @apiDescription Execute procedure to create an employee timesheet report.
 * @apiParam {String} startDate Start date of report.
 * @apiParam {String} endDate End date of report.
 * @apiParam {Number} employeeID Employee ID for report.
 */
router.get(
  "/employeeTimeSheet",
  validate(employeeTimeSheetValidationRules),
  checkPayroll(),
  employeeTimesheetReportController
);

/**
 * @api {get} /report/tardyEmployees Tardy Employee Report
 * @apiName GetTardyEmployeeReport
 * @apiGroup Reports
 * @apiDescription Execute procedure to create a tardy employee report.
 * @apiParam {String} startDate Start date of report.
 */
router.get(
  "/tardyEmployees",
  validate(tardyEmployeeValidationRules),
  checkPayroll(),
  tardyEmployeeReportController
);

router.get(
  "/payrollPeriodReport",
  validate(payrollPeriodReportValidationRules),
  payrollPeriodReportController
);

router.get(
  "/employeeCommentsReport",
  validate(payrollPeriodReportValidationRules),
  employeeCommentsReportController
);

export default router;
