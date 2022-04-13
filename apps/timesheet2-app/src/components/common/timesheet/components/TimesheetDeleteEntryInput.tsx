import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { TrashIcon } from "@heroicons/react/solid";

import { deleteTimeEntryRowDispatch } from "../../../../redux/actions/timesheetsActions";
import { createRowHasHoursSelector } from "../../../../services/selectors";
import ConfirmCloseModal from "../../ConfirmCloseModal";
import ErrorBoundary from "../../ErrorBoundary";

/**
 * @name DeleteEntryInput
 * @component
 * @category Time Entry
 * @description Delete button for rows. Provides an icon which can be clicked to delete a row.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetDeleteEntryInput = ({
    row,
    disableModification,
    EmployeeID,
    setIsLocked,
    timeEntryPeriodStartDate,
    isTablet,
}) => {
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] =
        React.useState(false);

    const rowHasHoursSelector = React.useMemo(createRowHasHoursSelector, []);

    const rowHasHours = useSelector((_) => rowHasHoursSelector(row));

    const dispatch = useDispatch();

    React.useEffect(() => {
        setShowDeleteConfirmModal(false);
        return () => {
            setShowDeleteConfirmModal(false);
        };
    }, [row]);

    // Will delete a row. Dispatches deleteTimeEntryRow api call and redux action.
    // Delete button sub component

    const deleteRow = async () => {
        const result = await dispatch(
            deleteTimeEntryRowDispatch(
                row.index,
                row.original,
                EmployeeID,
                timeEntryPeriodStartDate
            )
        );
        if (!result.success) {
            if (result.status === 423) {
                setIsLocked(true);
                setShowDeleteConfirmModal(false);
            } else {
                toast.warn(result.data);
            }
        }
    };

    const handleDeleteRow = () => {
        console.log(rowHasHours);
        if (!rowHasHours) {
            deleteRow();
        } else {
            setShowDeleteConfirmModal(true);
        }
    };

    const renderLoader = () => <p></p>;

    return (
        <>
            <ErrorBoundary>
                <span>
                    <button
                        aria-label="Delete row"
                        className={`m-0 p-1 h-10 w-10 group ${
                            disableModification
                                ? "bg-slate-800"
                                : "bg-slate-900"
                        }`}
                        type="button"
                        // title="Clear timesheet row"
                        disabled={disableModification}
                        onClick={handleDeleteRow}
                    >
                        <TrashIcon className="text-slate-500 h-6 w-6 m-auto group-hover:text-red-700  transition-colors duration-200" />
                    </button>
                    <React.Suspense fallback={renderLoader()}>
                        <ConfirmCloseModal
                            onHide={() => {
                                setShowDeleteConfirmModal(false);
                            }}
                            onConfirm={deleteRow}
                            modalShow={showDeleteConfirmModal}
                            body="Are you sure you want to delete this row?"
                            title={`Delete Timesheet Row (${row.index + 1})`}
                            confirmButtonText="Delete"
                        />
                    </React.Suspense>
                </span>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetDeleteEntryInput;
