import * as React from "react";

import { BackspaceIcon } from "@heroicons/react/outline";

import { IsChanged, useDeleteTimeEntryRowMutation } from "../../../lib/apollo";
import ConfirmCloseModal from "../../common/ConfirmCloseModal";
import ErrorBoundary from "../../common/ErrorBoundary";

import { useRowHasHours } from "./hooks";

/**
 * @name DeleteEntryInput
 * @component
 * @category Time Entry
 * @description Delete button for rows. Provides an icon which can be clicked to delete a row.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetDeleteEntryInput = ({
    rowId,
}: {
    rowId: string | undefined;
}) => {
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] =
        React.useState(false);

    const { hasHours } = useRowHasHours(rowId);

    // React.useEffect(() => {
    //     setShowDeleteConfirmModal(false);
    //     return () => {
    //         setShowDeleteConfirmModal(false);
    //     };
    // }, [rowId]);

    const [deleteTimeEntryRowMutation] = useDeleteTimeEntryRowMutation();

    // Will delete a row. Dispatches deleteTimeEntryRow api call and redux action.
    // Delete button sub component

    const deleteRow = async () => {
        deleteTimeEntryRowMutation({
            variables: {
                timeEntryRow: {
                    id: rowId ?? "-1",
                },
            },
            optimisticResponse: {
                deleteTimeEntryRow: {
                    __typename: "TimeEntryRow",
                    id: rowId ?? "-1",
                },
            },
            // refetchQueries: [GetTimeEntryRowsDocument],
            update: (cache) => {
                cache.modify({
                    id: cache.identify({
                        __typename: "TimeEntryRow",
                        id: rowId,
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
                        id: rowId,
                    }),
                });
                cache.gc();
            },
        });
        IsChanged(true);

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
                        className="btn btn-square btn-ghost btn-sm mt-1 group"
                        type="button"
                        // title="Clear timesheet row"
                        disabled={false}
                        onClick={handleDeleteRow}
                    >
                        <BackspaceIcon className="text-base-content h-6 w-6 m-auto group-hover:text-error transition-colors duration-200" />
                    </button>
                    <React.Suspense fallback={renderLoader()}>
                        <ConfirmCloseModal
                            onHide={() => {
                                setShowDeleteConfirmModal(false);
                            }}
                            onConfirm={deleteRow}
                            modalShow={showDeleteConfirmModal}
                            body="Are you sure you want to delete this row?"
                            title={`Delete Timesheet Row?`}
                            confirmButtonText="Delete"
                        />
                    </React.Suspense>
                </span>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetDeleteEntryInput;
