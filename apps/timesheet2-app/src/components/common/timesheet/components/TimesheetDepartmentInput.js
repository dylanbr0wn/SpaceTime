import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import "../../../style/TimeEntry.css";
import { updateTimeEntryRowDispatch } from "../../../../redux/actions/timesheetsActions";
import ErrorBoundary from "../../ErrorBoundary";

/**
 * @name TimesheetDepartmentInput
 * @component
 * @category Time Entry
 * @description Input for Department.
 * Provides an dropdown menu with filtered options.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetDepartmentInput = ({
    value,
    row,
    column: { id },
    departments,
    disableModification,
    updateTimeEntryRowDispatch,
    EmployeeID,
    setIsLocked,
    timeEntryPeriodStartDate,
    isTablet,
}) => {
    // We need to keep and update the state of the cell normally
    const [stateValue, setStateValue] = useState(value);
    const [departmentInfo, setDepartmentInfo] = useState({});

    //When changed, dispatch api call and redux action.
    const onChange = async ({ target }) => {
        if (parseInt(target.value) === -1) return;
        setStateValue(parseInt(target.value));
        let result = await updateTimeEntryRowDispatch(
            row.index,
            parseInt(target.value),
            id,
            {
                ...row.original,
                [id]: parseInt(target.value),
            },
            EmployeeID,
            timeEntryPeriodStartDate
        );
        if (!result.success) {
            if (result.status === 423) {
                setIsLocked(true);
            }
            toast.warn(result.data);
        }
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setStateValue(value);
    }, [value]);

    useEffect(() => {
        let department = departments.find(
            dep => dep.DepartmentID === stateValue
        );
        setDepartmentInfo(department || {});
    }, [stateValue, departments]);

    return (
        <>
            <ErrorBoundary>
                <Tippy
                    content={
                        stateValue === -1 ? (
                            "Choose Department..."
                        ) : (
                            <span>{`${departmentInfo.DeptName}`}</span>
                        )
                    }
                >
                    <div>
                        <Form.Control
                            custom
                            aria-label="Department Input"
                            as="select"
                            value={stateValue}
                            onChange={onChange}
                            // onBlur={onBlur}
                            disabled={disableModification}
                            size="sm"
                            style={{
                                color: stateValue === -1 ? "#888888" : "black",
                                minWidth: isTablet ? 60 : "8rem",
                                fontSize: isTablet ? "0.75rem" : "0.875rem",
                            }}
                        >
                            {departments.map(department => {
                                return (
                                    <option
                                        style={{ color: "black" }}
                                        value={department.DepartmentID}
                                        key={department.DepartmentID}
                                    >
                                        {department.DeptName}
                                    </option>
                                );
                            })}
                            <option value={-1} hidden disabled>
                                Department...
                            </option>
                        </Form.Control>
                    </div>
                </Tippy>
                {/* {!loading && */}

                {/* } */}
            </ErrorBoundary>
        </>
    );
};
TimesheetDepartmentInput.propTypes = {
    value: PropTypes.number.isRequired,
    row: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    departments: PropTypes.array.isRequired,
    disableModification: PropTypes.bool.isRequired,
    updateTimeEntryRowDispatch: PropTypes.func.isRequired,
    hourEntries: PropTypes.array,
    EmployeeID: PropTypes.number.isRequired,
    setIsLocked: PropTypes.func.isRequired,
    timeEntryPeriodStartDate: PropTypes.object.isRequired,
    isTablet: PropTypes.bool,
    type: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
    return {
        departments: state.departments,
    };
};

const mapDispatchToProps = {
    updateTimeEntryRowDispatch,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimesheetDepartmentInput);
