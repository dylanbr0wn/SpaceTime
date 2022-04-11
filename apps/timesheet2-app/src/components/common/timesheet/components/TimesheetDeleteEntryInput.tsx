import PropTypes from "prop-types";
import React, {
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import Tippy from "@tippyjs/react";

import { deleteTimeEntryRowDispatch } from "../../../../redux/actions/timesheetsActions";
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
    deleteTimeEntryRowDispatch,
    disableModification,
    EmployeeID,
    setIsLocked,
    timeEntryPeriodStartDate,
    isTablet,
}) => {
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

    useEffect(() => {
        setShowDeleteConfirmModal(false);
        return () => {
            setShowDeleteConfirmModal(false);
        };
    }, [row]);

    // Will delete a row. Dispatches deleteTimeEntryRow api call and redux action.
    const deleteRow = useCallback(async () => {
        const result = await deleteTimeEntryRowDispatch(
            row.index,
            row.original,
            EmployeeID,
            timeEntryPeriodStartDate
        );
        if (!result.success) {
            if (result.status === 423) {
                setIsLocked(true);
                setShowDeleteConfirmModal(false);
            } else {
                toast.warn(result.data);
            }
        }
    }, [
        deleteTimeEntryRowDispatch,
        row.index,
        row.original,
        EmployeeID,
        timeEntryPeriodStartDate,
        setIsLocked,
    ]);

    // Delete button sub component
    const DeleteButton = useMemo(() => {
        const handleDeleteRow = () => {
            if (
                !Object.values(row.values)
                    .filter((value, i) => i <= 13)
                    .find((value) => value.TimeEntryID)
            ) {
                deleteRow();
            } else {
                setShowDeleteConfirmModal(true);
            }
        };
        return (
            <Tippy content="Delete row">
                <button
                    aria-label="Delete row"
                    style={{ padding: isTablet ? "0.2rem" : "0.2rem 0.375rem" }}
                    // title="Clear timesheet row"
                    disabled={disableModification}
                    onClick={handleDeleteRow}
                >
                    <i
                        style={{
                            color: !disableModification ? "red" : "gray",
                            fontSize: isTablet ? "0.875rem" : "1rem",
                        }}
                        className="far fa-trash-alt"
                    />
                </button>
            </Tippy>
        );
    }, [disableModification, row.values, deleteRow, isTablet]);

    const renderLoader = () => <p></p>;

    return (
        <>
            <ErrorBoundary>
                <span>
                    {DeleteButton}
                    <Suspense fallback={renderLoader()}>
                        <ConfirmCloseModal
                            style={{ zIndex: 1010 }}
                            onHide={() => {
                                setShowDeleteConfirmModal(false);
                            }}
                            onConfirm={deleteRow}
                            modalShow={showDeleteConfirmModal}
                            body="Are you sure you want to delete this row?"
                            title={`Delete Timesheet Row (${row.index + 1})`}
                            confirmButtonText="Delete"
                        />
                    </Suspense>
                </span>
            </ErrorBoundary>
        </>
    );
};

TimesheetDeleteEntryInput.propTypes = {
    row: PropTypes.object.isRequired,
    deleteTimeEntryRowDispatch: PropTypes.func.isRequired,
    disableModification: PropTypes.bool.isRequired,
    data: PropTypes.array,
    setIsLocked: PropTypes.func.isRequired,
    EmployeeID: PropTypes.number.isRequired,
    timeEntryPeriodStartDate: PropTypes.object.isRequired,
    isTablet: PropTypes.bool,
};

const mapDispatchToProps = {
    deleteTimeEntryRowDispatch,
};

export default connect(null, mapDispatchToProps)(TimesheetDeleteEntryInput);
