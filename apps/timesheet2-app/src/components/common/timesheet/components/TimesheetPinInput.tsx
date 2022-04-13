import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Tippy from "@tippyjs/react";

import {
    createEmployeePinnedRowAction,
    deleteEmployeePinnedRowAction,
} from "../../../../redux/reducers/currentUserReducer";
import ErrorBoundary from "../../ErrorBoundary";
import { StarIcon as StarSolid } from "@heroicons/react/solid";
import { StarIcon as StarOutline } from "@heroicons/react/outline";
import Tooltip from "../../Tooltip";

/**
 * TimesheetPinInput handles the pinning and unpinning of timesheet rows. It displays a filled or outlined star button to inidicate a pinned or unpinned row. Clicking the button will invert the current preference.
 */
const TimesheetPinInput = ({
    pinned = false,
    // EmployeeID = 0,
    disableModification = false,
    isTablet = false,
    // pinnedRows,
    row,
    type,
}) => {
    const [iconHover, setIconHover] = useState(false);
    const [rowIsValidPin, setRowIsValidPin] = useState(false);

    const EmployeeID = useSelector(
        (state) => state.currentUser.user.EmployeeID ?? 0
    );
    const pinnedRows = useSelector(
        (state) => state.currentUser.preferences.PinnedRows.Value
    );

    const dispatch = useDispatch();

    const addRow = () => {
        dispatch(
            createEmployeePinnedRowAction({
                EmployeeID,
                DepartmentID: row.original.DepartmentID,
                ProjectID: row.original.ProjectID,
                WorkCodeID: row.original.WorkCodeID,
            })
        );
    };

    const removeRow = () => {
        const rowToRemove = pinnedRows.find((pinnedRow) => {
            if (pinnedRow.ProjectID !== row.original.ProjectID) return false;
            if (pinnedRow.DepartmentID !== row.original.DepartmentID)
                return false;
            if (pinnedRow.WorkCodeID !== row.original.WorkCodeID) return false;
            return true;
        });
        dispatch(
            deleteEmployeePinnedRowAction({
                EmployeeID,
                EmployeePinnedRowID: rowToRemove.EmployeePinnedRowID,
            })
        );
    };

    useEffect(() => {
        const hasDepartmentID = row.original.DepartmentID !== -1;
        const hasProjectID = row.original.ProjectID !== -1;
        const hasWorkCodeID = row.original.WorkCodeID !== -1;

        if (hasDepartmentID && hasProjectID && hasWorkCodeID)
            setRowIsValidPin(true);
        else setRowIsValidPin(false);
    }, [row.original]);

    return (
        <>
            <ErrorBoundary>
                {pinned && type === "user" ? (
                    <Tooltip content={"Remove from favourites"}>
                        <button
                            type="button"
                            onMouseEnter={() => setIconHover(true)}
                            disabled={disableModification || type !== "user"}
                            onClick={removeRow}
                            className={`m-0 p-1 h-10 w-10  ${
                                disableModification || type !== "user"
                                    ? "bg-slate-800"
                                    : "bg-slate-900"
                            }`}
                            aria-label="Remove from favourites"
                        >
                            <StarSolid className="text-sky-300 h-6 w-6 m-auto" />
                        </button>
                    </Tooltip>
                ) : (
                    <Tooltip content={"Add row to favourites"}>
                        <button
                            type="button"
                            onMouseEnter={() => setIconHover(true)}
                            onMouseLeave={() => setIconHover(false)}
                            disabled={
                                disableModification ||
                                type !== "user" ||
                                !rowIsValidPin
                            }
                            onClick={addRow}
                            className={`m-0 p-1 h-10 w-10  ${
                                disableModification ||
                                type !== "user" ||
                                !rowIsValidPin
                                    ? "bg-slate-800"
                                    : "bg-slate-900"
                            }`}
                            aria-label="Add row to favourites"
                        >
                            <StarOutline className="text-sky-300 h-5 w-5 m-auto" />
                        </button>
                    </Tooltip>
                )}
            </ErrorBoundary>
        </>
    );
};

TimesheetPinInput.propTypes = {
    /** Dispatcher for creating a new pinned row. */
    // createEmployeePinnedRowDispatch: PropTypes.func.isRequired,
    /** Dispatcher for removing a row from pinned list. */
    // deleteEmployeePinnedRowDispatch: PropTypes.func.isRequired,
    /** Bool indicating whether the current row is pinned */
    pinned: PropTypes.bool,
    /** Bool indicating whether modification of the current timesheet is allowed */
    disableModification: PropTypes.bool.isRequired,
    /** Bool indicating whether the user is in tablet mode or not */
    isTablet: PropTypes.bool,
    /** Array of the currently pinned rows of the timesheet */
    // pinnedRows: PropTypes.array,
    /** Object with details of the row. */
    row: PropTypes.object,
    /** Indicates the type of user interacting with the timesheet. */
    type: PropTypes.string,
    /** The Employee ID of the timesheet which is being edited. */
    // EmployeeID: PropTypes.number.isRequired,
};

export default TimesheetPinInput;
