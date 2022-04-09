import * as types from "./actionTypes";
import {
    saveEmployee,
    readEmployees,
    readEmployeeWorkCodes,
} from "../../services/api/employeesAPI";
import { beginApiCall, apiCallError } from "./apiStatusActions";
import { silentRecover } from "../../services/api/Api";

/**
 * Actions
 */

const readEmployeesSuccess = (employees) => {
    return { type: types.READ_EMPLOYEES_SUCCESS, employees };
};

const saveEmployeeSuccess = (employee) => {
    return { type: types.SAVE_EMPLOYEE_SUCCESS, employee };
};

const readEmployeeWorkCodeSuccess = () => {
    return { type: types.READ_EMPLOYEE_WORK_CODE_SUCCESS };
};

const readUserWorkCodesSuccess = (workCodes) => {
    return {
        type: types.LOAD_USER_WORK_CODES_SUCCESS,
        workCodes,
    };
};

export const readEmployeesDispatch = () => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await readEmployees();
            if (result.success) {
                dispatch(readEmployeesSuccess(result.data));
                return { success: true };
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant get Users"));
                let status = await silentRecover();
                if (status) {
                    return dispatch(readEmployeesDispatch());
                } else {
                    return result;
                }
            } else if (result.status === 423) {
                window.location.reload();
            } else {
                dispatch(apiCallError("Cant get Users"));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const saveEmployeeDispatch = (employee, workCodes) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await saveEmployee(employee, workCodes);
            if (result.success) {
                dispatch(saveEmployeeSuccess(result.data));
                return { success: true, data: result.data };
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save employee"));
                let status = await silentRecover();
                if (status) {
                    return dispatch(saveEmployeeDispatch(employee, workCodes));
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant save employee"));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const readEmployeeWorkCodesDispatch = (EmployeeID) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await readEmployeeWorkCodes(EmployeeID);
            if (result.success) {
                dispatch(readEmployeeWorkCodeSuccess());
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant load employee work codes"));
                let status = await silentRecover();
                if (status) {
                    return dispatch(readEmployeeWorkCodesDispatch(EmployeeID));
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

export const readUserWorkCodesDispatch = (EmployeeID) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await readEmployeeWorkCodes(EmployeeID);
            if (result.success) {
                dispatch(readUserWorkCodesSuccess(result.data));
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(readUserWorkCodesDispatch(EmployeeID));
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
