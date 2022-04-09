import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import { Table, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import Tippy from "@tippyjs/react";

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
const TimesheetTable = ({
    disableModification,
    addNewEntryRow,
    alternateData,
    columns,
    data,
    workCodes,
    loading,
    dailyTotals,
    dayComments,
    workDays,
    EmployeeID,
    setIsLocked,
    timeEntryPeriodStartDate,
    isTablet,
    pinnedRows,
    type,
}) => {
    const [pinRows, setPinRows] = useState([]);
    const [otherRows, setOtherRows] = useState([]);

    const [dayFeatures, setDayFeatures] = useState({
        style: new Array(14).fill(undefined).map(() => ({})),
        hoverText: new Array(14).fill(undefined).map(() => ""),
    });

    //When the week updates, sets the state of the days for current day, weekends, and holidays
    useEffect(() => {
        setDayFeatures(getDayFeatures(workDays));
    }, [workDays]);

    // Computes column style
    const getStyle = index => {
        if (index < 0 || index > 13) return {};
        return dayFeatures.style[index];
    };

    // // Computes the text when hovering over the date
    const getHoverText = index => {
        if (index < 0 || index > 13) return "";
        return dayFeatures.hoverText[index];
    };
    // For this example, we're using pagination to illustrate how to stop
    // the current page from resetting when our data changes
    // Otherwise, nothing is different here.
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
    } = useTable(
        {
            columns,
            data,
            // use the skipPageReset option to disable page resetting temporarily
            // autoResetPage: !skipPageReset,
            // updateMyData isn't part of the API, but
            // anything we put into these options will
            // automatically be available on the instance.
            // That way we can call this function from our
            // cell renderer!
            // setSkipPageReset,
            setIsLocked,
        }
        // useSortBy
    );

    useEffect(() => {
        if (type === "user") {
            const [pin, nonPin] = getPinnedRows(pinnedRows, rows);
            setOtherRows(nonPin);
            setPinRows(pin);
        } else {
            setOtherRows(rows);
        }
    }, [rows, pinnedRows, type]);

    // Render the UI for your table
    return (
        <>
            {/* {!loading && */}
            <Table
                striped
                bordered
                hover
                responsive
                size="sm"
                className="tableScroll"
                {...getTableProps()}
            >
                <thead>
                    {headerGroups.map((headerGroup, i) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                            {headerGroup.headers.map((column, j) => {
                                if (!Number.isInteger(column.id)) {
                                    return (
                                        <th
                                            style={{
                                                fontSize: isTablet
                                                    ? "0.875rem"
                                                    : "1rem",
                                            }}
                                            {...column.getHeaderProps()}
                                            key={column.id}
                                        >
                                            {column.render("Header")}
                                        </th>
                                    );
                                } else {
                                    return (
                                        <Tippy
                                            key={column.id}
                                            content={getHoverText(j - 4)}
                                            // ...and many more!
                                        >
                                            <th
                                                {...column.getHeaderProps()}
                                                style={{
                                                    ...getStyle(j - 4),
                                                    fontSize: isTablet
                                                        ? "0.875rem"
                                                        : "1rem",
                                                }}
                                            >
                                                {column.render("Header")}
                                            </th>
                                        </Tippy>
                                    );
                                }
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {pinRows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr
                                {...row.getRowProps()}
                                key={i}
                                style={{
                                    borderBottom: "3px solid ",
                                    borderTop: "3px solid ",
                                    borderLeft: "5px solid ",
                                    borderRight: "4px solid ",
                                    // borderColor: "rgba(202, 96, 44, 0.4)"
                                    borderColor: " #233746",
                                }}
                            >
                                {row.cells.map((cell, j) => {
                                    return (
                                        <td
                                            {...cell.getCellProps()}
                                            key={j}
                                            style={getStyle(j - 4)}
                                        >
                                            {cell.render("Cell", {
                                                columnIndex: j,
                                                workCodes,
                                                disableModification,
                                                loading,
                                                pinned: true,
                                            })}{" "}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    {pinRows.length > 0 && (
                        <tr>
                            <td colSpan="19" />
                        </tr>
                    )}

                    {otherRows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} key={i}>
                                {row.cells.map((cell, j) => {
                                    return (
                                        <td
                                            {...cell.getCellProps()}
                                            key={j}
                                            style={getStyle(j - 4)}
                                        >
                                            {cell.render("Cell", {
                                                columnIndex: j,
                                                workCodes,
                                                disableModification,
                                                loading,
                                            })}{" "}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}

                    {/* new entry button row */}
                    {!disableModification && (
                        <tr>
                            <td className="text-center" colSpan="18">
                                <Button
                                    onClick={addNewEntryRow}
                                    size="sm"
                                    variant="success"
                                >
                                    <i
                                        style={{ marginRight: 5 }}
                                        className="fas fa-plus "
                                    ></i>{" "}
                                    New Row
                                </Button>
                            </td>
                        </tr>
                    )}

                    {/* alternative transport entry row */}
                    {alternateData && (
                        <tr>
                            <td colSpan="4" className="text-right">
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
                    )}
                    {/* Day comments entry row */}
                    <tr>
                        <td colSpan="4" className="text-right">
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
                    </tr>
                    <tr>
                        <td colSpan="18" />
                    </tr>
                    {/* Daily hour totals row */}
                    <tr>
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
                    </tr>
                </tbody>
            </Table>
        </>
    );
};
TimesheetTable.propTypes = {
    timeEntryPeriodStartDate: PropTypes.object.isRequired,
    disableModification: PropTypes.bool.isRequired,
    addNewEntryRow: PropTypes.func.isRequired,
    alternateData: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    skipPageReset: PropTypes.bool.isRequired,
    setSkipPageReset: PropTypes.func.isRequired,
    workCodes: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    dailyTotals: PropTypes.array.isRequired,
    dayComments: PropTypes.array.isRequired,
    workDays: PropTypes.array.isRequired,
    setIsLocked: PropTypes.func.isRequired,
    EmployeeID: PropTypes.number.isRequired,
    isTablet: PropTypes.bool,
    pinnedRows: PropTypes.array,
    type: PropTypes.string,
};

export default TimesheetTable;
