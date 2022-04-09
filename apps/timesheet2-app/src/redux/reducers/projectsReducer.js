import { createReducer } from "@reduxjs/toolkit";
import {
  READ_OBJECTS_SUCCESS,
  SAVE_PROJECT_SUCCESS,
  LOGOUT_SUCCESS,
} from "../actions/actionTypes";
import initialState from "./initialState";

const projectsReducer = createReducer(initialState.projects, (builder) => {
  builder
    .addCase(READ_OBJECTS_SUCCESS, (_, action) => {
      return action.objects.projects;
    })
    .addCase(SAVE_PROJECT_SUCCESS, (state, action) => {
      return state
        .filter((project) => {
          return project.ProjectID !== action.project.ProjectID;
        })
        .concat(action.project);
    })
    .addCase(LOGOUT_SUCCESS, () => {
      return initialState.projects;
    });
});

export default projectsReducer;
