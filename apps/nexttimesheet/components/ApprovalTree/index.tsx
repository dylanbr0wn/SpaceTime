import { DateTime } from "luxon";

import Avatar from "../common/Avatar";

import TimeSince from "./TimeSince";

const ApprovalTree = ({ user }) => {
    return (
        <div className="max-w-3xl mx-auto w-full mt-32">
            <div className="w-full">
                <div className="flex space-x-2 p-1">
                    <Avatar image={user.avatar} name={user.name} />
                    <div className="font-semibold">
                        {user.name}
                        <span className="ml-3 font-normal text-base-content/30 hover:underline no-underline ">
                            <TimeSince
                                date={DateTime.now()
                                    .minus({ days: 10 })
                                    .toISO()}
                            />
                        </span>
                    </div>
                </div>
                <div className="card w-full bg-base-300 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Card title!</h2>
                        <p>If a dog chews shoes whose shoes does he choose?</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprovalTree;
