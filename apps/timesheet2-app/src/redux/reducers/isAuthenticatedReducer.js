import { createReducer } from "@reduxjs/toolkit";
import {
  LOGOUT_SUCCESS,
  READ_CURRENT_USER_SUCCESS,
} from "../actions/actionTypes";
import initialState from "./initialState";

const isAuthenticatedReducer = createReducer(
  initialState.isAuthenticated,
  (builder) => {
    builder
      .addCase(READ_CURRENT_USER_SUCCESS, () => {
        return true;
      })
      .addCase(LOGOUT_SUCCESS, () => {
        return false;
      });
  }
);

export default isAuthenticatedReducer;
