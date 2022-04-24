import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTable, useFlexLayout } from "react-table";

import { getDayFeatures, getPinnedRows } from "../../../services/utils";

import TimesheetAlternativeEntryInput from "./components/TimesheetAlternateEntryInput";
import TimesheetDayCommentInput from "./components/TimesheetDayCommentInput";

/**
 * @name TimesheetTable
 * @component
 * @category Time Entry
 * @description Provides the time entry table interface.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetTable = ({ addNewEntryRow, columns, data, timesheetId }) => {
    const [pinRows, setPinRows] = useState([]);
    const [otherRows, setOtherRows] = useState([]);

    // For this example, we're using pagination to illustrate how to stop
    // the current page from resetting when our data changes
    // Otherwise, nothing is different here.
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
        useTable(
            {
                columns,
                data,
                timesheetId,
                // use the skipPageReset option to disable page resetting temporarily
                // autoResetPage: !skipPageReset,
                // updateMyData isn't part of the API, but
                // anything we put into these options will
                // automatically be available on the instance.
                // That way we can call this function from our
                // cell renderer!
                // setSkipPageReset,
                //setIsLocked,
            },
            useFlexLayout
            // useSortBy
        );

    // useEffect(() => {
    //     if (type === "user") {
    //         const [pin, nonPin] = getPinnedRows(pinnedRows, rows);
    //         setOtherRows(nonPin);
    //         setPinRows(pin);
    //     } else {
    //         setOtherRows(rows);
    //     }
    // }, [rows, pinnedRows, type]);

    // Render the UI for your table
    return (
        <>
            {/* {!loading && */}
            <div
                className="bg-slate-900 my-2 border-cyan-500 border rounded-md table-auto max-w-screen-2xl p-2"
                {...getTableProps()}
            >
                <div>
                    {headerGroups.map((headerGroup, i) => (
                        <div {...headerGroup.getHeaderGroupProps()} key={i}>
                            {headerGroup.headers.map((column, j) => {
                                if (!Number.isInteger(column.id)) {
                                    return (
                                        <div
                                            className="text-slate-400 text-center h-full"
                                            {...column.getHeaderProps()}
                                            key={column.id}
                                        >
                                            {column.render("Header")}
                                        </div>
                                    );
                                } else {
                                    return (
                                        // <Tippy
                                        //     key={column.id}
                                        //     content={getHoverText(j - 4)}
                                        //     // ...and many more!
                                        // >
                                        <div
                                            className="w-full text-center"
                                            {...column.getHeaderProps()}
                                        >
                                            {column.render("Header")}
                                        </div>
                                        //</Tippy>
                                    );
                                }
                            })}
                        </div>
                    ))}
                </div>
                <div
                    className="divide-y divide-purple-500 border-t border-t-purple-500 "
                    {...getTableBodyProps()}
                >
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <div
                                className="divide-x divide-purple-500 border-x-purple-500 border-x "
                                {...row.getRowProps()}
                                key={i}
                            >
                                {row.cells.map((cell, j) => {
                                    if (
                                        cell.column.id === "workType" ||
                                        cell.column.id === "project"
                                    ) {
                                        return (
                                            <div
                                                className=""
                                                {...cell.getCellProps()}
                                                key={j}
                                            >
                                                {cell.render("Cell", { rows })}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                className=""
                                                {...cell.getCellProps()}
                                                key={j}
                                            >
                                                {cell.render("Cell")}
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        );
                    })}
                    {/* {pinRows.length > 0 && (
                        <tr className="h-1 bg-slate-800">
                            <td colSpan={19} />
                        </tr>
                    )}
                    {pinRows.length > 0 && (
                        <tr className="h-1 bg-slate-800">
                            <td colSpan={19} />
                        </tr>
                    )}

                    {otherRows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr className="" {...row.getRowProps()} key={i}>
                                {row.cells.map((cell, j) => {
                                    return (
                                        <td
                                            className="border border-sky-500 p-0 m-0 box-border"
                                            {...cell.getCellProps()}
                                            key={j}
                                            //style={getStyle(j - 4)}
                                        >
                                            {cell.render("Cell", {
                                                columnIndex: j,
                                                disableModification,
                                                loading,
                                            })}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })} */}

                    {/* new entry button row */}
                    {
                        <div>
                            <div className="text-center">
                                <button
                                    className="bg-gradient-to-r mt-2 rounded-md from-blue-500 to-cyan-500 p-0.5 transform active:translate-y-0.5 group"
                                    onClick={addNewEntryRow}
                                >
                                    <div className="flex rounded-md p-2 bg-slate-900 group-hover:bg-slate-800">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 mr-2 text-cyan-300"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        <div className="text-cyan-300 text-sm">
                                            New Row
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    }

                    {/* alternative transport entry row */}
                    {/* {alternateData && (
                        <tr>
                            <td
                                colSpan={4}
                                className="text-right px-1 text-cyan-500"
                            >
                                <Tippy content="Check the days where you used an alternative form of transport to get to work (Bike, Bus)">
                                    <span>Alternative Transport </span>
                                </Tippy>
                            </td>
                            {alternateData.map((work, i) => {
                                return (
                                    <td
                                        key={i}
                                        className="text-center"
                                        style={getStyle(i)}
                                    >
                                        <TimesheetAlternativeEntryInput
                                            setIsLocked={setIsLocked}
                                            loading={loading}
                                            work={work}
                                            disableModification={
                                                disableModification
                                            }
                                            EmployeeID={EmployeeID}
                                            timeEntryPeriodStartDate={
                                                timeEntryPeriodStartDate
                                            }
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    )} */}
                    {/* Day comments entry row */}
                    {/* <tr>
                        <td colSpan={4} className="text-right">
                            Day Comments
                        </td>
                        {dayComments.map((dayComment, i) => (
                            <td
                                key={i}
                                className="text-center"
                                style={getStyle(i)}
                            >
                                <TimesheetDayCommentInput
                                    setIsLocked={setIsLocked}
                                    dayComment={dayComment}
                                    disableModification={disableModification}
                                    EmployeeID={EmployeeID}
                                    timeEntryPeriodStartDate={
                                        timeEntryPeriodStartDate
                                    }
                                />
                            </td>
                        ))}
                    </tr> */}
                    {/* <tr>
                        <td colSpan="18" />
                    </tr> */}
                    {/* Daily hour totals row */}
                    {/* <tr>
                        <td colSpan="4" className="text-right">
                            Daily Totals (hours)
                        </td>
                        {dailyTotals.map((total, i) => {
                            return (
                                <td
                                    key={i}
                                    className="text-center"
                                    style={{
                                        ...getStyle(i),
                                        fontSize: isTablet ? "0.75rem" : "1rem",
                                    }}
                                >
                                    {total}
                                </td>
                            );
                        })}
                    </tr> */}
                </div>
            </div>
        </>
    );
};

export default TimesheetTable;
