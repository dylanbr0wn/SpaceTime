import API, { handleResponse, handleError } from "./Api";

/**
 * @name readEmployees
 * @function
 * @category API
 * @description
 * GET request to API for loading user objects.
 */
export const readEmployees = async () => {
    try {
        const res = await API().get("employees");
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * @name saveEmployee
 * @param {Object} employee Employee object to save.
 * @param {Array} workCodes Work codes associated with new employee.
 * @function
 * @category API
 * @description
 * PUT request to API for updating a user/employee object and associated work codes.
 */
export const saveEmployee = async (employee, workCodes = []) => {
    if (employee.EmployeeID) {
        try {
            const res = await API().put(`employees/${employee.EmployeeID}`, {
                employee,
                workCodes,
            });
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    } else {
        try {
            const res = await API().post(`employees/`, { employee, workCodes });
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    }
};

/**
 * @name readEmployeeWorkCodes
 * @param {Number} EmployeeID ID of employee.
 * @function
 * @category API
 * @description
 * GET request to API to load work codes associated with an EmployeeID
 */
export const readEmployeeWorkCodes = async EmployeeID => {
    try {
        const res = await API().get(`employees/${EmployeeID}/workCodes`);
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * @name readTemplates
 * @param {Number} EmployeeID ID of employee.
 * @function
 * @category API
 * @description
 * GET request to API to load templates for an employee.
 */
export const readTemplates = async EmployeeID => {
    try {
        const res = await API().get(`employees/${EmployeeID}/templates`);
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

export const saveEmployeePreferences = async (
    EmployeeID,
    PreferenceID,
    Value,
    EmployeePreferenceID
) => {
    if (EmployeePreferenceID) {
        try {
            const res = await API().put(
                `employees/${EmployeeID}/preferences/${EmployeePreferenceID}`,
                {
                    Value,
                }
            );
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    } else {
        try {
            const res = await API().post(
                `employees/${EmployeeID}/preferences`,
                {
                    PreferenceID,
                    Value,
                }
            );
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    }
};

export const createEmployeePinnedRow = async (
    EmployeeID,
    DepartmentID,
    ProjectID,
    WorkCodeID
) => {
    try {
        const res = await API().post(
            `employees/${EmployeeID}/preferences/pinnedRows`,
            {
                DepartmentID,
                ProjectID,
                WorkCodeID,
            }
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

export const deleteEmployeePinnedRow = async (
    EmployeeID,
    EmployeePinnedRowID
) => {
    try {
        const res = await API().delete(
            `employees/${EmployeeID}/preferences/pinnedRows/${EmployeePinnedRowID}`
        );
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};
