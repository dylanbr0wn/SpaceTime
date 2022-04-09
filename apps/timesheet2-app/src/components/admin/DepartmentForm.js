import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Modal from "../common/Modal";
import PropTypes from "prop-types";

/**
 * @name DepartmentForm
 * @component
 * @category Object Admin
 * @param {Object} props Props. See propTypes for details.
 * @description Form for editting a department object.
 */
const DepartmentForm = ({
    department,
    departmentSaving,
    handleSubmit,
    modalShow,
    onHide,
    changesMade,
    setChangesMade,
}) => {
    const [departmentChanges, setDepartmentChanges] = useState(department);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!changesMade && modalShow) {
            setChangesMade(false);
            setErrors({});
            setDepartmentChanges(department);
        }
    }, [changesMade, department, modalShow, setChangesMade]);

    // Handles changes in the department form. Updates the local state of the department.
    const handleChange = ({ target }) => {
        setChangesMade(true);
        let changedDepartment = departmentChanges;
        let value = target.value;
        let name = target.name;
        if (name === "IsActive") {
            value = target.checked;
        }
        setDepartmentChanges({ ...changedDepartment, [name]: value });
    };

    //Checks if the form is valid on submission. If not, errors will be displayed. If it is valid, will begin updating department state with local altered state.
    const onSubmit = () => {
        if (!formIsValid()) return;
        handleSubmit(departmentChanges);
    };

    //Submit form button sub component
    const SubmitButton = () => (
        <Button disabled={departmentChanges === department} onClick={onSubmit}>
            {departmentSaving
                ? "Saving..."
                : department.DepartmentID
                ? "Save Changes"
                : "Create Department"}
        </Button>
    );

    //Checks if form is valid. If not, well set errors as specified and return false. If form is valid, will return true.
    const formIsValid = () => {
        const errors = {};

        if (!departmentChanges.DeptName || departmentChanges.DeptName === "")
            errors.DeptName = "Department name cannot be blank.";
        if (departmentChanges.DeptName.length > 50)
            errors.DeptName =
                "Department name must be less than 50 characters long.";

        setErrors(errors);
        // Form is valid if the errors object still has no properties
        return Object.keys(errors).length === 0;
    };

    return (
        <Modal
            SubmitButton={SubmitButton}
            show={modalShow}
            onHide={() => onHide(changesMade)}
            title={
                department.DepartmentID
                    ? "Edit Department"
                    : "Create Department"
            }
        >
            <Form>
                <Form.Group controlId="DeptName">
                    <Form.Label className="font-weight-bold">
                        Department Name
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Department Name"
                        name="DeptName"
                        value={
                            departmentChanges.DeptName
                                ? departmentChanges.DeptName
                                : ""
                        }
                        onChange={handleChange}
                        isInvalid={errors.DeptName}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.DeptName}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="DepartmentID">
                    <Form.Label className="font-weight-bold">
                        Department ID
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Department ID"
                        name="DepartmentID"
                        value={
                            departmentChanges.DepartmentID
                                ? departmentChanges.DepartmentID
                                : ""
                        }
                        onChange={handleChange}
                        disabled
                    />
                </Form.Group>
                <Form.Group controlId="IsActive">
                    <Form.Label className="font-weight-bold">
                        Is Active
                    </Form.Label>
                    <Form.Check
                        custom
                        label="Department is Active?"
                        name="IsActive"
                        checked={
                            departmentChanges.IsActive
                                ? departmentChanges.IsActive
                                : false
                        }
                        onChange={handleChange}
                    />
                </Form.Group>
            </Form>
        </Modal>
    );
};

DepartmentForm.propTypes = {
    // Object of selected user.
    department: PropTypes.object.isRequired,
    // Boolean that tracks if the department is saving or not.
    departmentSaving: PropTypes.bool.isRequired,
    // Function for submitting the form
    handleSubmit: PropTypes.func.isRequired,
    // Boolean to control if the Modal is shown
    modalShow: PropTypes.bool.isRequired,
    // Function to hide the Modal when it is closed or the form is completed
    onHide: PropTypes.func.isRequired,
    changesMade: PropTypes.bool.isRequired,
    setChangesMade: PropTypes.func.isRequired,
};

export default DepartmentForm;
