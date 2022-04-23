import { DateTime } from "luxon";
import * as React from "react";
import DatePicker from "react-datepicker";

import Tippy from "@tippyjs/react";

import { useGetorCreateTimesheetMutation } from "../../../../api";
import ErrorBoundary from "../../ErrorBoundary";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

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
}: {
    startDate: DateTime | undefined;
    userId: string | undefined;
    periodLength: number | undefined;
}) => {
    const [focusedDatePicker, setCurrentStartDate] = React.useState(false);

    const [getorCreateTimesheetMutation] = useGetorCreateTimesheetMutation();

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
        getorCreateTimesheetMutation({
            variables: {
                timesheet: {
                    userId: userId,
                    date: DateTime.fromJSDate(date)
                        .startOf("day")
                        .toUTC()
                        .startOf("day")
                        .toISO(),
                },
            },
        });
    };

    const nextPeriod = () => {
        if (!userId) return;
        if (!startDate) return;
        getorCreateTimesheetMutation({
            variables: {
                timesheet: {
                    userId: userId,
                    date: startDate
                        .plus({ days: periodLength })
                        .startOf("day")
                        .toUTC()
                        .startOf("day")
                        .toISO(),
                },
            },
        });
    };

    const lastPeriod = () => {
        if (!userId) return;
        if (!startDate) return;
        getorCreateTimesheetMutation({
            variables: {
                timesheet: {
                    userId: userId,
                    date: startDate
                        .minus({ days: periodLength })
                        .startOf("day")
                        .toUTC()
                        .startOf("day")
                        .toISO(),
                },
            },
        });
    };

    // const years = React.useMemo(() => getYears(), [getYears]);

    // custom month element for React Dates. Shows the month and year selector.
    // const renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
    //     return (
    //         <div style={{ display: "flex", justifyContent: "center" }}>
    //             <div style={{ marginRight: 5 }}>
    //                 <select
    //                     className="custom-select custom-select-sm"
    //                     value={month.month()}
    //                     onChange={(e) => onMonthSelect(month, e.target.value)}
    //                 >
    //                     {moment.months().map((label, value) => (
    //                         <option key={value} value={value}>
    //                             {label}
    //                         </option>
    //                     ))}
    //                 </select>
    //             </div>
    //             <div>
    //                 <select
    //                     className="custom-select custom-select-sm"
    //                     value={month.year()}
    //                     onChange={(e) => onYearSelect(month, e.target.value)}
    //                 >
    //                     {years.map((year, i) => (
    //                         <option key={i} value={year.year()}>
    //                             {year.format("YYYY")}
    //                         </option>
    //                     ))}
    //                 </select>
    //             </div>
    //         </div>
    //     );
    // };

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
                        {/* <DatePicker
                            selected={startDate?.toJSDate()}
                            onChange={onChange}
                            filterDate={(date) =>
                                DateTime.fromJSDate(date).diff(
                                    DateTime.now(),
                                    "days"
                                ).days %
                                    14 ===
                                0
                            }
                        /> */}
                        <div className="relative w-40">
                            <DatePicker
                                selected={startDate?.toJSDate()}
                                onChange={onChange}
                                selectsStart
                                filterDate={(date) =>
                                    !!(
                                        DateTime.fromJSDate(date).diff(
                                            startDate ?? DateTime.now(),
                                            "days"
                                        ).days %
                                            (periodLength ?? 14) ===
                                        0
                                    )
                                }
                                className="block w-full text-base md:text-sm bg-white border border-gray-300 rounded shadow-sm form-input "
                                monthClassName={() =>
                                    "inline-block mb-1 w-8 h-8 text-sm"
                                }
                                dayClassName={(date) => {
                                    if (
                                        DateTime.fromJSDate(date).diff(
                                            startDate ?? DateTime.now(),
                                            "days"
                                        ).days %
                                            (periodLength ?? 14) ===
                                        0
                                    ) {
                                        return "mb-1 w-8 h-8 inline-block justify-center py-1 text-sm leading-loose transition text-gray-700 rounded ";
                                    } else {
                                        return "mb-1 w-8 h-8 inline-block justify-center py-1 text-sm leading-loose transition text-gray-700 rounded  cursor-not-allowed opacity-40";
                                    }
                                }}
                                weekDayClassName={() =>
                                    "inline-block w-8 h-8 text-gray-400 font-medium text-center text-xs"
                                }
                                nextMonthButtonLabel=">"
                                previousMonthButtonLabel="<"
                                popperClassName="z-40 w-72 text-sm bg-white shadow px-3 py-2 border-2 border-gray-200 rounded"
                                wrapperClassName="flex  flex-col"
                                calendarClassName="flex  flex-col"
                                renderCustomHeader={({
                                    date,
                                    decreaseMonth,
                                    increaseMonth,
                                    prevMonthButtonDisabled,
                                    nextMonthButtonDisabled,
                                }) => (
                                    <div className="flex items-center justify-between px-2 py-2">
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
