import cuid from "cuid";
import { DateTime } from "luxon";
import * as React from "react";

import { useApolloClient, useReactiveVar } from "@apollo/client";

import {
    EventType,
    IsChanged as isChangedVar,
    Status,
    StatusEventsDocument,
    useCreateStatusEventMutation,
    User,
} from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";
import CustModal from "../../common/Modal";

/**
 * @name ApprovalStatus
 * @component
 * @category Time Entry
 * @description Approval Status display above the Timesheet.
 * @param {Object} props Props. See propTypes for details.
 */
const StatusBlock = ({
    status,
    user,
    timesheetId,
}: {
    status: Status;
    user: Partial<User>;
    timesheetId: string;
}) => {
    const [showModal, setShowModal] = React.useState(false);
    const [nextStatus, setNextStatus] = React.useState<Status>(
        Status.Submitted
    );
    // const [hasChanged, setHasChanged] = React.useState(false);

    const isChanged = useReactiveVar(isChangedVar);

    // const { data } = useTimesheetUpdatedQuery({
    //     variables: {
    //         timesheetId,
    //     },
    //     // fetchPolicy: "network-only", // Used for first execution
    //     // nextFetchPolicy: "cache-first", // Used for subsequent executions
    // });

    // React.useEffect(() => {
    //     if (data?.timesheet) {
    //         const { updatedAt: timesheetUpdated } = data.timesheet;
    //         let hasChanged = false;

    //         for (const row of data.timesheet.timeEntryRows) {
    //             if (
    //                 DateTime.fromISO(row.updatedAt) >
    //                 DateTime.fromISO(timesheetUpdated)
    //             ) {
    //                 setHasChanged(true);
    //                 hasChanged = true;
    //                 break;
    //             } else {
    //                 for (const entry of row.timeEntries) {
    //                     if (
    //                         DateTime.fromISO(entry.updatedAt) >
    //                         DateTime.fromISO(timesheetUpdated)
    //                     ) {
    //                         setHasChanged(true);
    //                         hasChanged = true;
    //                         break;
    //                     }
    //                 }
    //             }
    //             if (hasChanged) {
    //                 break;
    //             }
    //         }
    //     }
    // }, [data]);

    //  const { data } = useGetTimeEntriesQuery({
    //     variables: {
    //         rowId: rowId ?? "-1",
    //     },
    //     skip: !rowId,
    // });

    React.useEffect(() => {
        // if (status === Status.Unsubmitted) {
        //     setNextStatus(Status.Submitted);
        // } else if (status === Status.Submitted) {
        //     setNextStatus(Status.Submitted);
        // }
        setNextStatus(Status.Submitted);
    }, [status]);

    const [comment, setComment] = React.useState("");

    const [createStatusEventMutation] = useCreateStatusEventMutation();

    const submit = () => {
        createStatusEventMutation({
            variables: {
                status: nextStatus,
                message: comment,
                userId: String(user.id),
                type: EventType.StatusChange,
                timesheetId,
            },
            optimisticResponse: {
                createStatusEvent: {
                    __typename: "StatusEvent",
                    id: cuid(),
                    createdAt: DateTime.now().toISO(),
                    message: comment,
                    type: EventType.StatusChange,
                    user: {
                        __typename: "User",
                        name: user.name,
                        avatar: user.avatar,
                    },
                    status: nextStatus,
                },
            },
            refetchQueries: ["TimesheetUpdated"],
            update: (cache, { data }) => {
                cache.updateQuery(
                    {
                        query: StatusEventsDocument,
                        variables: {
                            timesheetId,
                        },
                    },
                    (newData) => {
                        return {
                            statusEvents: [
                                ...newData.statusEvents,
                                data?.createStatusEvent,
                            ],
                        };
                    }
                );
                cache.modify({
                    id: cache.identify({
                        __typename: "Timesheet",
                        id: timesheetId ?? "-1",
                    }),
                    fields: {
                        status: () => nextStatus,
                    },
                });
            },
        });
        isChangedVar(false);

        setShowModal(false);
    };

    return (
        <>
            <ErrorBoundary>
                <div className="flex flex-col my-auto">
                    <div className="flex mb-3">
                        <div className="my-auto">Status:</div>
                        <h2
                            className={` mx-3 font-bold text-lg ${
                                status === Status.Submitted
                                    ? "text-warning"
                                    : status === Status.ManagerApproved
                                    ? "text-success"
                                    : status === Status.PaymentApproved
                                    ? "text-secondary"
                                    : status === Status.Rejected
                                    ? "text-error"
                                    : ""
                            }`}
                        >
                            {status}
                        </h2>
                    </div>
                    <div className="flex">
                        <div>{isChanged && "alert"}</div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn"
                        >
                            {status === Status.Unsubmitted
                                ? "Submit"
                                : "Update"}
                        </button>
                    </div>
                </div>
                <CustModal
                    title={`${
                        status === Status.Unsubmitted ? "Submit" : "Update"
                    } timesheet`}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                >
                    <div className="flex flex-col w-full p-3">
                        <div className="mb-2">
                            Update your timesheet submission with your changes.
                        </div>
                        <div className="my-3">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text text-base">
                                        Add a comment:
                                    </span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    placeholder="That's no moon. It's a space station. "
                                    onChange={(e) => setComment(e.target.value)}
                                    value={comment}
                                />
                            </div>
                        </div>
                        <div className="flex mt-3">
                            <button
                                onClick={() => submit()}
                                className="btn btn-primary"
                            >
                                {status === Status.Unsubmitted
                                    ? "Submit"
                                    : "Update"}
                            </button>
                        </div>
                    </div>
                </CustModal>
            </ErrorBoundary>
        </>
    );
};

export default StatusBlock;
