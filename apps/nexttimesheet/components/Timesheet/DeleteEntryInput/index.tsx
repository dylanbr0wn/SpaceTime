import * as React from "react";

import { useMutation } from "@apollo/client";
import { BackspaceIcon } from "@heroicons/react/outline";

import { DeleteTimeEntryRowDocument, IsChanged } from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";
import CustModal from "../../common/Modal";

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

    const [deleteTimeEntryRowMutation] = useMutation(
        DeleteTimeEntryRowDocument
    );

    // Will delete a row. Dispatches deleteTimeEntryRow api call and redux action.
    // Delete button sub component

    const deleteRow = async () => {
        deleteTimeEntryRowMutation({
            variables: {
                id: rowId ?? "-1",
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
                        rowOptions(_existingRowOptions, { DELETE }) {
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
                        <CustModal
                            title={`Delete Timesheet Row?`}
                            show={showDeleteConfirmModal}
                            onHide={() => {
                                setShowDeleteConfirmModal(false);
                            }}
                        >
                            <div className="flex flex-col w-full p-3">
                                <div className="mb-2">
                                    There is currently time entered in this row,
                                    are you sure you want to delete it?
                                </div>

                                <div className="flex mt-3 space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirmModal(false);
                                        }}
                                        className="btn btn-error btn-outline"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={deleteRow}
                                        className="btn btn-primary"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </CustModal>
                    </React.Suspense>
                </span>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetDeleteEntryInput;
