import { beginApiCall, apiCallError } from "./apiStatusActions";
import * as types from "./actionTypes";
import {
    readDynamicsReport,
    readEmployeeReport,
    readTardyEmployeesReport,
} from "../../services/api/reportsAPI";
import { silentRecover } from "../../services/api/Api";

/**
 * Actions
 */

const readDynamicsReportSuccess = () => {
    return { type: types.READ_DYNAMICS_REPORT_SUCCESS };
};

const readEmployeeTimeSheetReportSuccess = () => {
    return { type: types.READ_EMPLOYEE_TIME_SHEET_REPORT_SUCCESS };
};

const readTardyEmployeesReportSuccess = () => {
    return { type: types.READ_EMPLOYEE_TIME_SHEET_REPORT_SUCCESS };
};

/**
 * Action Dispatchers
 */

export const readDynamicsReportDispatch = (startDate, endDate) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await readDynamicsReport(startDate, endDate);
            if (result.success) {
                dispatch(readDynamicsReportSuccess());
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant get dynamics report"));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        readDynamicsReportDispatch(startDate, endDate)
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant get dynamics report"));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const readEmployeeTimeSheetReportDispatch = (
    EmployeeID,
    startDate,
    endDate
) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await readEmployeeReport(
                EmployeeID,
                startDate,
                endDate
            );
            if (result.success) {
                dispatch(readEmployeeTimeSheetReportSuccess());
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant get timesheet report"));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        readEmployeeReport(EmployeeID, startDate, endDate)
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant get timesheet report"));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const readTardyEmployeesReportDispatch = (startDate) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await readTardyEmployeesReport(startDate);
            if (result.success) {
                dispatch(readTardyEmployeesReportSuccess());
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant get tardy employees report"));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        readTardyEmployeesReportDispatch(startDate)
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant get tardy employees report"));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};
