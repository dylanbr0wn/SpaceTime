import Api, { handleError, handleResponse } from "./Api";

/**
 * @name getObjects
 * @function
 * @category API
 * @description
 * GET request to API for loading timesheet objects.
 */
export const readObjects = async () => {
    try {
        const res = await Api().get("objects");
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};

/**
 * @name saveProject
 * @function
 * @category API
 * @param {Object} project Project object to save or update.
 * @description
 * Save and create new projects
 */
export const saveProject = async project => {
    if (project.ProjectID) {
        try {
            const res = await Api().put(
                `objects/projects/${project.ProjectID}`,
                { ...project }
            );
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    } else {
        try {
            const res = await Api().post(`objects/projects/`, { ...project });
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    }
};

/**
 * @name saveDepartment
 * @function
 * @category API
 * @param {Object} department Department object to save or update.
 * @description
 * Save and create new departments
 */
export const saveDepartment = async department => {
    if (department.DepartmentID) {
        try {
            const res = await Api().put(
                `objects/departments/${department.DepartmentID}`,
                { ...department }
            );
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    } else {
        try {
            const res = await Api().post(`objects/departments/`, {
                ...department,
            });
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    }
};

/**
 * @name saveWorkCode
 * @function
 * @category API
 * @param {Object} workCode Work code object to save or update.
 * @description
 * Save and create new work codes.
 */
export const saveWorkCode = async workCode => {
    if (workCode.WorkCodeID) {
        try {
            const res = await Api().put(
                `objects/workCodes/${workCode.WorkCodeID}`,
                { ...workCode }
            );
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    } else {
        try {
            const res = await Api().post(`objects/workCodes/`, { ...workCode });
            return handleResponse(res);
        } catch (error) {
            return handleError(error);
        }
    }
};

/**
 * @name saveSettings
 * @function
 * @category API
 * @param {Object} settings Settings to save.
 * @description
 * Save new settings.
 */
export const saveSettings = async settings => {
    try {
        const res = await Api().put(`objects/settings`, { ...settings });
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};
