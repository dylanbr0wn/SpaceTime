import projects from "./reducers/projectsReducer";
import departments from "./reducers/departmentsReducer";
import workCodes from "./reducers/workCodesReducer";
import settings from "./reducers/settingsReducer";
import currentUser from "./reducers/currentUserReducer";
import apiCallsInProgress from "./reducers/apiStatusReducer";
import isAuthenticated from "./reducers/isAuthenticatedReducer";
import employees from "./reducers/employeesReducer";
import timesheet from "./reducers/timesheetReducer";
import subordinates from "./reducers/subordinatesReducer";
import aad from "./reducers/aadReducer";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    employees,
    aad,
    settings,
    projects,
    isAuthenticated,
    workCodes,
    departments,
    currentUser,
    apiCallsInProgress,
    timesheet,
    subordinates,
  },
});

export default store;
