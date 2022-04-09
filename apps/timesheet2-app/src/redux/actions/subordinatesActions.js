import {
    readPayrollSubordinates,
    readSubordinates,
    createTimesheetLock,
    deleteTimesheetLock,
} from "../../services/api/timesheetsAPI";
import { beginApiCall, apiCallError } from "./apiStatusActions";
import * as types from "./actionTypes";
import { readEmployeeWorkCodes } from "../../services/api/employeesAPI";
import { silentRecover } from "../../services/api/Api";

/**
 * Actions
 */

const readSubordinatesSuccess = (subordinates, EmployeeID) => {
    return { type: types.READ_SUBORDINATES_SUCCESS, subordinates, EmployeeID };
};

export const readSubordinateWorkCodesSuccess = (workCodes, EmployeeID) => {
    return {
        type: types.READ_SUBORDINATES_WORK_CODES_SUCCESS,
        workCodes,
        EmployeeID,
    };
};

export const deleteTimesheetLockSuccess = (EmployeeID) => {
    return {
        type: types.DELETE_TIMESHEET_LOCK_SUCCESS,
        EmployeeID,
    };
};

export const createTimesheetLockSuccess = (EmployeeID) => {
    return {
        type: types.CREATE_TIMESHEET_LOCK_SUCCESS,
        EmployeeID,
    };
};

/**
 * Action Dispatchers
 */

export const readPayrollSubordinatesDispatch = (employeeID, startDay) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await readPayrollSubordinates(employeeID, startDay);
            if (result.success) {
                dispatch(readSubordinatesSuccess(result.data, employeeID));
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        readPayrollSubordinatesDispatch(employeeID, startDay)
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant submit time sheet."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

/**
 * @function
 * @name loadSubordinates
 * @description Get a subordinate list for a manager. Action Dispatcher.
 * @param {Number} employeeID EmployeeID of manager.
 * @param {Date} startDay Start of pay period.
 */
export const readSubordinatesDispatch = (employeeID, startDay) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await readSubordinates(employeeID, startDay);
            if (result.success) {
                dispatch(readSubordinatesSuccess(result.data, employeeID));
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        readSubordinatesDispatch(employeeID, startDay)
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant submit time sheet."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

/**
 * @function
 * @name loadSubordinateWorkCodes
 * @description Loads work codes for a subordinate. Action Dispatcher.
 * @param {Number} employeeID EmployeeID of subordinate.
 */
export const readSubordinateWorkCodesDispatch = (EmployeeID) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await readEmployeeWorkCodes(EmployeeID);
            if (result.success) {
                dispatch(
                    readSubordinateWorkCodesSuccess(result.data, EmployeeID)
                );
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        readSubordinateWorkCodesDispatch(EmployeeID)
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant load employee work codes"));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

/**
 * @function
 * @name lockSubordinateTimesheet
 * @description Lock a timesheet for a subordinate. Action Dispatcher.
 * @param {Number} EmployeeID EmployeeID of subordinate.
 * @param {Number} SupervisorID EmployeeID of manager.
 */
export const createTimesheetLockDispatch = (SupervisorID, EmployeeID) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        dispatch(createTimesheetLockSuccess(EmployeeID));
        try {
            const result = await createTimesheetLock(SupervisorID, EmployeeID);
            if (result.success) {
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        createTimesheetLockDispatch(SupervisorID, EmployeeID)
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant lock subordinate timesheet"));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

/**
 * @function
 * @name unlockSubordinateTimesheet
 * @description Unlock a timesheet for a subordinate. Action Dispatcher.
 * @param {Number} EmployeeID EmployeeID of subordinate.
 * @param {Number} SupervisorID EmployeeID of manager.
 */
export const deleteTimesheetLockDispatch = (SupervisorID, EmployeeID) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        dispatch(deleteTimesheetLockSuccess(EmployeeID));
        try {
            const result = await deleteTimesheetLock(SupervisorID, EmployeeID);
            if (result.success) {
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(deleteTimesheetLockDispatch(EmployeeID));
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant unlock subordinate timesheet"));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const saveSubordinateRows = (rows) => {
    return (dispatch) => {
        dispatch({ type: types.SAVE_SUBORDINATE_ROWS, rows });
    };
};
