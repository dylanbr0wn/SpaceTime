import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Tippy from "@tippyjs/react";

import {
    createAllowedWorkCodesSelector,
    createUnusedWorkCodesSelector,
} from "../../../../services/selectors";
import { updateTimeEntryRowDispatch } from "../../../../redux/actions/timesheetsActions";
import "../../../style/TimeEntry.css";
import ErrorBoundary from "../../ErrorBoundary";

/**
 * @name TimesheetWorkCodeInput
 * @component
 * @category Time Entry
 * @description Input for Work Code.
 * Provides an dropdown menu with filtered options.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetWorkCodeInput = ({
    value,
    row,
    column: { id },
    disableModification,
    updateTimeEntryRowDispatch,
    allWorkCodes,
    allowedWorkCodes,
    EmployeeID,
    setIsLocked,
    timeEntryPeriodStartDate,
    isTablet,
    unusedWorkCodes,
    type,
}) => {
    // We need to keep and update the state of the cell normally
    const [stateValue, setStateValue] = useState(value);
    const [workCodeInfo, setWorkCodeInfo] = useState({});
    // const [validWorkCodes, setValidWorkCodes] = useState([]);

    //When changed, dispatch api call and redux action.
    const onChange = async ({ target }) => {
        if (parseInt(target.value) === -1) return;
        setStateValue(parseInt(target.value));
        // setSkipPageReset(true);
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

    //Set info field for workcode
    useEffect(() => {
        let workCode = [...allWorkCodes].find(
            (code) => code.WorkCodeID === stateValue
        );
        setWorkCodeInfo(workCode || {});
    }, [allWorkCodes, stateValue]);

    return (
        <>
            <ErrorBoundary>
                <Tippy
                    content={
                        stateValue === -1 ? (
                            "Choose Code..."
                        ) : (
                            <span>{`${workCodeInfo.Description} (${workCodeInfo.Code})`}</span>
                        )
                    }
                >
                    <div>
                        <Form.Control
                            custom
                            as="select"
                            aria-label="Work Code Input"
                            value={stateValue}
                            onChange={onChange}
                            disabled={disableModification}
                            size="sm"
                            style={{
                                color: stateValue === -1 ? "#888888" : "black",
                                minWidth: isTablet ? 60 : "10rem",
                                fontSize: isTablet ? "0.75rem" : "0.875rem",
                            }}
                        >
                            {allowedWorkCodes.map((workCode) => {
                                return (
                                    <option
                                        style={{ color: "black" }}
                                        value={workCode.WorkCodeID}
                                        key={workCode.WorkCodeID}
                                    >
                                        {workCode.Description}
                                    </option>
                                );
                            })}
                            {unusedWorkCodes.map((workCode) => {
                                return (
                                    <option
                                        style={{ color: "black" }}
                                        hidden={type === "user"}
                                        disabled={type === "user"}
                                        value={workCode.WorkCodeID}
                                        key={workCode.WorkCodeID}
                                    >
                                        {workCode.Description}
                                    </option>
                                );
                            })}
                            {stateValue !== -1 && (
                                <option
                                    style={{ color: "black" }}
                                    value={stateValue}
                                    hidden
                                >
                                    {workCodeInfo.Description}
                                </option>
                            )}

                            <option
                                style={{ color: "black" }}
                                value={-1}
                                hidden
                                disabled
                            >
                                Code...
                            </option>
                        </Form.Control>
                    </div>
                </Tippy>
            </ErrorBoundary>
        </>
    );
};
TimesheetWorkCodeInput.propTypes = {
    value: PropTypes.number.isRequired,
    row: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    disableModification: PropTypes.bool.isRequired,
    updateTimeEntryRowDispatch: PropTypes.func.isRequired,
    hourEntries: PropTypes.array,
    allowedWorkCodes: PropTypes.array.isRequired,
    allWorkCodes: PropTypes.array.isRequired,
    EmployeeID: PropTypes.number.isRequired,
    setIsLocked: PropTypes.func.isRequired,
    timeEntryPeriodStartDate: PropTypes.object.isRequired,
    isTablet: PropTypes.bool,
    unusedWorkCodes: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
};

const makeMapStateToProps = () => {
    const getAllowedWorkCodes = createAllowedWorkCodesSelector();
    const getUnusedWorkCodes = createUnusedWorkCodesSelector();
    const mapStateToProps = (state, props) => {
        return {
            unusedWorkCodes: getUnusedWorkCodes(state, props), //Gets unused workcodes so codes outside of user allowed ones are visible
            allowedWorkCodes: getAllowedWorkCodes(state, props), // gets all the workcodes a user is allowed
            allWorkCodes: state.workCodes,
        };
    };
    return mapStateToProps;
};

const mapDispatchToProps = {
    updateTimeEntryRowDispatch,
};

export default connect(
    makeMapStateToProps,
    mapDispatchToProps
)(TimesheetWorkCodeInput);
