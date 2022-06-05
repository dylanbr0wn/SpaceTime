import { DateTime } from "luxon";
import * as React from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

import ErrorBoundary from "../../common/ErrorBoundary";

import DatePicker from "./DatePicker";

/**
 * @name TimesheetDateInput
 * @component
 * @category Time Entry
 * @description Picks timesheet start date. Provides a react-dates input aswell as arrows.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetDateInput = ({
    startDate,
    periodLength,
    timesheetQueryDate,
    setTimesheetQueryDate,
}: {
    startDate: DateTime | undefined;
    periodLength: number | undefined;
    timesheetQueryDate: string;
    setTimesheetQueryDate: (date: string) => void;
}) => {
    const onChange = (date: Date) => {
        setTimesheetQueryDate(
            DateTime.fromJSDate(date)
                .startOf("day")
                .toUTC()
                .startOf("day")
                .toISO()
        );
    };

    const nextPeriod = () => {
        if (!startDate) return;
        setTimesheetQueryDate(
            DateTime.fromISO(timesheetQueryDate, { zone: "utc" })
                .plus({ days: periodLength })
                .startOf("day")
                .toUTC()
                .startOf("day")
                .toISO()
        );
    };

    const lastPeriod = () => {
        if (!startDate) return;
        setTimesheetQueryDate(
            DateTime.fromISO(timesheetQueryDate, { zone: "utc" })
                .minus({ days: periodLength })
                .startOf("day")
                .toUTC()
                .startOf("day")
                .toISO()
        );
    };

    const filterDate = React.useCallback(
        (date: Date) => {
            const dateTime = DateTime.fromJSDate(date, {
                zone: "utc",
            }).startOf("day");

            return !!(
                Math.abs(
                    dateTime.diff(startDate ?? DateTime.now(), "days").days
                ) %
                    (periodLength ?? 14) !==
                0
            );
        },
        [startDate, periodLength]
    );

    return (
        <ErrorBoundary>
            <div className="my-auto flex flex-col">
                <div className="w-full text-center mb-3 font-semibold text-lg">
                    Period
                </div>
                <div className="flex justify-center text-base-content">
                    <button
                        onClick={lastPeriod}
                        className="mr-2 btn btn-square"
                        title="Go to last period"
                    >
                        <ChevronLeftIcon className="w-6 h-6 m-auto " />
                    </button>
                    <div className="">
                        <DatePicker
                            onChange={onChange}
                            selected={startDate?.toJSDate()}
                            filterDate={filterDate}
                        />
                    </div>
                    <button
                        onClick={nextPeriod}
                        className="ml-2 btn btn-square "
                        title="Go to next period"
                    >
                        <ChevronRightIcon className="w-6 h-6 m-auto" />
                    </button>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default TimesheetDateInput;
