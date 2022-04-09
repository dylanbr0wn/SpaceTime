import { createReducer } from "@reduxjs/toolkit";
import {
  LOGOUT_SUCCESS,
  READ_OBJECTS_SUCCESS,
  SAVE_WORK_CODE_SUCCESS,
} from "../actions/actionTypes";
import initialState from "./initialState";

const workCodesReducer = createReducer(initialState.workCodes, (builder) => {
  builder
    .addCase(READ_OBJECTS_SUCCESS, (_, action) => {
      return action.objects.workCodes;
    })
    .addCase(SAVE_WORK_CODE_SUCCESS, (state, action) => {
      return state
        .filter((workCode) => {
          return workCode.WorkCodeID !== action.workCode.WorkCodeID;
        })
        .concat(action.workCode);
    })
    .addCase(LOGOUT_SUCCESS, () => {
      return initialState.workCodes;
    });
});

export default workCodesReducer;
