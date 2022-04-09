import React from "react";
import {
    useTable,
    useFilters,
    useSortBy,
    usePagination,
    useGlobalFilter,
} from "react-table";
import { Table, Pagination, Form } from "react-bootstrap";
import PropTypes from "prop-types";

import "../style/ItemList.css";
import {
    fuzzyTextFilterFn,
    GlobalFilter,
    DefaultColumnFilter,
} from "../../services/filters";

/**
 * @name ItemList
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description Memoized data and columns are passed in through props.
 * Most of this was frankensteined together from the [react-table docs](https://react-table.tanstack.com/) and examples.
 * Well worth visiting.
 */
const ItemList = ({
    data,
    columns,
    handleClick,
    itemsPerPage = 10,
    filterColumns = true,
    filterGlobal = true,
}) => {
    //Custom filters for the list.
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
            is: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? rowValue.includes(filterValue)
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

    //Specify default column attributes
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

        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter },
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
            autoResetPage: false
        },

        useFilters, // useFilters!

        useGlobalFilter, // useGlobalFilter!
        useSortBy,
        usePagination
    );

    return (
        <>
            <Table striped borderless hover {...getTableProps()} responsive>
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
                                    {column.canSort && (
                                        <span
                                            {...column.getSortByToggleProps()}
                                        >
                                            {column.render("Header")}
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
                    {page.map((row, j) => {
                        prepareRow(row);
                        return (
                            <tr key={row.id} {...row.getRowProps()}>
                                {row.cells.map((cell, i) => {
                                    if (cell.column.id === "unlocker") {
                                        return (
                                            <td
                                                style={{ cursor: "pointer" }}
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
                                                    page,
                                                    j
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
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
            <div className="pagination-section">
                <span
                    style={{
                        padding: "0px 10px 0 10px",
                        display: "inline-block",
                    }}
                >
                    <Pagination>
                        <Pagination.First
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}
                        />
                        <Pagination.Prev
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                        />
                        <Pagination.Item>{pageIndex + 1}</Pagination.Item>
                        <Pagination.Next
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                        />
                        <Pagination.Last
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}
                        />
                    </Pagination>
                </span>
                <span style={{ textAlign: "center", marginRight: 20 }}>
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{" "}
                </span>
                <span>
                    <span>
                        <label
                            style={{ padding: "0px 10px 0 10px" }}
                            htmlFor="pageNum"
                            className=" col-form-label"
                        >
                            Go to page:
                        </label>
                        <span>
                            <input
                                id="pageNum"
                                className="form-control inlineInput"
                                type="number"
                                defaultValue={pageIndex + 1}
                                onChange={e => {
                                    const page = e.target.value
                                        ? Number(e.target.value) - 1
                                        : 0;
                                    gotoPage(page);
                                }}
                                style={{ width: "100px" }}
                            />
                        </span>
                    </span>
                </span>
                <span
                    style={{
                        padding: "0px 10px 0 10px",
                        justifyContent: "right",
                        display: "inline-block",
                    }}
                >
                    <Form.Control
                        as="select"
                        custom
                        className="inlineInput"
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value));
                        }}
                    >
                        {[5, 10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </Form.Control>
                </span>
            </div>
        </>
    );
};

ItemList.propTypes = {
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
};

export default ItemList;
