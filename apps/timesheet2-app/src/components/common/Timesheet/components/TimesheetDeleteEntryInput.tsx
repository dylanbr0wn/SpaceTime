import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { TrashIcon, XIcon, BackspaceIcon } from "@heroicons/react/outline";

import {
    GetTimeEntryRowDocument,
    GetTimeEntryRowsDocument,
    useDeleteTimeEntryRowMutation,
} from "../../../../api";
import { deleteTimeEntryRowDispatch } from "../../../../redux/actions/timesheetsActions";
import { createRowHasHoursSelector } from "../../../../services/selectors";
import ConfirmCloseModal from "../../ConfirmCloseModal";
import ErrorBoundary from "../../ErrorBoundary";
import { useRowHasHours } from "../hooks";

/**
 * @name DeleteEntryInput
 * @component
 * @category Time Entry
 * @description Delete button for rows. Provides an icon which can be clicked to delete a row.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetDeleteEntryInput = ({ row, userId }) => {
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] =
        React.useState(false);

    const { hasHours } = useRowHasHours(row.original);

    React.useEffect(() => {
        setShowDeleteConfirmModal(false);
        return () => {
            setShowDeleteConfirmModal(false);
        };
    }, [row]);

    const [deleteTimeEntryRowMutation] = useDeleteTimeEntryRowMutation();

    // Will delete a row. Dispatches deleteTimeEntryRow api call and redux action.
    // Delete button sub component

    const deleteRow = async () => {
        deleteTimeEntryRowMutation({
            variables: {
                timeEntryRow: {
                    id: row.original.id,
                },
            },
            optimisticResponse: {
                deleteTimeEntryRow: {
                    __typename: "TimeEntryRow",
                    id: row.original.id,
                },
            },
            // refetchQueries: [GetTimeEntryRowsDocument],
            update: (cache) => {
                cache.modify({
                    id: cache.identify({
                        __typename: "TimeEntryRow",
                        id: row.original.id,
                    }),
                    fields: {
                        timeEntries(_existingTimeEntries, { DELETE }) {
                            return DELETE;
                        },
                    },
                });
                cache.evict({
                    id: cache.identify({
                        __typename: "TimeEntryRow",
                        id: row.original.id,
                    }),
                });
                cache.gc();
            },
        });

        setShowDeleteConfirmModal(false);

        // const result = await dispatch(
        //     deleteTimeEntryRowDispatch(
        //         row.index,
        //         row.original,
        //         EmployeeID,
        //         timeEntryPeriodStartDate
        //     )
        // );
        // if (!result.success) {
        //     if (result.status === 423) {
        //         setIsLocked(true);
        //         setShowDeleteConfirmModal(false);
        //     } else {
        //         toast.warn(result.data);
        //     }
        // }
    };

    const handleDeleteRow = () => {
        if (!hasHours) {
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
                        title="Delete row"
                        aria-label="Delete row"
                        className={`m-0 p-1 h-10 w-10 group ${
                            false ? "bg-slate-800" : "bg-slate-900"
                        }`}
                        type="button"
                        // title="Clear timesheet row"
                        disabled={false}
                        onClick={handleDeleteRow}
                    >
                        <BackspaceIcon className="text-slate-500 h-6 w-6 m-auto group-hover:text-pink-600  transition-colors duration-200" />
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
