import { beginApiCall, apiCallError } from "./apiStatusActions";
import {
    saveTimeEntry,
    saveTimeEntryRow,
    deleteTimeEntry,
    deleteTimeEntryRow,
    readTimeSheet,
    deleteUnusedRows,
} from "../../services/api/timesheetsAPI";
import { silentRecover } from "../../services/api/Api";
import {
    CREATE_TIME_ENTRY_ROW,
    DELETE_ALTERNATE_ENTRY_SUCCESS,
    DELETE_TIME_ENTRY_ROW_SUCCESS,
    DELETE_UNUSEDROWS_SUCCESS,
    READ_TIMESHEET_SUCCESS,
    SAVE_ALTERNATE_ENTRY_SUCCESS,
    SAVE_TIME_ENTRY_ROW_SUCCESS,
    SAVE_TIME_ENTRY_SUCCESS,
    SORT_TIMESHEET,
} from "./actionTypes";

/**
 * Actions
 */

export const readTimesheetSuccess = (
    { comments, entries, approval = {}, submitCount },
    startDate,
    EmployeeID
) => {
    return {
        type: READ_TIMESHEET_SUCCESS,
        entries,
        comments,
        approval,
        startDate,
        EmployeeID,
        submitCount,
    };
};

const saveTimeEntrySuccess = (entry, rowIndex, columnIndex) => {
    return {
        type: SAVE_TIME_ENTRY_SUCCESS,
        entry,
        rowIndex,
        columnIndex,
    };
};

const saveTimeEntryRowSuccess = (
    rowIndex,
    value,
    id,
    newRow,
    EmployeeID,
    rowInfo
) => {
    return {
        type: SAVE_TIME_ENTRY_ROW_SUCCESS,
        rowIndex,
        value,
        id,
        newRow,
        EmployeeID,
        rowInfo,
    };
};

const deleteTimeEntryRowSuccess = (index, EmployeeID) => {
    return { type: DELETE_TIME_ENTRY_ROW_SUCCESS, index, EmployeeID };
};

const createTimeEntryRowSuccess = (EmployeeID, rowInfo) => {
    return { type: CREATE_TIME_ENTRY_ROW, EmployeeID, rowInfo };
};

const saveTimeEntryAlternateSuccess = (entry) => {
    return { type: SAVE_ALTERNATE_ENTRY_SUCCESS, entry };
};

const deleteTimeEntryAlternateSuccess = (entry) => {
    return { type: DELETE_ALTERNATE_ENTRY_SUCCESS, entry };
};

const deleteUnusedRowsSuccess = (EmployeeID) => {
    return { type: DELETE_UNUSEDROWS_SUCCESS, EmployeeID };
};

/**
 * Action Dispatchers
 */

export const readTimesheetDispatch = (employeeID, startDate, userType) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            const result = await readTimeSheet(employeeID, startDate, userType);
            if (result.success) {
                dispatch(
                    readTimesheetSuccess(result.data, startDate, employeeID)
                );
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        readTimesheetDispatch(employeeID, startDate, userType)
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant load time sheet."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const saveTimeEntryDispatch = (
    rowIndex,
    columnIndex,
    work,
    EmployeeID,
    timeEntryPeriodStartDate
) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await saveTimeEntry(
                work,
                EmployeeID,
                timeEntryPeriodStartDate
            );
            if (result.success) {
                dispatch(
                    saveTimeEntrySuccess(result.data, rowIndex, columnIndex)
                );
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        saveTimeEntryDispatch(
                            rowIndex,
                            columnIndex,
                            work,
                            EmployeeID,
                            timeEntryPeriodStartDate
                        )
                    );
                } else {
                    return result;
                }
            } else if (result.status === 423) {
                window.location.reload();
            } else {
                dispatch(apiCallError("Cant save time entry."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const deleteTimeEntryDispatch = (
    rowIndex,
    columnIndex,
    work,
    EmployeeID,
    startDate
) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await deleteTimeEntry(
                work.TimeEntryID,
                EmployeeID,
                startDate
            );
            if (result.success) {
                dispatch(
                    saveTimeEntrySuccess(
                        { ...work, TimeEntryID: null, HoursWorked: "" },
                        rowIndex,
                        columnIndex
                    )
                );
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        deleteTimeEntryDispatch(
                            rowIndex,
                            columnIndex,
                            work,
                            EmployeeID,
                            startDate
                        )
                    );
                } else {
                    return result;
                }
            } else if (result.status === 423) {
                window.location.reload();
            } else {
                dispatch(apiCallError("Cant remove time entry."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const updateTimeEntryRowDispatch = (
    rowIndex,
    value,
    id,
    newRow,
    EmployeeID,
    startDate
) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await saveTimeEntryRow(newRow, EmployeeID, startDate);
            if (result.success) {
                dispatch(
                    saveTimeEntryRowSuccess(
                        rowIndex,
                        value,
                        id,
                        newRow,
                        EmployeeID,
                        result.data
                    )
                );
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        updateTimeEntryRowDispatch(
                            rowIndex,
                            value,
                            id,
                            newRow,
                            EmployeeID,
                            startDate
                        )
                    );
                } else {
                    return result;
                }
            } else if (result.status === 423) {
                window.location.reload();
            } else {
                dispatch(apiCallError("Cant remove time entry."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const deleteTimeEntryRowDispatch = (
    index,
    row,
    EmployeeID,
    startDate
) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await deleteTimeEntryRow(row, EmployeeID, startDate);
            if (result.success) {
                dispatch(deleteTimeEntryRowSuccess(index, EmployeeID));
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        deleteTimeEntryRow(index, row, EmployeeID, startDate)
                    );
                } else {
                    return result;
                }
            } else if (result.status === 423) {
                window.location.reload();
            } else {
                dispatch(apiCallError("Cant remove time entry."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const createTimeEntryRowDispatch = (EmployeeID, startDate) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await saveTimeEntryRow({}, EmployeeID, startDate);
            if (result.success) {
                dispatch(createTimeEntryRowSuccess(EmployeeID, result.data));
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        updateTimeEntryRowDispatch(EmployeeID, startDate)
                    );
                } else {
                    return result;
                }
            } else if (result.status === 423) {
                window.location.reload();
            } else {
                dispatch(apiCallError("Cant remove time entry."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const saveTimeEntryAlternateDispatch = (
    entry,
    EmployeeID,
    startDate
) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await saveTimeEntry(entry, EmployeeID, startDate);
            if (result.success) {
                dispatch(saveTimeEntryAlternateSuccess(result.data));
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        saveTimeEntryAlternateDispatch(
                            entry,
                            EmployeeID,
                            startDate
                        )
                    );
                } else {
                    return result;
                }
            } else if (result.status === 423) {
                window.location.reload();
            } else {
                dispatch(apiCallError("Cant remove time entry."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const deleteTimeEntryAlternateDispatch = (
    entry,
    EmployeeID,
    startDate
) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await deleteTimeEntry(
                entry.TimeEntryID,
                EmployeeID,
                startDate
            );
            if (result.success) {
                dispatch(deleteTimeEntryAlternateSuccess(entry));

                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save time entry."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        deleteTimeEntryAlternateDispatch(
                            entry,
                            EmployeeID,
                            startDate
                        )
                    );
                } else {
                    return result;
                }
            } else if (result.status === 423) {
                window.location.reload();
            } else {
                dispatch(apiCallError("Cant remove time entry."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const sortTimesheetDispatch = (sortedHourEntries, EmployeeID) => {
    return (dispatch) => {
        dispatch({ type: SORT_TIMESHEET, sortedHourEntries, EmployeeID });
    };
};

export const deleteUnusedRowsDispatch = (startDate, EmployeeID) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await deleteUnusedRows(EmployeeID, startDate);
            if (result.success) {
                dispatch(deleteUnusedRowsSuccess(EmployeeID));
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant delete unused rows."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        deleteUnusedRowsDispatch(EmployeeID, startDate)
                    );
                } else {
                    return result;
                }
            } else if (result.status === 423) {
                window.location.reload();
            } else {
                dispatch(apiCallError("Cant delete unused rows."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};
