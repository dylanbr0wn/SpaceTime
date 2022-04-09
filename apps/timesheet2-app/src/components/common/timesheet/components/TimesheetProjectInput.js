import React, { useState, useEffect, useCallback } from "react";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Tippy from "@tippyjs/react";

import "tippy.js/dist/tippy.css";
import {
    getComputedData,
    createValidProjectsSelector,
} from "../../../../services/selectors";
import { checkValidProject } from "../../../../services/utils";
import "../../../style/TimeEntry.css";
import { updateTimeEntryRowDispatch } from "../../../../redux/actions/timesheetsActions";
import ErrorBoundary from "../../ErrorBoundary";

/**
 * @name TimesheetProjectInput
 * @component
 * @category Time Entry
 * @description Input for Projects
 * Provides an dropdown menu with filtered options.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetProjectInput = ({
    value,
    row,
    column: { id },
    data,
    projects,
    disableModification,
    updateTimeEntryRowDispatch,
    EmployeeID,
    setIsLocked,
    timeEntryPeriodStartDate,
    isTablet,
    workCodes,
}) => {
    // We need to keep and update the state of the cell normally
    const [stateValue, setStateValue] = useState(value);
    const [projectInfo, setProjectInfo] = useState({});
    const [projectFocused, setProjectFocused] = useState(false);

    //When changed, dispatch api call and redux action.
    const onChange = ({ target }) => {
        const ProjectID = parseInt(target.value);

        //Checks
        if (ProjectID === -1) return;
        //Need to do check to make sure we arnt forcing a duplicate state
        if (
            checkValidProject(
                ProjectID,
                data,
                workCodes,
                row.original.WorkCodeID
            )
        ) {
            toast.warn(
                "Invalid project selection. You have already used all the available work codes for this project."
            );
            return;
        }

        setStateValue(ProjectID);
        updateProject(ProjectID);
    };

    const updateProject = useCallback(
        async newValue => {
            let result = await updateTimeEntryRowDispatch(
                row.index,
                newValue,
                id,
                {
                    ...row.original,
                    ProjectID: newValue,
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
        },
        [
            EmployeeID,
            id,
            row.index,
            row.original,
            setIsLocked,
            timeEntryPeriodStartDate,
            updateTimeEntryRowDispatch,
        ]
    );

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setStateValue(value);
    }, [value]);

    // Updates project value based on currently valid projects.
    useEffect(() => {
        if (value === stateValue) {
            //if not equal than other effect has not yet run
            if (projects.length > 0) {
                //if there are no applicable projects, set to defualt
                let project = projects.find(
                    project => project.ProjectID === stateValue
                );
                if (!project) {
                    //If project is not in list

                    setStateValue(-1);
                } else {
                    if (!project.IsActive && !disableModification)
                        setStateValue(-1);
                    setProjectInfo(project || {});
                }
            } else {
                setStateValue(-1);
            }
        }
    }, [disableModification, projects, stateValue, updateProject, value]);

    return (
        <>
            <ErrorBoundary>
                <Tippy
                    content={
                        stateValue === -1 ? ( //setting the tool tip content
                            "Choose Project..."
                        ) : (
                            <span>{`${projectInfo.Name} (${projectInfo.Description})`}</span>
                        )
                    }
                >
                    <div>
                        <Form.Control
                            custom
                            as="select"
                            aria-label="Project Input"
                            value={stateValue}
                            onChange={onChange}
                            onFocus={() => setProjectFocused(true)}
                            onBlur={() => setProjectFocused(false)}
                            disabled={
                                disableModification ||
                                row.original.DepartmentID === -1
                            }
                            size="sm"
                            style={{
                                color: stateValue === -1 ? "#888888" : "black",
                                minWidth: isTablet ? 120 : "16rem",
                                fontSize: isTablet ? "0.75rem" : "0.875rem",
                            }}
                        >
                            {projects.map(project => {
                                return (
                                    <option
                                        style={{ color: "black" }}
                                        value={project.ProjectID}
                                        key={project.ProjectID}
                                        onSelect={() =>
                                            setProjectFocused(false)
                                        }
                                        hidden={!project.IsActive}
                                        disabled={!project.IsActive}
                                    >
                                        {projectFocused
                                            ? `${project.Name} - ${project.Description}`
                                            : `${project.Name}`}
                                    </option>
                                );
                            })}
                            <option value={-1} hidden disabled>
                                Project...
                            </option>
                        </Form.Control>
                    </div>
                </Tippy>

                {/* } */}
            </ErrorBoundary>
        </>
    );
};
TimesheetProjectInput.propTypes = {
    value: PropTypes.number.isRequired,
    row: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
    disableModification: PropTypes.bool.isRequired,
    updateTimeEntryRowDispatch: PropTypes.func.isRequired,
    hourEntries: PropTypes.array,
    EmployeeID: PropTypes.number.isRequired,
    setIsLocked: PropTypes.func.isRequired,
    timeEntryPeriodStartDate: PropTypes.object.isRequired,
    isTablet: PropTypes.bool,
    type: PropTypes.string.isRequired,
    workCodes: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
};

const makeMapStateToProps = () => {
    const getValidProjects = createValidProjectsSelector();
    const mapStateToProps = (state, props) => {
        return {
            projects: getValidProjects(state, props), //Gets all projects a user is allowed to use
            data: getComputedData(state, props),
        };
    };
    return mapStateToProps;
};

// const mapStateToProps = (state, props) => {
//     return {
//         projects: getValidProjects(state, props), //Gets all projects a user is allowed to use
//         data: getComputedData(state, props),
//     };
// };

const mapDispatchToProps = {
    updateTimeEntryRowDispatch,
};

export default connect(
    makeMapStateToProps,
    mapDispatchToProps
)(TimesheetProjectInput);
