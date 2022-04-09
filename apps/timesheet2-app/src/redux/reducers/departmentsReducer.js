import { createReducer } from "@reduxjs/toolkit";
import {
  READ_OBJECTS_SUCCESS,
  SAVE_DEPARTMENT_SUCCESS,
  LOGOUT_SUCCESS,
} from "../actions/actionTypes";
import initialState from "./initialState";

const departmentsReducer = createReducer(
  initialState.departments,
  (builder) => {
    builder
      .addCase(READ_OBJECTS_SUCCESS, (_, action) => {
        return action.objects.departments;
      })
      .addCase(SAVE_DEPARTMENT_SUCCESS, (state, action) => {
        return state
          .filter((department) => {
            return department.DepartmentID !== action.department.DepartmentID;
          })
          .concat(action.department);
      })
      .addCase(LOGOUT_SUCCESS, () => {
        return initialState.departments;
      });
  }
);

export default departmentsReducer;
