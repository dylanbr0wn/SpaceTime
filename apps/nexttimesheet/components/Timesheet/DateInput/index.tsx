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
    userId,
    periodLength,
    timesheetQueryDate,
    setTimesheetQueryDate,
}: {
    startDate: DateTime | undefined;
    userId: string | undefined;
    periodLength: number | undefined;
    timesheetQueryDate: string;
    setTimesheetQueryDate: (date: string) => void;
}) => {
    // Gets the last 20 years.
    // const getYears = React.useCallback(() => {
    //     const years: number[] = [];
    //     if (startDate) {
    //         for (let i = 0; i < 20; i++) {
    //             years.push(startDate.plus({ years: i }).year);
    //         }
    //     }

    //     return years;
    // }, [startDate]);

    const onChange = (date: Date) => {
        if (!userId) return;
        setTimesheetQueryDate(
            DateTime.fromJSDate(date)
                .startOf("day")
                .toUTC()
                .startOf("day")
                .toISO()
        );
        // getorCreateTimesheetMutation({
        //     variables: {
        //         timesheet: {
        //             userId: userId,
        //             date: DateTime.fromJSDate(date)
        //                 .startOf("day")
        //                 .toUTC()
        //                 .startOf("day")
        //                 .toISO(),
        //         },
        //     },
        // });
    };

    const nextPeriod = () => {
        if (!userId) return;
        if (!startDate) return;
        setTimesheetQueryDate(
            startDate
                .plus({ days: periodLength })
                .startOf("day")
                .toUTC()
                .startOf("day")
                .toISO()
        );
        // getorCreateTimesheetMutation({
        //     variables: {
        //         timesheet: {
        //             userId: userId,
        //             date: startDate
        //                 .plus({ days: periodLength })
        //                 .startOf("day")
        //                 .toUTC()
        //                 .startOf("day")
        //                 .toISO(),
        //         },
        //     },
        // });
    };

    const lastPeriod = () => {
        if (!userId) return;
        if (!startDate) return;
        setTimesheetQueryDate(
            startDate
                .minus({ days: periodLength })
                .startOf("day")
                .toUTC()
                .startOf("day")
                .toISO()
        );
        // getorCreateTimesheetMutation({
        //     variables: {
        //         timesheet: {
        //             userId: userId,
        //             date: startDate
        //                 .minus({ days: periodLength })
        //                 .startOf("day")
        //                 .toUTC()
        //                 .startOf("day")
        //                 .toISO(),
        //         },
        //     },
        // });
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
            <span>
                <div className="flex justify-center">
                    <button
                        onClick={lastPeriod}
                        className="mr-2 btn btn-square bg-base-300 border-base-300"
                        title="Go to last period"
                    >
                        <ChevronLeftIcon className="w-6 h-6 m-auto " />
                    </button>
                    <div className="z-50">
                        <DatePicker
                            onChange={onChange}
                            selected={startDate?.toJSDate()}
                            filterDate={filterDate}
                        />
                    </div>
                    <button
                        onClick={nextPeriod}
                        className="ml-2 btn btn-square bg-base-300 border-base-300"
                        title="Go to next period"
                    >
                        <ChevronRightIcon className="w-6 h-6 m-auto" />
                    </button>
                </div>
            </span>
        </ErrorBoundary>
    );
};

export default TimesheetDateInput;
