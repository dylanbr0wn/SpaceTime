import cuid from "cuid";
import { DateTime } from "luxon";
import * as React from "react";

import { PlusIcon } from "@heroicons/react/outline";
import {
    createTable,
    getCoreRowModelSync,
    useTableInstance,
} from "@tanstack/react-table";

import {
    GetTimeEntryRowsDocument,
    GetTimeEntryRowsQuery,
    GetTimeEntryRowsQueryVariables,
    TimeEntryRow,
    Timesheet,
    useCreateTimeEntryRowMutation,
    useGetTimeEntryRowsQuery,
    User,
} from "../../lib/apollo";
import { getDayFeatures } from "../../lib/utils";

import TimesheetDeleteEntryInput from "./DeleteEntryInput";
import TimesheetDepartmentInput from "./DepartmentInput";
import TimesheetEntryInput from "./EntryInput";
import { useTimesheet } from "./hooks";
import TimesheetProjectInput from "./ProjectInput";
import TimesheetWorkCodeInput from "./WorkCodeInput";

const table = createTable()
    .setRowType<Partial<TimeEntryRow>>()
    .setTableMetaType<{
        timesheetId: string;
    }>();

export type MyTableGenerics = typeof table.generics;

/**
 * @name TimesheetTable
 * @component
 * @category Time Entry
 * @description Provides the time entry table interface.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetTable = ({
    timesheetData,
    timesheetDates,
    user,
}: {
    timesheetDates: DateTime[];
    timesheetData: Partial<Timesheet> | undefined | null;
    user: Partial<User>;
}) => {
    // const [pinRows, setPinRows] = React.useState([]);
    // const [otherRows, setOtherRows] = React.useState([]);

    const {
        data,
        loading: rowsLoading,
        // error,
    } = useGetTimeEntryRowsQuery({
        variables: {
            timesheetId: timesheetData?.id ?? "-1",
        },
        skip: !timesheetData,
    });

    const { memoTimesheet } = useTimesheet(
        data,
        timesheetDates,
        String(user?.id)
    );

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
                        timesheetId: timesheetData?.id ?? "-1",
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
                        timesheetId: timesheetData?.id ?? "-1",
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
            table.createGroup({
                header: () => null,
                id: "workdescription",
                columns: [
                    table.createDataColumn(
                        (row) => row?.department?.id ?? "-1",
                        {
                            header: "Department",
                            id: "department",
                            cell: ({ value, row, column, instance }) => (
                                <TimesheetDepartmentInput
                                    value={value}
                                    row={row.original}
                                    column={column}
                                    userId={String(user?.id)}
                                    timesheetId={
                                        instance.options.meta?.timesheetId ||
                                        "-1"
                                    }
                                />
                            ),
                        }
                    ),
                    table.createDataColumn((row) => row?.project?.id ?? "-1", {
                        header: "Project",
                        id: "project",
                        cell: ({ value, row, column, instance }) => {
                            return (
                                <TimesheetProjectInput
                                    value={value}
                                    row={row.original}
                                    rows={instance.getRowModel().rows}
                                    userId={String(user?.id)}
                                    timesheetId={
                                        instance.options.meta?.timesheetId ||
                                        "-1"
                                    }
                                />
                            );
                        },
                    }),
                    table.createDataColumn((row) => row?.workType?.id, {
                        header: "Work Type",

                        id: "workType",
                        cell: ({ value, row, column, instance }) => (
                            <TimesheetWorkCodeInput
                                value={value}
                                row={row.original}
                                rows={instance.getRowModel().rows}
                                column={column}
                                userId={String(String(user?.id))}
                                timesheetId={
                                    instance.options.meta?.timesheetId || "-1"
                                }
                            />
                        ),
                    }),
                ],
            }),
            table.createGroup({
                header: "Hours",
                id: "hours",
                columns: timesheetDates.map((date, i) => {
                    const dayFeatures = getDayFeatures(date);
                    return table.createDataColumn(
                        (row) => row?.timeEntries?.at(i),
                        {
                            // eslint-disable-next-line react/display-name
                            header: () => {
                                return (
                                    <div
                                        data-tip={dayFeatures.hoverText}
                                        className={`w-full tooltip box-border `}
                                    >
                                        <div className={`${dayFeatures.style}`}>
                                            <div className="text-center">
                                                {date.toFormat("ccc")}
                                            </div>
                                            <div
                                                className="text-center"
                                                style={{ fontWeight: 400 }}
                                            >
                                                {date.toFormat("L/d")}
                                            </div>
                                        </div>
                                    </div>
                                );
                            },
                            id: `timeEntryCol${i}`,
                            cell: ({ value, row, instance }) => (
                                <TimesheetEntryInput
                                    value={value}
                                    timesheetId={
                                        instance.options.meta?.timesheetId ||
                                        "-1"
                                    }
                                    row={row.original}
                                    date={date}
                                    userId={String(user?.id)}
                                />
                            ),
                        }
                    );
                }),
            }),
            table.createDataColumn(() => "deleter", {
                // specifies delete row button column.
                header: () => null, // No header
                id: "deleter",
                // eslint-disable-next-line react/display-name, react/prop-types
                cell: (props) => (
                    <TimesheetDeleteEntryInput
                        {...props}
                        userId={String(user?.id)}
                    />
                ),
            }),
        ],
        [user, timesheetDates]
    );

    // const columns = React.useMemo(
    //     () => [
    //         {
    //             Header: "",
    //             id: "workdescription",
    //             columns: [
    //                 {
    //                     Header: "Department",
    //                     accessor: (row) => row.department.id,
    //                     id: "department",
    //                     minWidth: 75,
    //                     Cell: ({ value, row, column, timesheetId }) => (
    //                         <TimesheetDepartmentInput
    //                             value={value}
    //                             row={row}
    //                             column={column}
    //                             userId={String(user?.id)}
    //                             timesheetId={timesheetId}
    //                         />
    //                     ),
    //                 },
    //                 {
    //                     Header: "Project",
    //                     accessor: (row) => row.project.id,
    //                     id: "project",
    //                     minWidth: 75,
    //                     Cell: ({ value, row, column, timesheetId, rows }) => (
    //                         <TimesheetProjectInput
    //                             value={value}
    //                             row={row}
    //                             rows={rows}
    //                             column={column}
    //                             userId={String(user?.id)}
    //                             timesheetId={timesheetId}
    //                         />
    //                     ),
    //                 },
    //                 {
    //                     Header: "Work Type",
    //                     accessor: (row) => row.workType.id,
    //                     id: "workType",
    //                     minWidth: 75,
    //                     Cell: ({ value, row, column, timesheetId, rows }) => (
    //                         <TimesheetWorkCodeInput
    //                             value={value}
    //                             row={row}
    //                             rows={rows}
    //                             column={column}
    //                             userId={String(String(user?.id))}
    //                             timesheetId={timesheetId}
    //                         />
    //                     ),
    //                 },
    //             ],
    //         },

    //         {
    //             Header: "Hours",
    //             id: "hours",
    //             columns: timesheetDates.map((date, i) => {
    //                 const dayFeatures = getDayFeatures(date);

    //                 return {
    //                     // eslint-disable-next-line react/display-name
    //                     Header: () => {
    //                         return (
    //                             <div
    //                                 className={`w-full box-border ${dayFeatures.style}`}
    //                             >
    //                                 <div className="text-center">
    //                                     {date.toFormat("dd")}
    //                                 </div>
    //                                 <div
    //                                     className="text-center"
    //                                     style={{ fontWeight: 400 }}
    //                                 >
    //                                     {date.toFormat("L/d")}
    //                                 </div>
    //                             </div>
    //                         );
    //                     },
    //                     width: 40,
    //                     accessor: (row) => row.timeEntries[i],
    //                     id: `timeEntryCol${i}`,
    //                     Cell: ({ value, row, timesheetId }) => (
    //                         <TimesheetEntryInput
    //                             value={value}
    //                             timesheetId={timesheetId}
    //                             row={row}
    //                             date={date}
    //                             userId={String(user?.id)}
    //                         />
    //                     ),
    //                 };
    //             }),
    //         },
    //         {
    //             // specifies delete row button column.
    //             Header: () => null, // No header
    //             id: "deleter", // It needs an ID
    //             // eslint-disable-next-line react/display-name, react/prop-types
    //             width: 0,
    //             Cell: (props) => (
    //                 <TimesheetDeleteEntryInput
    //                     {...props}
    //                     userId={String(user?.id)}
    //                 />
    //             ),
    //         },
    //     ],
    //     [timesheetDates, user]
    // );

    // For this example, we're using pagination to illustrate how to stop
    // the current page from resetting when our data changes
    // Otherwise, nothing is different here.
    const instance = useTableInstance(
        table,
        {
            data: memoTimesheet,
            columns,
            getCoreRowModel: getCoreRowModelSync(),
            meta: {
                timesheetId: timesheetData?.id ?? "-1",
            },
            // use the skipPageReset option to disable page resetting temporarily
            // autoResetPage: !skipPageReset,
            // updateMyData isn't part of the API, but
            // anything we put into these options will
            // automatically be available on the instance.
            // That way we can call this function from our
            // cell renderer!
            // setSkipPageReset,
        }
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
                <div className=" my-2 max-w-screen-2xl mx-auto flex flex-col space-y-2">
                    <div className="flex flex-col flex-shrink">
                        {instance.getHeaderGroups().map((headerGroup) => (
                            <div
                                className="flex space-x-1 flex-shrink"
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map((column) => {
                                    if (
                                        column.column.id === "workType" ||
                                        column.column.id === "project" ||
                                        column.column.id === "department"
                                    ) {
                                        return (
                                            <div
                                                className="text-base-content py-2 text-center text-lg w-44"
                                                key={column.id}
                                            >
                                                {column.isPlaceholder ? null : (
                                                    <div>
                                                        {column.renderHeader()}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } else if (column.column.id === "hours") {
                                        return (
                                            <div
                                                className="text-base-content py-2 text-center text-lg w-full"
                                                key={column.id}
                                            >
                                                {column.isPlaceholder ? null : (
                                                    <div>
                                                        {column.renderHeader()}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } else if (column.column.id === "deleter") {
                                        return null;
                                    } else if (
                                        column.column.id === "workdescription"
                                    ) {
                                        return (
                                            <div className="flex">
                                                <div className="w-44" />
                                                <div className="w-44" />
                                                <div className="w-44" />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                className=" text-center py-1 text-lg text-base-content w-14"
                                                key={column.id}
                                            >
                                                {column.isPlaceholder ? null : (
                                                    <div>
                                                        {column.renderHeader()}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        ))}
                    </div>
                    <>
                        {instance.getRowModel().rows.length > 0 ? (
                            <div className=" space-y-2">
                                {instance.getRowModel().rows.map((row) => {
                                    return (
                                        <div
                                            className="rounded-md flex "
                                            key={row.id}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => {
                                                    if (
                                                        cell.columnId ===
                                                            "workType" ||
                                                        cell.columnId ===
                                                            "project"
                                                    ) {
                                                        return (
                                                            <div
                                                                className="w-44 mx-0.5"
                                                                key={cell.id}
                                                            >
                                                                {cell.renderCell()}
                                                            </div>
                                                        );
                                                    } else if (
                                                        cell.columnId ===
                                                        "deleter"
                                                    ) {
                                                        return (
                                                            <div
                                                                className="w-12 ml-0"
                                                                key={cell.id}
                                                            >
                                                                {cell.renderCell()}
                                                            </div>
                                                        );
                                                    } else if (
                                                        cell.columnId ===
                                                        "department"
                                                    ) {
                                                        return (
                                                            <div
                                                                className="w-44 mr-0.5"
                                                                key={cell.id}
                                                            >
                                                                {cell.renderCell()}
                                                            </div>
                                                        );
                                                    } else {
                                                        return (
                                                            <div
                                                                className="w-14 mx-0.5"
                                                                key={cell.id}
                                                            >
                                                                {cell.renderCell()}
                                                            </div>
                                                        );
                                                    }
                                                })}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-primary text-lg w-full text-center py-3">
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
                    </>
                    <div>
                        <div className="text-center mt-4">
                            <button
                                className=" flex btn btn-outline btn-accent p-2 mx-auto group "
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
