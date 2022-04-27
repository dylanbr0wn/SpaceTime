import React, { useEffect } from "react";
import { useTable, useFilters, useSortBy, useGlobalFilter } from "react-table";
import { Table } from "react-bootstrap";
import "../../style/ItemList.css";
import {
    fuzzyTextFilterFn,
    GlobalFilter,
    DefaultColumnFilter,
} from "../../../services/filters";
import PropTypes from "prop-types";
import { saveSubordinateRows } from "../../../redux/actions/subordinatesActions";

import { connect } from "react-redux";

/**
 * @name ItemList
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description Memoized data and columns are passed in through props.
 * Most of this was frankensteined together from the [react-table docs](https://react-table.tanstack.com/) and examples.
 * Well worth visiting.
 */
const SubordinateList = ({
    saveSubordinateRows,
    data,
    columns,
    handleClick,
    itemsPerPage = 10,
    filterColumns = true,
    filterGlobal = true,
}) => {
    // Custom filters for subordinate list.
    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            toggle: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? filterValue === "Active"
                            ? !rowValue
                            : rowValue
                        : true;
                });
            },
            equalStatus: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id].status;
                    return rowValue !== undefined
                        ? rowValue === filterValue
                        : false;
                });
            },
            lessThan: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? rowValue >= filterValue
                        : false;
                });
            },
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? String(rowValue)
                              .toLowerCase()
                              .startsWith(String(filterValue).toLowerCase())
                        : true;
                });
            },
        }),
        []
    );

    //  Set a default column type and filter
    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    );

    // React table hook
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,

        rows,

        state: { globalFilter },
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterTypes,
            initialState: {
                pageIndex: 0,
                pageSize: itemsPerPage,
                filters: [{ id: "ActiveStatus", value: "Active" }],
                sortBy: [
                    { id: "LastName", value: true },
                    { id: "Code", value: true },
                    { id: "DeptName", value: true },
                    { id: "Name", value: true },
                ],
            },
            autoResetFilters: false,
            autoResetSortBy: false,
            autoResetGlobalFilter: false,
        },

        useFilters, // useFilters!

        useGlobalFilter, // useGlobalFilter!
        useSortBy
    );

    useEffect(() => {
        saveSubordinateRows(rows);
    }, [rows, saveSubordinateRows]);

    return (
        <>
            <Table
                striped
                borderless
                hover
                {...getTableProps()}
                responsive
                style={{ tableLayout: "auto" }}
            >
                <thead>
                    {filterGlobal && (
                        <tr>
                            <th
                                colSpan={visibleColumns.length}
                                style={{
                                    textAlign: "left",
                                }}
                            >
                                <GlobalFilter
                                    preGlobalFilteredRows={
                                        preGlobalFilteredRows
                                    }
                                    globalFilter={globalFilter}
                                    setGlobalFilter={setGlobalFilter}
                                />
                            </th>
                        </tr>
                    )}

                    {headerGroups.map(headerGroup => (
                        <tr
                            key={headerGroup.id}
                            {...headerGroup.getHeaderGroupProps()}
                        >
                            {headerGroup.headers.map(column => (
                                <th
                                    key={column.id}
                                    {...column.getHeaderProps()}
                                >
                                    {column.render("Header")}
                                    {column.canSort && (
                                        <span
                                            {...column.getSortByToggleProps()}
                                        >
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fas fa-sort-down sortIcon" />
                                                ) : (
                                                    <i className="fas fa-sort-up sortIcon" />
                                                )
                                            ) : (
                                                <i className="fas fa-sort sortIcon" />
                                            )}
                                        </span>
                                    )}

                                    {filterColumns && (
                                        <div>
                                            {column.canFilter
                                                ? column.render("Filter")
                                                : null}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, j) => {
                        prepareRow(row);
                        return (
                            <tr key={row.id} {...row.getRowProps()}>
                                {row.cells.map((cell, i) => {
                                    if (cell.column.id === "unlocker") {
                                        return (
                                            <td
                                                style={{
                                                    cursor: "pointer",
                                                    ...cell.column.style,
                                                }}
                                                key={i}
                                                {...cell.getCellProps()}
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    }
                                    return (
                                        <td
                                            onClick={() =>
                                                handleClick(
                                                    row.original,
                                                    rows,
                                                    j
                                                )
                                            }
                                            style={{
                                                cursor: "pointer",
                                                ...cell.column.style,
                                            }}
                                            key={i}
                                            {...cell.getCellProps()}
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </>
    );
};

SubordinateList.propTypes = {
    data: PropTypes.array.isRequired,
    // Array of memoized user objects.
    columns: PropTypes.array.isRequired,
    // Array of memoized column objects.
    handleClick: PropTypes.func.isRequired,
    // Function for handling row clicks.
    itemsPerPage: PropTypes.number,
    // Number of items should be loaded per page initially
    filterColumns: PropTypes.bool,
    // Boolean to indicate if column filters should be rendered
    filterGlobal: PropTypes.bool,
    // Boolean to indicate if the global filter should be rendered
    saveSubordinateRows: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
    saveSubordinateRows,
};

export default connect(null, mapDispatchToProps)(SubordinateList);
