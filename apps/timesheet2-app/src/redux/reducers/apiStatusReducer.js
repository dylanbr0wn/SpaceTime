import { createReducer } from "@reduxjs/toolkit";
import * as types from "../actions/actionTypes";
import initialState from "./initialState";

const actionTypeEndsInSuccess = (type) => {
  return type.substring(type.length - 8) === "_SUCCESS";
};

const apiCallStatusReducer = createReducer(
  initialState.apiCallsInProgress,
  (builder) => {
    builder
      .addCase(types.BEGIN_API_CALL, (state) => {
        return state + 1;
      })
      .addMatcher(
        (action) =>
          action.type === types.API_CALL_ERROR ||
          actionTypeEndsInSuccess(action.type),
        (state) => {
          return state === 0 ? 0 : state - 1;
        }
      );
  }
);

export default apiCallStatusReducer;
