import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Modal from "../common/Modal";
import PropTypes from "prop-types";

/**
 * @name ProjectForm
 * @component
 * @category Object Admin
 * @param {Object} props Props. See propTypes for details.
 * @description Form for editting a project object.
 */
const ProjectForm = ({
    project,
    departments,
    projectSaving,
    handleSubmit,
    modalShow,
    onHide,
    setChangesMade,
    changesMade,
}) => {
    const [projectChanges, setProjectChanges] = useState(project);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (modalShow && !changesMade) {
            setChangesMade(false);
            setErrors({});
            if (project.ProjectID) {
                setProjectChanges(project);
            } else {
                setProjectChanges({
                    ...project,
                    DepartmentID: -1,
                });
            }
        }
    }, [project, departments, setChangesMade, modalShow, changesMade]);

    // Handles changes in the project form. Updates the local state of the project.
    const handleChange = ({ target }) => {
        setChangesMade(true);
        let changedProject = projectChanges;
        let value = target.value;
        let name = target.name;
        if (name === "IsActive") {
            value = target.checked;
        }
        setProjectChanges({ ...changedProject, [name]: value });
    };

    //Checks if the form is valid on submission. If not, errors will be displayed. If it is valid, will begin updating project state with local altered state.
    const onSubmit = () => {
        if (!formIsValid()) return;
        handleSubmit(projectChanges);
    };

    //Submit form button sub component
    const SubmitButton = () => (
        <Button disabled={projectChanges === project} onClick={onSubmit}>
            {projectSaving
                ? "Saving..."
                : project.ProjectID
                ? "Save Changes"
                : "Create Project"}
        </Button>
    );

    //Checks if form is valid. If not, well set errors as specified and return false. If form is valid, will return true.
    const formIsValid = () => {
        const errors = {};

        if (!projectChanges.Name || projectChanges.Name === "")
            errors.Name = "Project name cannot be blank.";
        if (projectChanges.Name.length > 50)
            errors.Name = "Project name must be less than 50 characters long.";
        if (!projectChanges.Description || projectChanges.Description === "")
            errors.Description = "Project description cannot be blank.";
        if (projectChanges.Description.length > 50)
            errors.Description =
                "Project description must be less than 50 characters long.";
        if (!projectChanges.DepartmentID || projectChanges.DepartmentID === "")
            errors.DepartmentID = "Project must have an associated department.";
        if (projectChanges.GLCode ? projectChanges.GLCode.length > 50 : false)
            errors.GLCode =
                "Project GLCode must be less than 20 characters long.";
        if (projectChanges.DeptCode.length > 50)
            errors.DeptCode =
                "Project DeptCode must be less than 20 characters long.";

        setErrors(errors);
        // Form is valid if the errors object still has no properties
        return Object.keys(errors).length === 0;
    };

    return (
        <Modal
            SubmitButton={SubmitButton}
            show={modalShow}
            user={projectChanges}
            onHide={() => onHide(changesMade)}
            title={project.ProjectID ? "Edit Project" : "Create Project"}
        >
            <Form>
                <Form.Group controlId="Name">
                    <Form.Label className="font-weight-bold">
                        Project Name
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Project Name"
                        name="Name"
                        value={projectChanges.Name ? projectChanges.Name : ""}
                        onChange={handleChange}
                        isInvalid={errors.Name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.Name}
                    </Form.Control.Feedback>
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group controlId="ProjectID">
                            <Form.Label className="font-weight-bold">
                                Project ID
                            </Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Project ID"
                                name="ProjectID"
                                value={
                                    projectChanges.ProjectID
                                        ? projectChanges.ProjectID
                                        : ""
                                }
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="DepartmentID">
                            <Form.Label className="font-weight-bold">
                                Department
                            </Form.Label>
                            <Form.Control
                                as="select"
                                custom
                                value={
                                    projectChanges.DepartmentID
                                        ? projectChanges.DepartmentID
                                        : -1
                                }
                                onChange={handleChange}
                                name="DepartmentID"
                                isInvalid={errors.DepartmentID}
                            >
                                {departments.map((department) => {
                                    return (
                                        <option
                                            value={department.DepartmentID}
                                            key={department.DepartmentID}
                                        >
                                            {department.DeptName}
                                        </option>
                                    );
                                })}
                                <option disabled hidden value={-1}>
                                    Select a department...
                                </option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.DepartmentID}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="Description">
                    <Form.Label className="font-weight-bold">
                        Project Description
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Project Description"
                        name="Description"
                        value={
                            projectChanges.Description
                                ? projectChanges.Description
                                : ""
                        }
                        onChange={handleChange}
                        isInvalid={errors.Description}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.Description}
                    </Form.Control.Feedback>
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group controlId="GLCode">
                            <Form.Label className="font-weight-bold">
                                GLCode
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="GLCode"
                                name="GLCode"
                                value={
                                    projectChanges.GLCode
                                        ? projectChanges.GLCode
                                        : ""
                                }
                                onChange={handleChange}
                                isInvalid={errors.GLCode}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.GLCode}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="Department Code">
                            <Form.Label className="font-weight-bold">
                                Department Code
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Department Code"
                                name="DeptCode"
                                value={
                                    projectChanges.DeptCode
                                        ? projectChanges.DeptCode
                                        : ""
                                }
                                onChange={handleChange}
                                isInvalid={errors.DeptCode}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.DeptCode}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="IsActive">
                    <Form.Label className="font-weight-bold">
                        Is Active
                    </Form.Label>
                    <Form.Check
                        custom
                        label="Project is Active?"
                        name="IsActive"
                        checked={
                            projectChanges.IsActive
                                ? projectChanges.IsActive
                                : false
                        }
                        onChange={handleChange}
                    />
                </Form.Group>
            </Form>
        </Modal>
    );
};

ProjectForm.propTypes = {
    // Object of selected user.
    project: PropTypes.object.isRequired,
    // Boolean that tracks if the project is saving
    projectSaving: PropTypes.bool.isRequired,
    // Function for submitting the form
    handleSubmit: PropTypes.func.isRequired,
    // Boolean to control if the Modal is shown
    modalShow: PropTypes.bool.isRequired,
    // Function to hide the Modal when it is closed or the form is completed
    onHide: PropTypes.func.isRequired,
    // Array of department objects.
    departments: PropTypes.array.isRequired,
    changesMade: PropTypes.bool.isRequired,
    setChangesMade: PropTypes.func.isRequired,
};

export default ProjectForm;
