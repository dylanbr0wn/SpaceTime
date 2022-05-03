import cuid from "cuid";
import { DateTime } from "luxon";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTable, useFlexLayout } from "react-table";

import { getDayFeatures, getPinnedRows } from "../../lib/utils";
import {
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    useCreateTimeEntryRowMutation,
    useGetTimeEntryRowsQuery,
} from "../../lib/apollo";

import TimesheetAlternativeEntryInput from "./AlternateEntryInput";
import TimesheetDayCommentInput from "./components/TimesheetDayCommentInput";
import TimesheetDeleteEntryInput from "./DeleteEntryInput";
import TimesheetDepartmentInput from "./DepartmentInput";
import TimesheetEntryInput from "./EntryInput";
import { useTimesheet } from "./hooks";
import TimesheetProjectInput from "./ProjectInput";
import TimesheetWorkCodeInput from "./WorkCodeInput";
import { PlusIcon } from "@heroicons/react/outline";

/**
 * @name TimesheetTable
 * @component
 * @category Time Entry
 * @description Provides the time entry table interface.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetTable = ({ timesheetData, timesheetDates, user }) => {
    const [pinRows, setPinRows] = useState([]);
    const [otherRows, setOtherRows] = useState([]);

    const {
        data,
        loading: rowsLoading,
        error,
    } = useGetTimeEntryRowsQuery({
        variables: {
            timesheetId: timesheetData?.id ?? "-1",
        },
        skip: !timesheetData,
    });

    const { timesheet } = useTimesheet(data, timesheetDates, String(user?.id));

    const [createTimeEntryRowMutation] = useCreateTimeEntryRowMutation();

    const createTimeEntryRow = () => {
        createTimeEntryRowMutation({
            variables: {
                timesheetId: timesheetData?.id ?? "-1",
            },
            // refetchQueries: [GetTimeEntryRowsDocument],
            optimisticResponse: {
                createTimeEntryRow: {
                    __typename: "TimeEntryRow",
                    id: cuid(),
                    createdAt: DateTime.now().toISO(),
                    updatedAt: DateTime.now().toISO(),
                    timeEntries: [],
                    workType: {
                        __typename: "WorkType",
                        id: "-1",
                    },
                    project: {
                        __typename: "Project",
                        id: "-1",
                    },
                    department: {
                        __typename: "Department",
                        id: "-1",
                    },
                },
            },
            update: (cache, { data }) => {
                const timeEntryRow = data?.createTimeEntryRow;
                if (!timeEntryRow) return;
                const timeEntryRowsData = cache.readQuery<
                    GetTimeEntryRowsQuery,
                    GetTimeEntryRowsQueryVariables
                >({
                    query: GetTimeEntryRowsDocument,
                    variables: {
                        timesheetId: timesheetData.id ?? "-1",
                    },
                });
                const timeEntryRows = timeEntryRowsData?.getTimeEntryRows;
                if (!timeEntryRows) return;
                cache.writeQuery<
                    GetTimeEntryRowsQuery,
                    GetTimeEntryRowsQueryVariables
                >({
                    query: GetTimeEntryRowsDocument,
                    variables: {
                        timesheetId: timesheetData.id ?? "-1",
                    },
                    data: {
                        getTimeEntryRows: [...timeEntryRows, timeEntryRow],
                    },
                });
            },
        });
    };

    const columns = React.useMemo(
        () => [
            {
                Header: "",
                id: "workdescription",
                columns: [
                    {
                        Header: "Department",
                        accessor: (row) => row.department.id,
                        id: "department",
                        minWidth: 75,
                        Cell: ({ value, row, column, timesheetId }) => (
                            <TimesheetDepartmentInput
                                value={value}
                                row={row}
                                column={column}
                                userId={String(user?.id)}
                                timesheetId={timesheetId}
                            />
                        ),
                    },
                    {
                        Header: "Project",
                        accessor: (row) => row.project.id,
                        id: "project",
                        minWidth: 75,
                        Cell: ({ value, row, column, timesheetId, rows }) => (
                            <TimesheetProjectInput
                                value={value}
                                row={row}
                                rows={rows}
                                column={column}
                                userId={String(user?.id)}
                                timesheetId={timesheetId}
                            />
                        ),
                    },
                    {
                        Header: "Work Type",
                        accessor: (row) => row.workType.id,
                        id: "workType",
                        minWidth: 75,
                        Cell: ({ value, row, column, timesheetId, rows }) => (
                            <TimesheetWorkCodeInput
                                value={value}
                                row={row}
                                rows={rows}
                                column={column}
                                userId={String(String(user?.id))}
                                timesheetId={timesheetId}
                            />
                        ),
                    },
                ],
            },

            {
                Header: "Hours",
                id: "hours",
                columns: timesheetDates.map((date, i) => {
                    const dayFeatures = getDayFeatures(date);

                    return {
                        // eslint-disable-next-line react/display-name
                        Header: () => {
                            return (
                                <div
                                    className={`w-full box-border ${dayFeatures.style}`}
                                >
                                    <div className="text-center">
                                        {date.toFormat("dd")}
                                    </div>
                                    <div
                                        className="text-center"
                                        style={{ fontWeight: 400 }}
                                    >
                                        {date.toFormat("L/d")}
                                    </div>
                                </div>
                            );
                        },
                        width: 40,
                        accessor: (row) => row.timeEntries[i],
                        id: `timeEntryCol${i}`,
                        Cell: ({ value, row, timesheetId }) => (
                            <TimesheetEntryInput
                                value={value}
                                timesheetId={timesheetId}
                                row={row}
                                date={date}
                                userId={String(user?.id)}
                            />
                        ),
                    };
                }),
            },
            {
                // specifies delete row button column.
                Header: () => null, // No header
                id: "deleter", // It needs an ID
                // eslint-disable-next-line react/display-name, react/prop-types
                width: 0,
                Cell: (props) => (
                    <TimesheetDeleteEntryInput
                        {...props}
                        userId={String(user?.id)}
                    />
                ),
            },
        ],
        [timesheetDates, user]
    );

    // For this example, we're using pagination to illustrate how to stop
    // the current page from resetting when our data changes
    // Otherwise, nothing is different here.
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
        useTable(
            {
                columns,
                data: timesheet,
                timesheetId: timesheetData?.id ?? "-1",
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
            {!rowsLoading && (
                <div
                    className=" my-2 table-auto max-w-screen-2xl p-2 mx-auto w-full "
                    {...getTableProps()}
                >
                    <div className=" bg-slate-800 rounded-md border mx-1 shadow border-slate-700 ">
                        {headerGroups.map((headerGroup, i) => (
                            <div {...headerGroup.getHeaderGroupProps()} key={i}>
                                {headerGroup.headers.map((column, j) => {
                                    if (
                                        column.id === "workType" ||
                                        column.id === "project" ||
                                        column.id === "department" ||
                                        column.id === "hours"
                                    ) {
                                        return (
                                            <div
                                                className="text-slate-200 py-2 text-center text-lg "
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
                                                className="w-full text-center py-1 text-lg text-slate-200 "
                                                {...column.getHeaderProps()}
                                                key={column.id}
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
                    <div className="  mt-2  " {...getTableBodyProps()}>
                        {rows.length > 0 ? (
                            <div className=" space-y-2">
                                {rows.map((row, i) => {
                                    prepareRow(row);
                                    return (
                                        <div
                                            className="bg-slate-900 rounded-md "
                                            {...row.getRowProps()}
                                            key={i}
                                        >
                                            {row.cells.map((cell, j) => {
                                                if (
                                                    cell.column.id ===
                                                        "workType" ||
                                                    cell.column.id === "project"
                                                ) {
                                                    return (
                                                        <div
                                                            className=""
                                                            {...cell.getCellProps()}
                                                            key={j}
                                                        >
                                                            {cell.render(
                                                                "Cell",
                                                                {
                                                                    rows,
                                                                }
                                                            )}
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div
                                                            className=""
                                                            {...cell.getCellProps()}
                                                            key={j}
                                                        >
                                                            {cell.render(
                                                                "Cell"
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-cyan-500 text-lg w-full text-center py-3">
                                Looks like you have no rows... Click the button
                                below to make one!
                            </div>
                        )}

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
                    <div>
                        <div className="text-center mt-4">
                            <button
                                className="border-2 flex border-teal-500 shadow-transparent shadow-lg hover:shadow-cyan-500/20 text-teal-300 transition-all hover:text-white  hover:bg-teal-500 rounded-md p-2 mx-auto group "
                                onClick={createTimeEntryRow}
                            >
                                <PlusIcon className="h-6 w-6 mr-2" />

                                <div className="text-sm font-bold my-auto">
                                    New Row
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TimesheetTable;
