import {
  READ_TIMESHEET_SUCCESS,
  READ_TEMPLATES_SUCCESS,
  SAVE_TIME_ENTRY_SUCCESS,
  SAVE_TIME_ENTRY_ROW_SUCCESS,
  SAVE_TIME_ENTRY_ROW_OFFLINE,
  DELETE_TIME_ENTRY_ROW_SUCCESS,
  CREATE_TIME_ENTRY_ROW,
  SAVE_ALTERNATE_ENTRY_SUCCESS,
  DELETE_ALTERNATE_ENTRY_SUCCESS,
  DELETE_TEMPLATE_SUCCESS,
  SAVE_TIME_SHEET_DAY_COMMENT_SUCCESS,
  DELETE_TIME_SHEET_DAY_COMMENT_SUCCESS,
  CREATE_TIMESHEET_SUBMISSION_SUCCESS,
  UPDATE_PAYROLL_APPROVAL_SUCCESS,
  UPDATE_SUPERVISOR_APPROVAL_SUCCESS,
  SORT_TIMESHEET,
  CREATE_TEMPLATE_SUCCESS,
  DELETE_UNUSEDROWS_SUCCESS,
  READ_TEMPLATE_SUCCESS,
} from "../actions/actionTypes";
import initialState, { timesheetInital } from "./initialState";
import moment from "moment";
import { createReducer } from "@reduxjs/toolkit";

const timesheetReducer = createReducer(initialState.timesheet, (builder) => {
  builder
    .addCase(READ_TIMESHEET_SUCCESS, (state, action) => {
      //work days
      let workDays = new Array(14).fill(undefined).map((entry, i) => {
        return {
          TimeEntryID: null,
          WorkCodeID: -1,
          ProjectID: -1,
          EmployeeID: action.EmployeeID,
          HoursWorked: "",
          DateofWork: moment.utc(action.startDate).add(i, "days"),
          Comment: null,
        };
      });
      //hour entries
      let hourEntries = action.entries
        .filter((day) => day.WorkCodeID !== 62)
        .map((day) => ({
          ...day,
          SubmissionDate: moment.utc(day.SubmissionDate),
        }));
      //alternate entries
      let alternateEntries = action.entries.find(
        (day) => day.WorkCodeID === 62
      );
      alternateEntries = alternateEntries
        ? alternateEntries.dates
        : workDays.map((day) => ({
            ...day,
            WorkCodeID: 62,
            ProjectID: 514,
            DateofWork: day.DateofWork.toISOString(),
            SubmissionDate: moment.utc(day.SubmissionDate),
          }));

      //approval
      let newApproval = timesheetInital.approval;
      if (action.approval) {
        newApproval = { ...newApproval, ...action.approval };
      }
      let approval = {
        ...newApproval,
        SubmitCount: action.submitCount ? action.submitCount.SubmitCount : null,
        SubmissionComment: action.submitCount
          ? action.submitCount.Comment
          : null,
      };

      return {
        ...state,
        [action.EmployeeID]: {
          ...timesheetInital,
          ...state[action.EmployeeID],
          initialLoad: true,
          startDate: action.startDate,
          workDays,
          alternateEntries,
          hourEntries,
          dayComments: action.comments,
          approval,
        },
      };
    })
    .addCase(READ_TEMPLATES_SUCCESS, (state, action) => {
      return {
        ...state,
        [action.EmployeeID]: {
          ...timesheetInital,
          ...state[action.EmployeeID],
          templates: action.templates,
        },
      };
    })
    .addCase(READ_TEMPLATE_SUCCESS, (state, action) => {
      if (action.overwrite) {
        let workDays = new Array(14).fill(undefined).map((entry, i) => {
          return {
            TimeEntryID: null,
            WorkCodeID: -1,
            ProjectID: -1,
            EmployeeID: action.EmployeeID,
            HoursWorked: "",
            DateofWork: moment.utc(action.startDate).add(i, "days"),
            Comment: null,
          };
        });

        return {
          ...state,
          [action.EmployeeID]: {
            ...timesheetInital,
            ...state[action.EmployeeID],
            hourEntries: action.rows,
            alternateEntries: workDays.map((day) => ({
              ...day,
              WorkCodeID: 62,
              ProjectID: 514,
              DateofWork: day.DateofWork.toISOString(),
            })),
          },
        };
      }
      return {
        ...state,
        [action.EmployeeID]: {
          ...timesheetInital,
          ...state[action.EmployeeID],
          hourEntries: [
            ...state[action.EmployeeID].hourEntries,
            ...action.rows,
          ],
        },
      };
    })
    .addCase(SAVE_TIME_ENTRY_SUCCESS, (state, action) => {
      return {
        ...state,
        [action.entry.EmployeeID]: {
          ...timesheetInital,
          ...state[action.entry.EmployeeID],
          hourEntries: state[action.entry.EmployeeID].hourEntries.map(
            (row, index) => {
              if (index === action.rowIndex) {
                return {
                  ...row,
                  dates: row.dates.map((column, jndex) => {
                    if (jndex === action.columnIndex - 4) {
                      return action.entry;
                    }
                    return column;
                  }),
                };
              }
              return row;
            }
          ),
        },
      };
    })
    .addCase(SAVE_TIME_ENTRY_ROW_SUCCESS, (state, action) => {
      return {
        ...state,
        [action.EmployeeID]: {
          ...timesheetInital,
          ...state[action.EmployeeID],
          hourEntries: state[action.EmployeeID].hourEntries.map(
            (row, index) => {
              if (index === action.rowIndex) {
                if (action.id === "DepartmentID") {
                  //To prevent awkward state when changing departments where the rows department and Project do not match, must update project before further modificationca can be made
                  return {
                    ...action.newRow,
                    ProjectID: -1,
                    TimeEntryRowID: action.rowInfo.TimeEntryRowID,
                    dates: action.newRow.dates.map((date) => ({
                      ...date,
                      [action.id]: action.value,
                      ProjectID: -1,
                    })),
                  };
                } else {
                  return {
                    ...action.newRow,
                    TimeEntryRowID: action.rowInfo.TimeEntryRowID,
                    dates: action.newRow.dates.map((date) => ({
                      ...date,
                      [action.id]: action.value,
                    })),
                  };
                }
              }
              return row;
            }
          ),
        },
      };
    })
    .addCase(SAVE_TIME_ENTRY_ROW_OFFLINE, (state, action) => {
      return {
        ...state,
        [action.EmployeeID]: {
          ...timesheetInital,
          ...state[action.EmployeeID],
          hourEntries: state[action.EmployeeID].hourEntries.map(
            (row, index) => {
              if (index === action.rowIndex) {
                return {
                  ...action.newRow,
                  dates: action.newRow.dates.map((date) => ({
                    ...date,
                    [action.id]: action.value,
                  })),
                };
              }
              return row;
            }
          ),
        },
      };
    })
    .addCase(DELETE_TIME_ENTRY_ROW_SUCCESS, (state, action) => {
      return {
        ...state,
        [action.EmployeeID]: {
          ...timesheetInital,
          ...state[action.EmployeeID],
          hourEntries: state[action.EmployeeID].hourEntries.filter(
            (value, i) => i !== action.index
          ),
        },
      };
    })
    .addCase(CREATE_TIME_ENTRY_ROW, (state, action) => {
      return {
        ...state,
        [action.EmployeeID]: {
          ...timesheetInital,
          ...state[action.EmployeeID],
          hourEntries: [
            ...state[action.EmployeeID].hourEntries,
            {
              TimeEntryRowID: action.rowInfo.TimeEntryRowID,
              WorkCodeID: -1,
              ProjectID: -1,
              DepartmentID: -1,
              EmployeeID: action.EmployeeID,
              dates: state[action.EmployeeID].workDays,
            },
          ],
        },
      };
    })
    .addCase(SAVE_ALTERNATE_ENTRY_SUCCESS, (state, action) => {
      return {
        ...state,
        [action.entry.EmployeeID]: {
          ...timesheetInital,
          ...state[action.entry.EmployeeID],
          alternateEntries: state[action.entry.EmployeeID].alternateEntries.map(
            (data) => {
              if (data.DateofWork === action.entry.DateofWork) {
                return action.entry;
              }
              return data;
            }
          ),
        },
      };
    })
    .addCase(DELETE_ALTERNATE_ENTRY_SUCCESS, (state, action) => {
      return {
        ...state,
        [action.entry.EmployeeID]: {
          ...timesheetInital,
          ...state[action.entry.EmployeeID],
          alternateEntries: state[action.entry.EmployeeID].alternateEntries.map(
            (data) => {
              if (data.TimeEntryID === action.entry.TimeEntryID) {
                return {
                  ...data,
                  WorkCodeID: 62,
                  ProjectID: 514,
                  HoursWorked: "",
                  TimeEntryID: null,
                };
              }
              return data;
            }
          ),
        },
      };
    })
    .addCase(CREATE_TEMPLATE_SUCCESS, (state, action) => {
      state[action.EmployeeID].templates.push(action.template);
    })
    .addCase(DELETE_TEMPLATE_SUCCESS, (state, action) => {
      state[action.EmployeeID].templates = state[
        action.EmployeeID
      ].templates.filter((temp) => temp.TemplateID !== action.TemplateID);
    })
    .addCase(SAVE_TIME_SHEET_DAY_COMMENT_SUCCESS, (state, action) => {
      state[action.dayComment.EmployeeID].dayComments = state[
        action.dayComment.EmployeeID
      ].dayComments.map((dayComment) => {
        if (dayComment.DateofComment === action.dayComment.DateofComment) {
          return action.dayComment;
        } else {
          return dayComment;
        }
      });
    })
    .addCase(DELETE_TIME_SHEET_DAY_COMMENT_SUCCESS, (state, action) => {
      state[action.EmployeeID].dayComments = state[
        action.EmployeeID
      ].dayComments.map((dayComment) => {
        if (dayComment.DayCommentID === action.DayCommentID) {
          return {
            EmployeeID: dayComment.EmployeeID,
            Comment: null,
            DateofComment: dayComment.DateofComment,
          };
        }
        return dayComment;
      });
    })
    .addCase(CREATE_TIMESHEET_SUBMISSION_SUCCESS, (state, action) => {
      state[action.EmployeeID].approval.ApprovalStatus = action.ApprovalStatus;
      state[action.EmployeeID].approval.ApprovalID = action.ApprovalID;
      state[action.EmployeeID].approval.SupervisorComment =
        action.SupervisorComment;
      state[action.EmployeeID].approval.PayrollComment = action.PayrollComment;

      state[action.EmployeeID].hourEntries = state[
        action.EmployeeID
      ].hourEntries.map((row) => {
        return {
          ...row,
          dates: row.dates.map((date) => {
            if (date.TimeEntryID) {
              return {
                ...date,
                SubmissionID: action.SubmissionID,
                SubmissionDate: moment.utc(action.SubmissionDate),
              };
            }
            return date;
          }),
        };
      });
      state[action.EmployeeID].alternateEntries = state[
        action.EmployeeID
      ].alternateEntries.map((entry) => {
        if (entry.TimeEntryID) {
          return {
            ...entry,
            SubmissionID: action.SubmissionID,
            SubmissionDate: moment.utc(action.SubmissionDate),
          };
        }
        return entry;
      });
    })
    .addCase(UPDATE_PAYROLL_APPROVAL_SUCCESS, (state, action) => {
      state[action.EmployeeID].approval.ApprovalStatus = action.ApprovalStatus;
      state[action.EmployeeID].approval.ApprovalID = action.ApprovalID;
      state[action.EmployeeID].approval.PayrollComment = action.PayrollComment;
    })
    .addCase(UPDATE_SUPERVISOR_APPROVAL_SUCCESS, (state, action) => {
      state[action.EmployeeID].approval.ApprovalStatus = action.ApprovalStatus;
      state[action.EmployeeID].approval.ApprovalID = action.ApprovalID;
      state[action.EmployeeID].approval.SupervisorComment =
        action.SupervisorComment;
    })
    .addCase(SORT_TIMESHEET, (state, action) => {
      state[action.EmployeeID].hourEntries = action.sortedHourEntries;
    })

    .addCase(DELETE_UNUSEDROWS_SUCCESS, (state, action) => {
      state[action.EmployeeID].hourEntries = state[
        action.EmployeeID
      ].hourEntries.filter((row) => {
        let keepRow = false;
        row.dates.forEach((day) => {
          if (day.TimeEntryID) {
            keepRow = true;
          }
        });
        return keepRow;
      });
    });
});

export default timesheetReducer;
