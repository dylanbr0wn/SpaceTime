import { EventType } from "@azure/msal-browser";
import { createReducer } from "@reduxjs/toolkit";

import initialState from "./initialState";

const aadReducer = createReducer(initialState.aad, (builder) => {
  builder.addCase(EventType.ACQUIRE_TOKEN_SUCCESS, (state, action) => {
    return {
      ...state,
      ...action.payload,
    };
  });
});

export default aadReducer;
