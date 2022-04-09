import { beginApiCall, apiCallError } from "./apiStatusActions";
import * as types from "./actionTypes";
import {
    saveDayComment,
    deleteDayComment,
} from "../../services/api/timesheetsAPI";
import { silentRecover } from "../../services/api/Api";

/**
 * Actions
 */

const saveDayCommentSuccess = (dayComment) => {
    return { type: types.SAVE_TIME_SHEET_DAY_COMMENT_SUCCESS, dayComment };
};
const deleteDayCommentSuccess = (DayCommentID, EmployeeID) => {
    return {
        type: types.DELETE_TIME_SHEET_DAY_COMMENT_SUCCESS,
        DayCommentID,
        EmployeeID,
    };
};

/**
 * Action Dispatchers
 */

export const saveDayCommentDispatch = (dayComment, EmployeeID, startDate) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await saveDayComment(
                dayComment,
                EmployeeID,
                startDate
            );
            if (result.success) {
                dispatch(saveDayCommentSuccess(result.data));

                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant save day comment."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        saveDayCommentDispatch(
                            dayComment,
                            EmployeeID,
                            startDate
                        )
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant save day comment."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};

export const deleteDayCommentDispatch = (
    DayCommentID,
    EmployeeID,
    startDate
) => {
    return async (dispatch) => {
        dispatch(beginApiCall());
        try {
            let result = await deleteDayComment(
                DayCommentID,
                EmployeeID,
                startDate
            );
            if (result.success) {
                dispatch(deleteDayCommentSuccess(DayCommentID, EmployeeID));
                return result;
            } else if (result.status === 401) {
                dispatch(apiCallError("Cant delete day comment."));
                let status = await silentRecover();
                if (status) {
                    return dispatch(
                        deleteDayComment(DayCommentID, EmployeeID, startDate)
                    );
                } else {
                    return result;
                }
            } else {
                dispatch(apiCallError("Cant delete day comment."));
                return result;
            }
        } catch (error) {
            dispatch(apiCallError(error));
            throw error;
        }
    };
};
