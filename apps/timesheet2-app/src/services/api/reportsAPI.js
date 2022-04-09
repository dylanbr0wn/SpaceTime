import API, { handleResponse, handleError } from "./Api";
import { saveAs } from "file-saver";

/**
 * @name getDynamicsReport
 * @function
 * @category API
 * @param {Date} startDate Start date of dynamics report.
 * @param {Date} endDate End date of dynamics report.
 * @description
 * Get dynamics report between start date and end date.
 */
export const readDynamicsReport = async (startDate, endDate) => {
  try {
    const res = await API().get(`reports/dynamics`, {
      params: {
        startDate,
        endDate,
      },
    });
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * @name getEmployeeTimeSheetReport
 * @function
 * @category API
 * @param {Number} employeeID ID of employee.
 * @param {Date} startDate Start date of report.
 * @param {Date} endDate End date of report.
 * @description
 * Get employee timesheet report for period between start and end date.
 */
export const readEmployeeReport = async (employeeID, startDate, endDate) => {
  try {
    const res = await API().get(`reports/employeeTimeSheet`, {
      params: {
        employeeID,
        startDate,
        endDate,
      },
    });
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * @name getTardyEmployeesReport
 * @function
 * @category API
 * @param {Date} startDate Start date of report.
 * @description
 * Get employees who have not submitted a timesheet for the current period.
 */
export const readTardyEmployeesReport = async (startDate) => {
  try {
    const res = await API().get(`reports/tardyEmployees`, {
      params: {
        startDate,
      },
    });

    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * @name getEmployeePayrollPeriodReport
 * @function
 * @category API
 * @param {Number} employeeID Employee ID for report
 * @param {Date} startDate Start date of report.
 * @description
 * Get print out report for employee pay period
 */
export const readEmployeePayrollPeriodReport = async (
  employeeID,
  startDate,
  fileName
) => {
  try {
    const res = await API().get(`reports/payrollPeriodReport`, {
      params: {
        employeeID,
        startDate,
      },
      responseType: "blob",
    });
    const file = new Blob([res.data], { type: "application/pdf" });
    //save file
    saveAs(file, fileName);
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

export const readAllEmployeeComments = async (
  employeeID,
  startDate,
  fileName
) => {
  try {
    const res = await API().get(`reports/employeeCommentsReport`, {
      params: {
        employeeID,
        startDate,
      },
      responseType: "blob",
    });
    const file = new Blob([res.data], { type: "application/pdf" });
    //save file
    saveAs(file, fileName);
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};
