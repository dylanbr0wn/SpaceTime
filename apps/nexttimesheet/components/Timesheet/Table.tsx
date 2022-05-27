import cuid from "cuid";
import { DateTime } from "luxon";
import * as React from "react";

import { useMutation, useQuery } from "@apollo/client";
import { PlusIcon } from "@heroicons/react/outline";
import {
    createTable,
    getCoreRowModelSync,
    useTableInstance,
} from "@tanstack/react-table";

import {
    CreateTimeEntryRowDocument,
    TimeEntryRowsDocument,
    TimeEntryRowsQuery,
    TimeEntryRowsQueryVariables,
    UserFromAuthIdQuery,
} from "../../lib/apollo";
import { getDayFeatures } from "../../lib/utils";

import TimesheetDeleteEntryInput from "./DeleteEntryInput";
import TimesheetEntryInput from "./EntryInput";
import TimesheetDepartmentInput from "./FieldInput";
import { useTimesheet } from "./hooks";
import { TimeEntryRow } from "./types";

const table = createTable().setRowType<TimeEntryRow>();

export type MyTableGenerics = typeof table.generics;

/**
 * @name TimesheetTable
 * @component
 * @category Time Entry
 * @description Provides the time entry table interface.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetTable = ({
    timesheetId,
    timesheetDates,
    user,
    timesheetColumns,
}: {
    timesheetDates: DateTime[];
    timesheetId: string | undefined;
    user: UserFromAuthIdQuery["userFromAuthId"];
    timesheetColumns: { id: string; name: string }[];
}) => {
    // const [pinRows, setPinRows] = React.useState([]);
    // const [otherRows, setOtherRows] = React.useState([]);

    const {
        data,
        loading: rowsLoading,
        // error,
    } = useQuery(TimeEntryRowsDocument, {
        variables: {
            timesheetId: timesheetId ?? "-1",
        },
        skip: !timesheetId,
    });

    const { memoTimesheet } = useTimesheet(
        data,
        timesheetDates,
        String(user?.id)
    );

    const [createTimeEntryRowMutation] = useMutation(
        CreateTimeEntryRowDocument
    );

    const createTimeEntryRow = () => {
        createTimeEntryRowMutation({
            variables: {
                timesheetId: timesheetId ?? "-1",
            },
            // refetchQueries: [GetTimeEntryRowsDocument],
            optimisticResponse: {
                createTimeEntryRow: {
                    __typename: "TimeEntryRow",
                    id: cuid(),
                    createdAt: DateTime.now().toISO(),
                    updatedAt: DateTime.now().toISO(),
                    rowOptions: [],
                },
            },
            update: (cache, { data }) => {
                const timeEntryRow = data?.createTimeEntryRow;
                if (!timeEntryRow) return;
                const timeEntryRowsData = cache.readQuery<
                    TimeEntryRowsQuery,
                    TimeEntryRowsQueryVariables
                >({
                    query: TimeEntryRowsDocument,
                    variables: {
                        timesheetId: timesheetId ?? "-1",
                    },
                });
                const timeEntryRows = timeEntryRowsData?.timeEntryRows;
                if (!timeEntryRows) return;
                cache.writeQuery<
                    TimeEntryRowsQuery,
                    TimeEntryRowsQueryVariables
                >({
                    query: TimeEntryRowsDocument,
                    variables: {
                        timesheetId: timesheetId ?? "-1",
                    },
                    data: {
                        timeEntryRows: [...timeEntryRows, timeEntryRow],
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
                columns: timesheetColumns.map(({ id, name }) =>
                    table.createDataColumn(() => id, {
                        header: name,
                        id: name.toLowerCase(),
                        cell: ({ row }) => (
                            <TimesheetDepartmentInput
                                row={row.original}
                                fieldId={id}
                                fieldName={name}
                                userId={String(user?.id)}
                                tenantId={String(user?.tenant?.id)}
                                timesheetId={timesheetId ?? "-1"}
                            />
                        ),
                    })
                ),
            }),
            table.createGroup({
                header: "Hours",
                id: "hours",
                columns: timesheetDates.map((date, i) => {
                    const dayFeatures = getDayFeatures(date);
                    return table.createDataColumn(() => i, {
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
                        cell: ({ value, row, instance, column }) => (
                            <TimesheetEntryInput
                                timesheetId={timesheetId ?? "-1"}
                                index={i}
                                row={row.original}
                                date={date}
                                user={user}
                            />
                        ),
                    });
                }),
            }),
            table.createDataColumn(() => "deleter", {
                // specifies delete row button column.
                header: () => null, // No header
                id: "deleter",
                // eslint-disable-next-line react/display-name, react/prop-types
                cell: ({ row }) => (
                    <TimesheetDeleteEntryInput rowId={row.original?.id} />
                ),
            }),
        ],
        [user, timesheetDates, timesheetId, timesheetColumns]
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
                                className="flex space-x-0.5 flex-shrink"
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map((column) => {
                                    if (
                                        column?.column?.parent?.id === "hours"
                                    ) {
                                        return (
                                            <div
                                                className="text-base-content py-2 text-center text-lg w-14"
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
                                        return (
                                            <span key={column.id}>{null}</span>
                                        );
                                    } else if (
                                        column.column.id === "workdescription"
                                    ) {
                                        return (
                                            <div
                                                key={column.id}
                                                className="flex"
                                            >
                                                <div className="w-44" />
                                                <div className="w-44" />
                                                <div className="w-44" />
                                            </div>
                                        );
                                    } else {
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
                                            className="rounded-md flex space-x-0.5"
                                            key={row.id}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => {
                                                    if (
                                                        cell.columnId ===
                                                        "deleter"
                                                    ) {
                                                        return (
                                                            <div
                                                                className="w-12"
                                                                key={cell.id}
                                                            >
                                                                {cell.renderCell()}
                                                            </div>
                                                        );
                                                    } else if (
                                                        cell?.column?.parent
                                                            ?.id === "hours"
                                                    ) {
                                                        return (
                                                            <div
                                                                className="w-14 "
                                                                key={cell.id}
                                                            >
                                                                {cell.renderCell()}
                                                            </div>
                                                        );
                                                    } else {
                                                        return (
                                                            <div
                                                                className="w-44 "
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
