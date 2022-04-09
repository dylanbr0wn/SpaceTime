import React, { useState, useMemo } from 'react'
import matchSorter from 'match-sorter'
import {
    useAsyncDebounce
} from 'react-table'
import PropTypes from "prop-types"
import { Button, Col, Form, Row } from 'react-bootstrap'

/**
 * This file contains filter utilities from react-table. Most of these functions where taken from their docs/examples.
 * If knowledge on how they work you seek, search elsewhere you must.
 * 
 */

/**
* @name GlobalFilter
* @category Common Components
* @description The global text filter on tables.
*/
export const GlobalFilter = ({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) => {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <span>
            Search:{' '}
            <Form.Control
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`${count} records...`}
            />
        </span>
    )
}

GlobalFilter.propTypes = {
    preGlobalFilteredRows: PropTypes.array.isRequired,
    globalFilter: PropTypes.string,
    setGlobalFilter: PropTypes.func.isRequired
}

/**
 * @name DefaultColumnFilter
 * @category Common Components
 * @description The default column text filter.
 */
export const DefaultColumnFilter = ({
    column: { filterValue, preFilteredRows, setFilter },
}) => {
    const count = preFilteredRows.length

    return (
        <Form.Control
            style={{ marginTop: 5 }}
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

DefaultColumnFilter.propTypes = {
    column: PropTypes.object
}

export const fuzzyTextFilterFn = (rows, id, filterValue) => {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

/**
 * @name SelectColumnFilter
 * @category Common Components
 * @description Column select filter for general purpose.
 */
export const SelectColumnFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id },
}) => {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
        <Form.Control
            custom
            as="select"
            value={filterValue}
            style={{ marginTop: 5 }}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </Form.Control>
    )
}
SelectColumnFilter.propTypes = {
    column: PropTypes.object
}

/**
 * @name SelectColumnFilter
 * @category Common Components
 * @description Column select filter for general purpose.
 */
export const SelectColumnStatusFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id },
}) => {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id].status)
        })
        return [...options.values()]
    }, [id, preFilteredRows])
    // Render a multi-select box
    return (
        <Form.Control
            custom
            as="select"
            value={filterValue}
            style={{ marginTop: 5 }}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </Form.Control>
    )
}
SelectColumnStatusFilter.propTypes = {
    column: PropTypes.object
}



/**
 * @name SelectColumnRoleFilter
 * @category Common Components
 * @description Custom column select filter for employee roles.
 */
export const SelectColumnRoleFilter = ({
    column: { filterValue, setFilter },
}) => {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = useMemo(() =>
        [
            "Administrator",
            "Payroll Clerk",
            "Manager",
            "Employee"
        ], [])

    // Render a multi-select box
    return (
        <Form.Control
            custom
            as="select"
            value={filterValue}
            style={{ marginTop: 5 }}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </Form.Control>
    )
}

SelectColumnRoleFilter.propTypes = {
    column: PropTypes.object
}

export const SliderColumnFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id },
}) => {
    // Calculate the min and max
    // using the preFilteredRows

    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return [min, max]
    }, [id, preFilteredRows])

    return (
        <>
            <div >
                <Row>
                    <Col xs={7}>
                        <Form.Control
                            title='Filter minimum total hours'
                            type="range"
                            custom
                            min={min}
                            max={max}
                            value={filterValue || min}
                            onChange={e => {
                                setFilter(parseInt(e.target.value, 10))
                            }}
                        />
                    </Col>
                    <Col xs={3}>
                        {filterValue}
                    </Col>
                    <Col>
                        <Button variant="secondary" size="sm" onClick={() => setFilter(undefined)}>Off</Button>
                    </Col>
                </Row>


            </div>

        </>
    )
}
SliderColumnFilter.propTypes = {
    column: PropTypes.object
}