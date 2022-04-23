import { DateTime } from "luxon";
import * as React from "react";
import DatePicker from "react-datepicker";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import Tippy from "@tippyjs/react";

import {
    GetorCreateTimesheetMutationFn,
    GetTimeEntryRowsDocument,
    useGetorCreateTimesheetMutation,
} from "../../../../api";
import ErrorBoundary from "../../ErrorBoundary";

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
    const [focusedDatePicker, setCurrentStartDate] = React.useState(false);

    // Gets the last 20 years.
    const getYears = React.useCallback(() => {
        const years: number[] = [];
        if (startDate) {
            for (let i = 0; i < 20; i++) {
                years.push(startDate.plus({ years: i }).year);
            }
        }

        return years;
    }, [startDate]);

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

    return (
        <>
            <ErrorBoundary>
                <span>
                    <span>
                        <button
                            onClick={lastPeriod}
                            className="mr-2 sm:mr-4"
                            title="Go to last period"
                        >
                            last period
                        </button>
                    </span>

                    <span>
                        <div className="relative w-40">
                            <DatePicker
                                selected={startDate?.toJSDate()}
                                onChange={onChange}
                                selectsStart
                                filterDate={(date) => {
                                    const dateTime = DateTime.fromJSDate(date, {
                                        zone: "utc",
                                    }).startOf("day");
                                    return !!(
                                        Math.abs(
                                            dateTime.diff(
                                                startDate ?? DateTime.now(),
                                                "days"
                                            ).days
                                        ) %
                                            (periodLength ?? 14) ===
                                        0
                                    );
                                }}
                                className="block w-full text-base md:text-sm bg-white border border-gray-300 rounded shadow-sm form-input "
                                // monthClassName={() =>
                                //     "inline-block w-8 h-8 text-sm p-1"
                                // }
                                dayClassName={(date) => {
                                    const dateTime = DateTime.fromJSDate(date, {
                                        zone: "utc",
                                    }).startOf("day");
                                    if (
                                        Math.abs(
                                            dateTime.diff(
                                                startDate ?? DateTime.now(),
                                                "days"
                                            ).days
                                        ) %
                                            (periodLength ?? 14) ===
                                        0
                                    ) {
                                        return "mb-1 w-8 h-8 inline-block justify-center  text-sm leading-loose transition text-gray-700 rounded cursor-pointer hover:bg-blue-500 hover:text-white";
                                    } else {
                                        return "mb-1 w-8 h-8 inline-block justify-center  text-sm leading-loose transition text-gray-700 rounded  cursor-not-allowed opacity-40";
                                    }
                                }}
                                weekDayClassName={() =>
                                    "inline-block w-8 h-8 text-gray-400 font-medium text-center text-xs"
                                }
                                nextMonthButtonLabel=">"
                                previousMonthButtonLabel="<"
                                popperClassName="z-40 offset:2 w-72 text-sm bg-white shadow px-3 py-2 border-2 border-gray-200 rounded"
                                wrapperClassName="flex  flex-col"
                                calendarClassName="flex  flex-col "
                                popperModifiers={[
                                    {
                                        name: "offset",
                                        options: {
                                            offset: [0, 4],
                                        },
                                    },
                                ]}
                                renderCustomHeader={({
                                    date,
                                    decreaseMonth,
                                    increaseMonth,
                                    prevMonthButtonDisabled,
                                    nextMonthButtonDisabled,
                                }) => (
                                    <div className="flex items-center justify-between px-2 py-2 mb-2">
                                        <span className="text-lg text-gray-700">
                                            {DateTime.now().toFormat(
                                                "LLLL yyyy"
                                            )}
                                        </span>

                                        <div className="space-x-2">
                                            <button
                                                onClick={decreaseMonth}
                                                disabled={
                                                    prevMonthButtonDisabled
                                                }
                                                type="button"
                                                className={`
                                            ${
                                                prevMonthButtonDisabled &&
                                                "cursor-not-allowed opacity-50"
                                            }
                                            inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                                        `}
                                            >
                                                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                                            </button>

                                            <button
                                                onClick={increaseMonth}
                                                disabled={
                                                    nextMonthButtonDisabled
                                                }
                                                type="button"
                                                className={`
                                            ${
                                                nextMonthButtonDisabled &&
                                                "cursor-not-allowed opacity-50"
                                            }
                                            inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                                        `}
                                            >
                                                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </span>

                    <span>
                        <button
                            onClick={nextPeriod}
                            className="ml-2 sm:ml-4"
                            title="Go to next period"
                        >
                            next period
                        </button>
                    </span>
                </span>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetDateInput;
