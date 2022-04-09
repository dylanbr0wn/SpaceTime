import { beginApiCall, apiCallError } from "./apiStatusActions";
import * as types from "./actionTypes";
import {
    readTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
} from "../../services/api/timesheetsAPI";
import { silentRecover } from "../../services/api/Api";
import { readTemplates } from "../../services/api/employeesAPI";

/**
 * Actions
 */

const createTemplateSuccess = (template, EmployeeID) => {
    return {
        type: types.CREATE_TEMPLATE_SUCCESS,
        template,
        EmployeeID,
    };
};
const updateTemplateSuccess = () => {
    return { type: types.UPDATE_TEMPLATE_SUCCESS };
};
const readTemplatesSuccess = (templates, EmployeeID) => {
    return {
        type: types.READ_TEMPLATES_SUCCESS,
        templates,
        EmployeeID,
    };
};
const deleteTemplateSuccess = (TemplateID, EmployeeID) => {
    return { type: types.DELETE_TEMPLATE_SUCCESS, TemplateID, EmployeeID };
};

const readTemplateSuccess = (rows, EmployeeID, overwrite, startDate) => {
    return {
        type: types.READ_TEMPLATE_SUCCESS,
        rows,
        EmployeeID,
        overwrite,
        startDate,
    };
};

/**
 * Action Dispatchers
 */

export const readTemplateDispatch = (
    TemplateID,
    startDate,
    EmployeeID
    // timeSheet
) => {
    return async (dispatch, getState) => {
        dispatch(beginApiCall());
        try {
            let shouldOverwrite = false;
            if (getState().currentUser.user.EmployeeID === EmployeeID) {
                shouldOverwrite = getState().currentUser.preferences
                    .TemplateOverwrite.Value;
            }
            let result = await readTemplate(
                TemplateID,
                startDate,
                EmployeeID,
                shouldOverwrite
            );
            if (result.success) {
                dispatch(
                    readTemplateSuccess(
                        result.data,
                        EmployeeID,
                        shouldOverwrite,
                        startDate
                    )
                );
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant load template."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        readTemplateDispatch(
                            TemplateID,
                            startDate,
                            EmployeeID
                            // timeSheet
                        )
                    );
                } else {
                    return result;
                }
            } else if (result.status === 423) {
                window.location.reload();
            } else {
                dispatch(apiCallError("Cant load template."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const readTemplatesDispatch = (employeeID) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await readTemplates(employeeID);
            if (result.success) {
                dispatch(readTemplatesSuccess(result.data, employeeID));
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant load time sheet templates."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(readTemplatesDispatch(employeeID));
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant load time sheet templates."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const updateTemplateDispatch = (EmployeeID, TemplateID, timeSheet) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await updateTemplate(
                EmployeeID,
                TemplateID,
                timeSheet
            );
            if (result.success) {
                dispatch(updateTemplateSuccess());
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant load template."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        updateTemplateDispatch(
                            EmployeeID,
                            TemplateID,
                            timeSheet
                        )
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant load template."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const createTemplateDispatch = (EmployeeID, templateName, timesheet) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await createTemplate(
                EmployeeID,
                templateName,
                timesheet
            );
            if (result.success) {
                dispatch(
                    createTemplateSuccess(result.data.template, EmployeeID)
                );
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant load template."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        createTemplateDispatch(
                            EmployeeID,
                            templateName,
                            timesheet
                        )
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant load template."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const deleteTemplateDispatch = (TemplateID, EmployeeID) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await deleteTemplate(TemplateID, EmployeeID);
            if (result.success) {
                dispatch(deleteTemplateSuccess(TemplateID, EmployeeID));
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant delete template."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(deleteTemplate(TemplateID, EmployeeID));
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant delete template."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};
