import { beginApiCall, apiCallError } from "./apiStatusActions";
import {
    createTimesheetSubmission,
    updatePayrollApproval,
    updateSupervisorApproval,
} from "../../services/api/timesheetsAPI";
import { silentRecover } from "../../services/api/Api";
import * as types from "./actionTypes";

/**
 * Actions
 */

export const createTimesheetSubmissionSuccess = (
    {
        SubmissionID,
        LastUpdated,
        ApprovalStatus,
        ApprovalID,
        SupervisorComment,
        PayrollComment,
    },
    EmployeeID
) => {
    return {
        type: types.CREATE_TIMESHEET_SUBMISSION_SUCCESS,
        SubmissionID,
        SubmissionDate: LastUpdated,
        ApprovalStatus,
        ApprovalID,
        SupervisorComment,
        PayrollComment,
        EmployeeID,
    };
};

export const updatePayrollApprovalSuccess = (
    EmployeeID,
    PayrollID,
    ApprovalID,
    ApprovalStatus,
    PayrollComment
) => {
    return {
        type: types.UPDATE_PAYROLL_APPROVAL_SUCCESS,
        EmployeeID,
        PayrollID,
        ApprovalID,
        ApprovalStatus,
        PayrollComment,
    };
};

export const updateSupervisorApprovalSuccess = (
    EmployeeID,
    SupervisorID,
    ApprovalID,
    ApprovalStatus,
    SupervisorComment
) => {
    return {
        type: types.UPDATE_SUPERVISOR_APPROVAL_SUCCESS,
        EmployeeID,
        SupervisorID,
        ApprovalID,
        ApprovalStatus,
        SupervisorComment,
    };
};

/**
 * Action Dispatchers
 */

export const updatePayrollApprovalDispatch = (
    EmployeeID,
    PayrollID,
    ApprovalID,
    ApprovalStatus,
    PayrollComment
) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await updatePayrollApproval(
                PayrollID,
                ApprovalID,
                ApprovalStatus,
                PayrollComment
            );
            if (result.success) {
                dispatch(
                    updatePayrollApprovalSuccess(
                        EmployeeID,
                        PayrollID,
                        ApprovalID,
                        ApprovalStatus,
                        PayrollComment
                    )
                );
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant payroll approve."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        updatePayrollApproval(
                            EmployeeID,
                            PayrollID,
                            ApprovalID,
                            ApprovalStatus,
                            PayrollComment
                        )
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant payroll approve."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const updateSupervisorApprovalDispatch = (
    EmployeeID,
    SupervisorID,
    ApprovalID,
    ApprovalStatus,
    SupervisorComment
) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await updateSupervisorApproval(
                SupervisorID,
                ApprovalID,
                ApprovalStatus,
                SupervisorComment
            );
            if (result.success) {
                dispatch(
                    updateSupervisorApprovalSuccess(
                        EmployeeID,
                        SupervisorID,
                        ApprovalID,
                        ApprovalStatus,
                        SupervisorComment
                    )
                );
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant manager approve."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        updateSupervisorApproval(
                            EmployeeID,
                            SupervisorID,
                            ApprovalID,
                            ApprovalStatus,
                            SupervisorComment
                        )
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant manager approve."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const createTimesheetSubmissionDispatch = (
    employeeID,
    lastDay,
    ApprovalID,
    startDate
) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await createTimesheetSubmission(
                employeeID,
                lastDay,
                ApprovalID,
                startDate
            );
            if (result.success) {
                dispatch(
                    createTimesheetSubmissionSuccess(result.data, employeeID)
                );
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        createTimesheetSubmissionDispatch(
                            employeeID,
                            lastDay,
                            ApprovalID,
                            startDate
                        )
                    );
                } else {
                    return result;
                }
            } else if (result.status === 423) {
                window.location.reload();
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
