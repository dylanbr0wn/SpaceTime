import { DateTime } from "luxon";
import * as React from "react";
import DatePicker from "react-datepicker";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

import ErrorBoundary from "../../common/ErrorBoundary";
import { Transition } from "@headlessui/react";

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
    const [calendarShowing, setCalendarShowing] = React.useState(false);

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

    return (
        <>
            <ErrorBoundary>
                <span>
                    <span></span>

                    <div className="flex justify-center">
                        <button
                            onClick={lastPeriod}
                            className="mr-2 sm:mr-4 w-10 h-10 bg-slate-800 text-sky-300 rounded transition-colors border-slate-700 border hover:bg-sky-500 hover:text-white duration-75"
                            title="Go to last period"
                        >
                            <ChevronLeftIcon className="w-6 h-6 m-auto " />
                        </button>
                        <div className="w-40">
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
                                className="block w-full text-base md:text-sm bg-slate-800 text-sky-300 hover:bg-slate-700 rounded form-input border border-slate-700 outline-none h-10 focus:ring-sky-500 focus:border-sky-500"
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
                                        return "m-1 w-8 h-8 inline-block justify-center  text-sm leading-loose transition text-sky-300 rounded cursor-pointer hover:bg-sky-500 hover:text-white";
                                    } else {
                                        return "m-1 w-8 h-8 inline-block justify-center  text-sm leading-loose transition text-slate-300 rounded  cursor-not-allowed opacity-40";
                                    }
                                }}
                                weekDayClassName={() =>
                                    "inline-block w-8 m-1 h-8 text-sky-500 font-medium text-center text-xs"
                                }
                                nextMonthButtonLabel=">"
                                onCalendarOpen={() => setCalendarShowing(true)}
                                onCalendarClose={() =>
                                    setCalendarShowing(false)
                                }
                                previousMonthButtonLabel="<"
                                popperClassName="z-40 offset:2 w-78 text-sm shadow-lg shadow-black/40 border border-slate-700 bg-slate-800 rounded"
                                // popperContainer={({ children }) => {
                                //     return (

                                //     );
                                // }}
                                // calendarContainer={({ children }) => {
                                //     return (
                                //         <Transition
                                //             show={calendarShowing}
                                //             enter="transition-opacity duration-300"
                                //             enterFrom="opacity-0"
                                //             enterTo="opacity-100"
                                //             leave="transition-opacity duration-300"
                                //             leaveFrom="opacity-100"
                                //             leaveTo="opacity-0"
                                //         >
                                //             {children}
                                //         </Transition>
                                //     );
                                // }}
                                calendarClassName="flex px-3 py-2 flex-col rounded"
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
                                        <span className="text-lg text-sky-300">
                                            {DateTime.fromJSDate(date).toFormat(
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
                                            inline-flex p-1 text-sm font-medium bg-slate-800 rounded transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-cyan-500
                                        `}
                                            >
                                                <ChevronLeftIcon className="w-6 h-6 text-sky-300" />
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
                                            inline-flex p-1 text-sm font-medium bg-slate-800  rounded transition-colors  hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-cyan-500
                                        `}
                                            >
                                                <ChevronRightIcon className="w-6 h-6 text-sky-300" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                        <button
                            onClick={nextPeriod}
                            className="ml-2 sm:ml-4 w-10 h-10  bg-slate-800 text-sky-300 rounded transition-colors border-slate-700 border hover:bg-sky-500 hover:text-white duration-75"
                            title="Go to next period"
                        >
                            <ChevronRightIcon className="w-6 h-6 m-auto" />
                        </button>
                    </div>

                    <div></div>
                </span>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetDateInput;
