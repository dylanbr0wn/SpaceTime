import moment from "moment";
import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";

import Tippy from "@tippyjs/react";

import ErrorBoundary from "../../ErrorBoundary";

/**
 * @name TimesheetDateInput
 * @component
 * @category Time Entry
 * @description Picks timesheet start date. Provides a react-dates input aswell as arrows.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetDateInput = ({
    updateEntryStartDate,
    startDate,
    onDateChange,
    isTablet,
}) => {
    const [focusedDatePicker, setFocusedDatePicker] = useState(false);

    // Gets the last 20 years.
    const getYears = () => {
        const years = [];
        for (let i = 0; i < 20; i++) {
            years.push(moment().subtract(i, "y"));
        }
        return years;
    };
    const years = useMemo(() => getYears(), []);

    // custom month element for React Dates. Shows the month and year selector.
    const renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ marginRight: 5 }}>
                    <select
                        className="custom-select custom-select-sm"
                        value={month.month()}
                        onChange={(e) => onMonthSelect(month, e.target.value)}
                    >
                        {moment.months().map((label, value) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <select
                        className="custom-select custom-select-sm"
                        value={month.year()}
                        onChange={(e) => onYearSelect(month, e.target.value)}
                    >
                        {years.map((year, i) => (
                            <option key={i} value={year.year()}>
                                {year.format("YYYY")}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    };
    renderMonthElement.propTypes = {
        onMonthSelect: PropTypes.func.isRequired,
        onYearSelect: PropTypes.func.isRequired,
        month: PropTypes.object.isRequired,
    };

    return (
        <>
            <ErrorBoundary>
                <span>
                    <span>
                        <Tippy content="Go to last period">
                            <button
                                onClick={() => updateEntryStartDate("subtract")}
                                style={{ marginRight: isTablet ? 3 : 10 }}
                                title="Go to last period"
                            >
                                <i
                                    style={{
                                        color: "#233746",
                                        fontSize: isTablet
                                            ? "0.875rem"
                                            : "1rem",
                                    }}
                                    className="fas fa-chevron-left"
                                />
                            </button>
                        </Tippy>
                    </span>
                    <Tippy content="select a date">
                        <span>
                            {/* <SingleDatePicker
                                date={startDate}
                                onDateChange={onDateChange}
                                focused={focusedDatePicker} // PropTypes.bool
                                onFocusChange={({ focused }) =>
                                    setFocusedDatePicker(focused)
                                }
                                small={!!isTablet}
                                showDefaultInputIcon
                                daySize={45}
                                hideKeyboardShortcutsPanel
                                numberOfMonths={1}
                                renderMonthElement={renderMonthElement}
                                isOutsideRange={() => false}
                                isDayBlocked={(day) => {
                                    return (
                                        moment(startDate)
                                            .add(12, "hours")
                                            .diff(day, "days") %
                                            14 !==
                                        0
                                    );
                                }}
                                id="timeEntryDate" // PropTypes.string.isRequired,
                            /> */}
                        </span>
                    </Tippy>

                    <span>
                        <Tippy content="Go to next period">
                            <button
                                onClick={() => updateEntryStartDate("add")}
                                style={{ marginLeft: isTablet ? 3 : 10 }}
                                title="Go to next period"
                            >
                                <i
                                    style={{
                                        color: "#233746",
                                        fontSize: isTablet
                                            ? "0.875rem"
                                            : "1rem",
                                    }}
                                    className="fas fa-chevron-right"
                                />
                            </button>
                        </Tippy>
                    </span>
                </span>
            </ErrorBoundary>
        </>
    );
};
TimesheetDateInput.propTypes = {
    updateEntryStartDate: PropTypes.func.isRequired,
    startDate: PropTypes.object.isRequired,
    onDateChange: PropTypes.func.isRequired,
    isTablet: PropTypes.bool,
};

export default TimesheetDateInput;
