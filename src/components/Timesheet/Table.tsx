
import { DateTime } from "luxon";
import * as React from "react";

import { PlusIcon } from "@heroicons/react/outline";
import {
    ColumnDef,
    flexRender, getCoreRowModel, useReactTable,
} from "@tanstack/react-table";
import { getDayFeatures } from "../../../lib/utils";
import ErrorBoundary from "../common/ErrorBoundary";

import TimesheetDeleteEntryInput from "./DeleteEntryInput";
import TimesheetEntryInput from "./EntryInput";
import TimesheetDepartmentInput from "./FieldInput";
import { useRows } from "./hooks";
import { TimeEntryRow } from "../../utils/types/zod";
import { trpc } from "../../utils/trpc";
import cuid from "cuid";
// import { TimeEntryRow } from "./types";

interface ITimesheetTableProps {
    timesheetDates: DateTime[];
    timesheetId: string | undefined;
    timesheetColumns: { id: string; name: string }[];
    userId: string;
    tenantId: string;
}


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
    timesheetColumns,
    userId,
    tenantId,
}: ITimesheetTableProps) => {
    // const [pinRows, setPinRows] = React.useState([]);
    // const [otherRows, setOtherRows] = React.useState([]);

    const { rows } = useRows(timesheetId, timesheetDates);

    const utils = trpc.useContext()

    const mutation = trpc.useMutation(
        ["timeEntryRow.create"], {
        onMutate: async newRow => {

            const newFakeRow = { ...newRow, id: cuid(), createdAt: new Date(), updatedAt: new Date(), entryRowOptions: [] }

            await utils.cancelQuery(['timeEntryRow.readAll', {
                timesheetId: timesheetId ?? "-1",
            }])
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            // await utils.cancelQueries(['todos', newTodo.id])

            // Snapshot the previous value
            const previousTodo = utils.getQueryData(['timeEntryRow.readAll', {
                timesheetId: timesheetId ?? "-1",
            }])

            // Optimistically update to the new value
            utils.setQueryData(['timeEntryRow.readAll', {
                timesheetId: timesheetId ?? "-1",
            }], [...previousTodo!, newFakeRow])

            // Return a context with the previous and new todo
            return { previousTodo, newFakeRow }
        },
        // If the mutation fails, use the context we returned above
        onError: (err, newEntry, context) => {

            if (!context?.previousTodo) utils.refetchQueries(['timeEntryRow.readAll'])
            else {
                utils.setQueryData(
                    ['timeEntryRow.readAll', {
                        timesheetId: timesheetId ?? "-1",
                    }],
                    context.previousTodo
                )
            }


        },
        // Always refetch after error or success:
        onSettled: newTodo => {
            utils.invalidateQueries(['timeEntry.read'])
        },
    }
    );

    const createTimeEntryRow = () => {
        mutation.mutate({
            timesheetId: timesheetId ?? "-1",
        });
    }

    const columns = React.useMemo<ColumnDef<TimeEntryRow & {
        entryRowOptions: {
            id: string;
        }[]
    }>[]>(
        () => [{
            header: () => null,
            id: "workdescription",
            columns: timesheetColumns.map(({ id, name }) =>
            ({
                header: name,
                id: name.toLowerCase(),
                cell: ({ row }) => (
                    <TimesheetDepartmentInput
                        row={row.original}
                        fieldId={id}
                        fieldName={name}
                        userId={String(userId)}
                        tenantId={tenantId}
                        timesheetId={timesheetId ?? "-1"}
                        maxOptions={timesheetColumns.length}
                    />
                ),
            })
            ),
        }, {
            header: "Hours",
            id: "hours",
            columns: timesheetDates.map((date, i) => {
                const dayFeatures = getDayFeatures(date);
                return {
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
                    cell: ({ row, column }) => (
                        <TimesheetEntryInput
                            timesheetId={timesheetId ?? "-1"}
                            index={i}
                            row={row.original}
                            date={date}
                            userId={userId}
                        />
                    ),
                };
            }),
        },
        {
            // specifies delete row button column.
            header: () => null, // No header
            id: "deleter",
            // eslint-disable-next-line react/display-name, react/prop-types
            cell: ({ row }) => (
                <TimesheetDeleteEntryInput rowId={row.original?.id} />
            ),
        },
        ],
        [timesheetColumns, timesheetDates, userId, tenantId, timesheetId]
    );

    // For this example, we're using pagination to illustrate how to stop
    // the current page from resetting when our data changes
    // Otherwise, nothing is different here.
    const table = useReactTable(
        {
            data: rows!,
            columns,
            getCoreRowModel: getCoreRowModel(),

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

    // Render the UI for your table
    return (
        <>
            <ErrorBoundary>
                <div className=" my-2 w-full mx-auto flex flex-col space-y-2">
                    <div className="flex flex-col flex-shrink">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <div
                                className="flex space-x-0.5 "
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map((header) => {
                                    if (
                                        header?.column?.parent?.id === "hours"
                                    ) {
                                        return (
                                            <div
                                                className="text-base-content py-2 text-center text-base 2xl:text-lg w-14"
                                                key={header.id}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } else if (header.column.id === "deleter") {
                                        return (
                                            <span
                                                className="w-12"
                                                key={header.id}
                                            >
                                                {null}
                                            </span>
                                        );
                                    } else if (
                                        header.column.id === "workdescription"
                                    ) {
                                        return (
                                            <div
                                                key={header.id}
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
                                                className="text-base-content py-2 text-center text-base 2xl:text-lg w-44"
                                                key={header.id}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        ))}
                    </div>
                    {rows && (
                        <>
                            {table.getRowModel().rows.length > 0 ? (
                                <div className=" space-y-2">
                                    {table.getRowModel().rows.map((row) => {
                                        return (
                                            <div
                                                className="rounded-md flex space-x-0.5"
                                                key={row.id}
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => {
                                                        if (
                                                            cell.column.id ===
                                                            "deleter"
                                                        ) {
                                                            return (
                                                                <div
                                                                    className="w-12"
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                >
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </div>
                                                            );
                                                        } else if (
                                                            cell?.column?.parent
                                                                ?.id === "hours"
                                                        ) {
                                                            return (
                                                                <div
                                                                    className="w-14 "
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                >
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div
                                                                    className="w-44 "
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                >
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
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
                                <div className="text-primary text-lg w-full text-center py-3">
                                    Looks like you have no rows... Click the
                                    button below to make one!
                                </div>
                            )}
                        </>
                    )}

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
            </ErrorBoundary>
        </>
    );
};

export default TimesheetTable;
