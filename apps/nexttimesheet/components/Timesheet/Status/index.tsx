import cuid from "cuid";
import { DateTime } from "luxon";
import * as React from "react";

import { useApolloClient, useReactiveVar } from "@apollo/client";
import { ExclamationIcon } from "@heroicons/react/solid";

import {
    EventType,
    IsChanged as isChangedVar,
    Status,
    StatusEventsDocument,
    useCreateStatusEventMutation,
    User,
    useUpdateTimesheetChangedMutation,
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
    timesheetChanged,
}: {
    status: Status;
    user: Partial<User>;
    timesheetId: string;
    timesheetChanged: boolean;
}) => {
    const [showModal, setShowModal] = React.useState(false);
    const [nextStatus, setNextStatus] = React.useState<Status>(
        Status.Submitted
    );
    // const [hasChanged, setHasChanged] = React.useState(false);

    const isChanged = useReactiveVar(isChangedVar);

    const [updateTimesheetChangedMutation] =
        useUpdateTimesheetChangedMutation();

    React.useEffect(() => {
        if (!timesheetChanged && isChanged) {
            updateTimesheetChangedMutation({
                variables: {
                    timesheetId,
                    changed: isChanged,
                },
            });
        }
    }, [
        isChanged,
        timesheetChanged,
        timesheetId,
        updateTimesheetChangedMutation,
    ]);

    const [comment, setComment] = React.useState("");

    const [createStatusEventMutation] = useCreateStatusEventMutation();

    const submit = () => {
        isChangedVar(false);
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
        setComment("");
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
                    <div className="flex relative">
                        {isChanged && (
                            <div className="absolute right-full mr-3 my-3 h-full">
                                <div
                                    className="tooltip"
                                    data-tip="Submit to save your changes"
                                >
                                    <div className="flex text-warning animate-pulse">
                                        <div>Unsaved</div>
                                        <ExclamationIcon className="h-6 w-6 ml-2 " />{" "}
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowModal(true)}
                            className="btn w-full"
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
