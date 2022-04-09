import { createReducer } from "@reduxjs/toolkit";
import {
  READ_EMPLOYEES_SUCCESS,
  SAVE_USER_SUCCESS,
  SAVE_EMPLOYEE_SUCCESS,
  LOGOUT_SUCCESS,
} from "../actions/actionTypes";
import initialState from "./initialState";

const employeeReducer = createReducer(initialState.employees, (builder) => {
  builder
    .addCase(READ_EMPLOYEES_SUCCESS, (_, action) => {
      return action.employees;
    })
    .addCase(SAVE_USER_SUCCESS, (state, action) => {
      return state.map((employee) => {
        if (employee.EmployeeID === action.userData.EmployeeID) {
          return { ...employee, ...action.userData };
        }
        return employee;
      });
    })
    .addCase(SAVE_EMPLOYEE_SUCCESS, (state, action) => {
      return state
        .filter((employee) => {
          return employee.EmployeeID !== action.employee.EmployeeID;
        })
        .concat(action.employee);
    })
    .addCase(LOGOUT_SUCCESS, () => {
      return initialState.employees;
    });
});

export default employeeReducer;
