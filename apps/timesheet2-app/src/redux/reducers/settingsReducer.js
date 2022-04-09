import { createReducer } from "@reduxjs/toolkit";
import {
  READ_OBJECTS_SUCCESS,
  SAVE_SETTINGS_SUCCESS,
  LOGOUT_SUCCESS,
} from "../actions/actionTypes";
import initialState from "./initialState";

const settingsReducer = createReducer(initialState.settings, (builder) => {
  builder
    .addCase(READ_OBJECTS_SUCCESS, (_, action) => {
      return action.objects.settings;
    })
    .addCase(SAVE_SETTINGS_SUCCESS, (_, action) => {
      return action.settings;
    })
    .addCase(LOGOUT_SUCCESS, () => {
      return initialState.settings;
    });
});

export default settingsReducer;
