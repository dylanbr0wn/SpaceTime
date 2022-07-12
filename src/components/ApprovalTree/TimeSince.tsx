import { DateTime } from "luxon";
import * as React from "react";

const getTimeSince = (date: string) => {
    const now = DateTime.now();
    const then = DateTime.fromISO(date);
    const diff = now.diff(then, "milliseconds");
    const seconds = Math.floor(diff.as("milliseconds") / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) {
        return `Just Now`;
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 30) {
        return `${days} days ago`;
    } else {
        return then.toFormat("ff");
    }
};

const TimeSince = ({ date }: { date: string }) => {
    const [timeText, setTimeText] = React.useState("");

    React.useEffect(() => {
        setTimeText(getTimeSince(date));
    }, [date]);

    return (
        <div
            className="tooltip"
            data-tip={DateTime.fromISO(date).toFormat("ff")}
        >
            {timeText}
        </div>
    );
};

export default TimeSince;
