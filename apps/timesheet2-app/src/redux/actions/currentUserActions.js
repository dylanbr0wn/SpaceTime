import { setToken, silentRecover } from "../../services/api/Api";
import * as authApi from "../../services/api/authApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

import { saveEmployeePreferences } from "../../services/api/employeesAPI";
import {
  LOGOUT_SUCCESS,
  READ_CURRENT_USER_SUCCESS,
  SAVE_CURRENT_USER_PASSWORD_SUCCESS,
  SAVE_EMPLOYEE_PREFS_SUCCESS,
} from "./actionTypes";
/**
 * Actions
 */

export function readCurrentUserSuccess({ employee, preferences }) {
  return {
    type: READ_CURRENT_USER_SUCCESS,
    payload: { employee, preferences },
  };
}

export function savePasswordSuccess() {
  return { type: SAVE_CURRENT_USER_PASSWORD_SUCCESS };
}

export function logoutSuccess() {
  return { type: LOGOUT_SUCCESS };
}

const saveEmployeePreferencesSuccess = (preference) => {
  return {
    type: SAVE_EMPLOYEE_PREFS_SUCCESS,
    preference,
  };
};

/**
 * Action Dispatchers
 */

export const ADLoginCurrentUser = (idToken) => {
  return async (dispatch, getState) => {
    dispatch(beginApiCall());
    try {
      const aadResponse = getState().aad;
      setToken(idToken);
      const result = await authApi.getAD(aadResponse.account.username);
      if (result.success) {
        dispatch(readCurrentUserSuccess(result.data));
        return { success: true };
      } else if (result.status === 401) {
        dispatch(apiCallError("Unauthorized"));
        return {
          success: false,
          data: `Error: Couldnt find Employee associated with ${aadResponse.account.username}. Contact IT for help.`,
        };
      } else {
        dispatch(apiCallError("Unauthorized"));
        return false;
      }
    } catch (error) {
      dispatch(apiCallError(error));
      throw error;
    }
  };
};

export const saveEmployeePreferencesDispatch = (
  EmployeeID,
  PreferenceID,
  Value,
  EmployeePreferenceID = null
) => {
  return async (dispatch) => {
    dispatch(beginApiCall());
    try {
      const result = await saveEmployeePreferences(
        EmployeeID,
        PreferenceID,
        Value,
        EmployeePreferenceID
      );
      if (result.success) {
        dispatch(saveEmployeePreferencesSuccess(result.data));
        return result;
      } else if (result.status === 401) {
        dispatch(apiCallError("Cant save time entry."));
        let status = await silentRecover();
        if (status) {
          return dispatch(
            saveEmployeePreferencesDispatch(
              EmployeeID,
              PreferenceID,
              Value,
              EmployeePreferenceID
            )
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
