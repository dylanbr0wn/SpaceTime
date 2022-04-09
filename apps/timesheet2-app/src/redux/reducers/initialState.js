import { AuthenticationState } from "react-aad-msal";
export default {
    currentUser: {
        user: {},
        preferences: [],
        workCodes: [],
    },
    departments: [],
    workCodes: [],
    projects: [],
    employees: [],
    settings: {},
    apiCallsInProgress: 0,
    isAuthenticated: false,
    timesheet: {},
    subordinates: {
        employeeInfo: [],
        tableRows: [],
    },
    aad: {
        initializing: false,
        initialized: false,
        idToken: null,
        accessToken: null,
        state: AuthenticationState.Unauthenticated,
    },
};

export const timesheetInital = {
    initialLoad: false,
    loading: false,
    startDate: null,
    workDays: [],
    alternateEntries: [],
    hourEntries: [],
    templates: [],
    dayComments: [],
    approval: {
        ApprovalID: null,
        ApprovalStatus: null,
        SupervisorComment: null,
        PayrollComment: null,
        submitCount: null,
    },
};
