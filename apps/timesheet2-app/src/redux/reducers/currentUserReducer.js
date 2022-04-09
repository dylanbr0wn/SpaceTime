/* eslint-disable no-unused-vars */
import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { silentRecover } from "../../services/api/Api";
import {
  createEmployeePinnedRow,
  deleteEmployeePinnedRow,
} from "../../services/api/employeesAPI";
import {
  LOGOUT_SUCCESS,
  READ_CURRENT_USER_SUCCESS,
  LOAD_USER_WORK_CODES_SUCCESS,
  SAVE_EMPLOYEE_PREFS_SUCCESS,
  CREATE_EMPLOYEE_PINNED_ROW_SUCCESS,
  DELETE_EMPLOYEE_PINNED_ROW_SUCCESS,
} from "../actions/actionTypes";
import { apiCallError, beginApiCall } from "../actions/apiStatusActions";
import initialState from "./initialState";

export const createEmployeePinnedRowAction = createAsyncThunk(
  CREATE_EMPLOYEE_PINNED_ROW_SUCCESS,
  async ({ EmployeeID, DepartmentID, ProjectID, WorkCodeID }, thunkAPI) => {
    thunkAPI.dispatch(beginApiCall());
    const result = await createEmployeePinnedRow(
      EmployeeID,
      DepartmentID,
      ProjectID,
      WorkCodeID
    );
    if (result.success) {
      return result;
    } else if (result.status === 401) {
      thunkAPI.dispatch(apiCallError("Cant save time entry."));
      let status = await silentRecover();
      if (status) {
        thunkAPI.dispatch(
          createEmployeePinnedRowAction({
            EmployeeID,
            DepartmentID,
            ProjectID,
            WorkCodeID,
          })
        );
      } else {
        return result;
      }
    } else {
      thunkAPI.dispatch(apiCallError("Cant load employee work codes"));
      return result;
    }
  }
);

export const deleteEmployeePinnedRowAction = createAsyncThunk(
  DELETE_EMPLOYEE_PINNED_ROW_SUCCESS,
  async ({ EmployeeID, EmployeePinnedRowID }, thunkAPI) => {
    thunkAPI.dispatch(beginApiCall());
    try {
      const result = await deleteEmployeePinnedRow(
        EmployeeID,
        EmployeePinnedRowID
      );
      if (result.success) {
        return EmployeePinnedRowID;
      } else if (result.status === 401) {
        thunkAPI.dispatch(apiCallError("Cant save time entry."));
        let status = await silentRecover();
        if (status) {
          return thunkAPI.dispatch(
            deleteEmployeePinnedRowAction({
              EmployeeID,
              EmployeePinnedRowID,
            })
          );
        } else {
          return result;
        }
      } else {
        thunkAPI.dispatch(apiCallError("Cant load employee work codes"));
        return result;
      }
    } catch (error) {
      thunkAPI.dispatch(apiCallError(error));
      throw error;
    }
  }
);

const currentUserReducer = createReducer(
  initialState.currentUser,
  (builder) => {
    builder
      .addCase(READ_CURRENT_USER_SUCCESS, (state, action) => {
        state.user = action.payload.employee;
        state.preferences = action.payload.preferences;
      })
      .addCase(SAVE_EMPLOYEE_PREFS_SUCCESS, (state, action) => {
        state.preferences[action.preference.PreferenceCode] = action.preference;
      })
      .addCase(createEmployeePinnedRowAction.fulfilled, (state, action) => {
        state.preferences.PinnedRows.Value.push(action.payload.data);
      })
      .addCase(deleteEmployeePinnedRowAction.fulfilled, (state, action) => {
        state.preferences.PinnedRows.Value =
          state.preferences.PinnedRows.Value.filter(
            (row) => row.EmployeePinnedRowID !== action.payload
          );
      })
      .addCase(LOGOUT_SUCCESS, (state, action) => {
        state = initialState.currentUser;
      })
      .addCase(LOAD_USER_WORK_CODES_SUCCESS, (state, action) => {
        state.workCodes = action.workCodes;
      });
  }
);

export default currentUserReducer;
