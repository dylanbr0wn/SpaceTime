import { createReducer } from "@reduxjs/toolkit";
import {
  READ_SUBORDINATES_SUCCESS,
  READ_SUBORDINATES_WORK_CODES_SUCCESS,
  CREATE_TIMESHEET_LOCK_SUCCESS,
  DELETE_TIMESHEET_LOCK_SUCCESS,
  SAVE_SUBORDINATE_ROWS,
} from "../actions/actionTypes";
import initialState from "./initialState";

const subordinatesReducer = createReducer(
  initialState.subordinates,
  (builder) => {
    builder
      .addCase(READ_SUBORDINATES_SUCCESS, (state, action) => {
        return {
          ...state,
          employeeInfo: action.subordinates.map((sub) => ({
            user: sub,
            workCodes: [],
          })),
        };
      })
      .addCase(READ_SUBORDINATES_WORK_CODES_SUCCESS, (state, action) => {
        return {
          ...state,
          employeeInfo: state.employeeInfo.map((sub) => {
            if (sub.user.EmployeeID === action.EmployeeID)
              return { ...sub, workCodes: action.workCodes };
            else return sub;
          }),
        };
      })
      .addCase(CREATE_TIMESHEET_LOCK_SUCCESS, (state, action) => {
        return {
          ...state,
          employeeInfo: state.employeeInfo.map((sub) => {
            if (sub.user.EmployeeID === action.EmployeeID) {
              return {
                ...sub,
                user: {
                  ...sub.user,
                  LockStatus: "Locked",
                },
              };
            } else return sub;
          }),
        };
      })
      .addCase(DELETE_TIMESHEET_LOCK_SUCCESS, (state, action) => {
        return {
          ...state,
          employeeInfo: state.employeeInfo.map((sub) => {
            if (sub.user.EmployeeID === parseInt(action.EmployeeID)) {
              return {
                ...sub,
                user: {
                  ...sub.user,
                  LockStatus: null,
                },
              };
            } else return sub;
          }),
        };
      })
      .addCase(SAVE_SUBORDINATE_ROWS, (state, action) => {
        return {
          ...state,
          tableRows: action.rows.map((row) => row.original),
        };
      });
  }
);

export default subordinatesReducer;
