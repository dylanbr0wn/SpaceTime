import * as types from "./actionTypes";
import { beginApiCall, apiCallError } from "./apiStatusActions";
import { silentRecover } from "../../services/api/Api";
import {
  readObjects,
  saveProject,
  saveDepartment,
  saveSettings,
  saveWorkCode,
} from "../../services/api/objectsAPI";

/**
 * Actions
 */

export function readObjectsSuccess(objects) {
  return { type: types.READ_OBJECTS_SUCCESS, objects };
}

export function saveProjectSuccess(project) {
  return { type: types.SAVE_PROJECT_SUCCESS, project };
}

export function saveWorkCodeSuccess(workCode) {
  return { type: types.SAVE_WORK_CODE_SUCCESS, workCode };
}

export function saveDepartmentSuccess(department) {
  return { type: types.SAVE_DEPARTMENT_SUCCESS, department };
}

export function saveSettingsSuccess(settings) {
  return { type: types.SAVE_SETTINGS_SUCCESS, settings };
}

/**
 * Action Dispatchers
 */
export const readObjectsDispatch = () => {
  return async (dispatch) => {
    dispatch(beginApiCall());
    try {
      const result = await readObjects();
      if (result.success) {
        dispatch(readObjectsSuccess(result.data));
        return { success: true };
      } else if (result.status === 401) {
        dispatch(apiCallError("Cant get Objects"));
        let status = await silentRecover();
        if (status) {
          return dispatch(readObjectsDispatch());
        } else {
          return result;
        }
      } else {
        dispatch(apiCallError("Cant get Objects"));
        return result;
      }
    } catch (error) {
      dispatch(apiCallError(error));
      throw error;
    }
  };
};

export const saveProjectDispatch = (project) => {
  return async (dispatch) => {
    dispatch(beginApiCall());
    try {
      const result = await saveProject(project);
      if (result.success) {
        dispatch(saveProjectSuccess(result.data));
        return { success: true };
      } else if (result.status === 401) {
        dispatch(apiCallError("Cant save project."));
        let status = await silentRecover();
        if (status) {
          return dispatch(saveProjectDispatch(project));
        } else {
          return result;
        }
      } else {
        dispatch(apiCallError("Cant save project."));
        return result;
      }
    } catch (error) {
      dispatch(apiCallError(error));
      throw error;
    }
  };
};

export const saveDepartmentDispatch = (department) => {
  return async (dispatch) => {
    dispatch(beginApiCall());
    try {
      const result = await saveDepartment(department);
      if (result.success) {
        dispatch(saveDepartmentSuccess(result.data));
        return { success: true };
      } else if (result.status === 401) {
        dispatch(apiCallError("Cant save department."));
        let status = await silentRecover();
        if (status) {
          return dispatch(saveDepartment(department));
        } else {
          return result;
        }
      } else {
        dispatch(apiCallError("Cant save department."));
        return result;
      }
    } catch (error) {
      dispatch(apiCallError(error));
      throw error;
    }
  };
};

export const saveWorkCodeDispatch = (workCode) => {
  return async (dispatch) => {
    dispatch(beginApiCall());
    try {
      const result = await saveWorkCode(workCode);
      if (result.success) {
        dispatch(saveWorkCodeSuccess(result.data));
        return { success: true };
      } else if (result.status === 401) {
        dispatch(apiCallError("Cant save work code."));
        let status = await silentRecover();
        if (status) {
          return dispatch(saveWorkCode(workCode));
        } else {
          return result;
        }
      } else {
        dispatch(apiCallError("Cant save work code."));
        return result;
      }
    } catch (error) {
      dispatch(apiCallError(error));
      throw error;
    }
  };
};

export const saveSettingsDispatch = (settings) => {
  return async (dispatch) => {
    dispatch(beginApiCall());
    try {
      const result = await saveSettings(settings);
      if (result.success) {
        dispatch(saveSettingsSuccess(result.data));
        return { success: true };
      } else if (result.status === 401) {
        dispatch(apiCallError("Cant save settings."));
        let status = await silentRecover();
        if (status) {
          return dispatch(saveSettings(settings));
        } else {
          return result;
        }
      } else {
        dispatch(apiCallError("Cant save settings."));
        return result;
      }
    } catch (error) {
      dispatch(apiCallError(error));
      throw error;
    }
  };
};
