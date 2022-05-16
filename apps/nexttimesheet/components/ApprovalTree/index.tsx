import { DateTime } from "luxon";
import * as React from "react";

import {
    EventType,
    Status,
    StatusEvent,
    useStatusEventsQuery,
} from "../../lib/apollo";
import Avatar from "../common/Avatar";

import StatusTitle from "./StatusTitle";
import TimeSince from "./TimeSince";

const ApprovalTree = ({ user, timesheetId }) => {
    const { data, loading, error } = useStatusEventsQuery({
        variables: {
            timesheetId,
        },
        skip: timesheetId === "-1",
    });

    return (
        <div className="max-w-3xl mx-auto w-full mt-24 flex flex-col mb-10">
            {data?.statusEvents?.map((event, i) => {
                return (
                    <div key={event.id} className="w-full">
                        <div className="flex space-x-2 p-1">
                            <Avatar
                                image={event.user.avatar}
                                name={event.user.name}
                            />
                            <div className="font-semibold">
                                {user.name}
                                <span className="ml-3 font-normal text-base-content/30 hover:underline no-underline ">
                                    <TimeSince
                                        date={DateTime.fromISO(
                                            event.createdAt
                                        ).toISO()}
                                    />
                                </span>
                            </div>
                        </div>
                        <div className="card w-full bg-base-300 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">
                                    <StatusTitle
                                        name={event.user.name}
                                        status={event.status}
                                        type={event.type}
                                    />
                                </h2>
                                <p>{event.message}</p>
                            </div>
                        </div>
                        {i + 1 !== data?.statusEvents.length && (
                            <>
                                <div className="mt-3 mb-0.5 ml-4 w-1 h-1 bg-base-content rounded-full" />
                                <div className="my-0.5 ml-4 w-1 h-1 bg-base-content rounded-full" />
                                <div className="mb-3 mt-0.5 ml-4 w-1 h-1 bg-base-content rounded-full" />
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ApprovalTree;