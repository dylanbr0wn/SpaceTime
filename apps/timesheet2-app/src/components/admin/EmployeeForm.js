import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Modal from "../common/Modal";
import PropTypes from "prop-types";
import { Multiselect } from "react-widgets";

/**
 * @name EmployeeForm
 * @component
 * @category Object Admin
 * @param {Object} props Props. See propTypes for details.
 * @description Form for editting a employee object and associated work codes.
 */
const EmployeeForm = ({
    employee,
    employeeSaving,
    contentLoading,
    handleSubmit,
    modalShow,
    onHide,
    workCodes,
    departments,
    supervisors,
    employeeWorkCodes,
    changesMade,
    setChangesMade,
}) => {
    const [employeeChanges, setEmployeeChanges] = useState(employee);
    const [workCodeChanges, setWorkCodeChanges] = useState(employeeWorkCodes);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Run when modal should be shown and when no changes have been attempted
        // Will only run on first load of employee
        if (modalShow && !changesMade) {
            setChangesMade(false);
            setErrors({});
            if (employee.EmployeeID) {
                setEmployeeChanges(employee);
            } else {
                setEmployeeChanges({
                    ...employee,
                    DepartmentID: -1,
                    DeptName: "",
                    SupervisorID: -1,
                });
            }

            setWorkCodeChanges(employeeWorkCodes);
        }
    }, [
        employee,
        employeeWorkCodes,
        departments,
        supervisors,
        modalShow,
        changesMade,
        setChangesMade,
    ]);

    // Handles changes in the employee form. Updates the local state of the employee.
    const handleChange = ({ target }) => {
        setChangesMade(true);
        let changedEmployee = employeeChanges;
        let value = target.value;
        let name = target.name;
        if (
            name === "IsActive" ||
            name === "IsSupervisor" ||
            name === "IsAdministrator" ||
            name === "IsPayrollClerk"
        ) {
            value = target.checked;
        } else if (name === "DepartmentID") {
            let department = departments.find(dep => {
                return dep.DepartmentID === parseInt(value);
            });
            changedEmployee = {
                ...changedEmployee,
                DeptName: department ? department.DeptName : null,
            };
        }

        let newErrors = errors;
        delete newErrors[target.name];

        setErrors(newErrors);

        setEmployeeChanges({ ...changedEmployee, [name]: value });
    };

    //Checks if the form is valid on submission. If not, errors will be displayed. If it is valid, will begin updating employee state with local altered state.
    const onSubmit = () => {
        if (!formIsValid()) return;
        handleSubmit(employeeChanges, workCodeChanges);
    };

    const validateEmail = email => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    //Submit form button sub component
    const SubmitButton = () => (
        <Button
            disabled={
                (employeeChanges === employee &&
                    employeeWorkCodes === workCodeChanges) ||
                employeeSaving
            }
            onClick={onSubmit}
        >
            {employeeSaving
                ? "Saving..."
                : employee.EmployeeID
                ? "Save Changes"
                : "Create Employee"}
        </Button>
    );

    //Checks if form is valid. If not, well set errors as specified and return false. If form is valid, will return true.
    const formIsValid = () => {
        const errors = {};
        if (
            !employeeChanges.SAMAccountName ||
            employeeChanges.SAMAccountName === ""
        )
            errors.SAMAccountName = "SAMAccountName cant be empty.";
        if (
            employeeChanges.SAMAccountName
                ? employeeChanges.SAMAccountName.length >= 50
                : false
        )
            errors.SAMAccountName =
                "SAMAccountName must be less than 50 characters long.";
        if (employeeChanges.LastName.length >= 50)
            errors.LastName =
                "Employee last name must be less than 50 characters long.";
        if (employeeChanges.FirstName.length >= 50)
            errors.FirstName =
                "Employee first name must be less than 50 characters long.";
        if (
            employeeChanges.DiamondEmpID
                ? employeeChanges.DiamondEmpID.length >= 50
                : false
        )
            errors.DiamondEmpID =
                "DiamondEmpID must be less than 50 characters long.";
        if (employeeChanges.Email === "")
            errors.Email = "Employee must have a valid email.";
        else if (!validateEmail(employeeChanges.Email))
            errors.Email = "The email entered is not valid.";
        if (employeeChanges.Email.length >= 50)
            errors.Email =
                "Employee email must be less than 50 characters long.";

        if (employeeChanges.DepartmentID === -1) {
            errors.DepartmentID = "Employee must be assigned a department.";
        }
        if (employeeChanges.SupervisorID === -1) {
            errors.SupervisorID = "Employee must be assigned a supervisor.";
        }
        setErrors(errors);
        // Form is valid if the errors object still has no properties
        return Object.keys(errors).length === 0;
    };

    return (
        <Modal
            SubmitButton={SubmitButton}
            show={modalShow}
            onHide={() => onHide(changesMade)}
            title={employee.EmployeeID ? "Edit Employee" : "Create Employee"}
            contentLoading={contentLoading}
        >
            <Form>
                <Row>
                    <Col>
                        <Form.Group controlId="FirstName">
                            <Form.Label className="font-weight-bold">
                                First Name
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="First Name"
                                name="FirstName"
                                value={
                                    employeeChanges.FirstName
                                        ? employeeChanges.FirstName
                                        : ""
                                }
                                onChange={handleChange}
                                isInvalid={errors.FirstName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.FirstName}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="LastName">
                            <Form.Label className="font-weight-bold">
                                Last Name
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Last Name"
                                name="LastName"
                                value={
                                    employeeChanges.LastName
                                        ? employeeChanges.LastName
                                        : ""
                                }
                                onChange={handleChange}
                                isInvalid={errors.LastName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.LastName}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="Email">
                    <Form.Label className="font-weight-bold">
                        Email Address
                    </Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        name="Email"
                        value={
                            employeeChanges.Email ? employeeChanges.Email : ""
                        }
                        onChange={handleChange}
                        isInvalid={errors.Email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.Email}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="IsActive">
                    <Form.Label className="font-weight-bold">
                        Is Active
                    </Form.Label>
                    <Form.Check
                        custom
                        label="Employee is Active?"
                        name="IsActive"
                        checked={
                            employeeChanges.IsActive
                                ? employeeChanges.IsActive
                                : false
                        }
                        onChange={handleChange}
                    />
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group controlId="DiamondEmpID">
                            <Form.Label className="font-weight-bold">
                                DiamondEmpID
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="DiamondEmpID"
                                name="DiamondEmpID"
                                value={
                                    employeeChanges.DiamondEmpID
                                        ? employeeChanges.DiamondEmpID
                                        : ""
                                }
                                onChange={handleChange}
                                isInvalid={errors.DiamondEmpID}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.DiamondEmpID}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="SAMAccountName">
                            <Form.Label className="font-weight-bold">
                                SAMAccountName
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="SAMAccountName"
                                name="SAMAccountName"
                                value={
                                    employeeChanges.SAMAccountName
                                        ? employeeChanges.SAMAccountName
                                        : ""
                                }
                                onChange={handleChange}
                                isInvalid={errors.SAMAccountName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.SAMAccountName}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="DepartmentID">
                            <Form.Label className="font-weight-bold">
                                Department
                            </Form.Label>
                            <Form.Control
                                as="select"
                                custom
                                value={employeeChanges.DepartmentID}
                                onChange={handleChange}
                                name="DepartmentID"
                                isInvalid={errors.DepartmentID}
                            >
                                {departments.map(department => {
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
                    <Col>
                        <Form.Label className="font-weight-bold">
                            Employee Role
                        </Form.Label>
                        <Form.Group>
                            <Form.Check
                                custom
                                label="Administrator"
                                name="IsAdministrator"
                                inline
                                checked={
                                    employeeChanges.IsAdministrator
                                        ? employeeChanges.IsAdministrator
                                        : false
                                }
                                onChange={handleChange}
                                id="isAdministrator"
                            />
                            <Form.Check
                                custom
                                label="Payroll Clerk"
                                name="IsPayrollClerk"
                                inline
                                checked={
                                    employeeChanges.IsPayrollClerk
                                        ? employeeChanges.IsPayrollClerk
                                        : false
                                }
                                onChange={handleChange}
                                id="isPayrollClerk"
                            />
                            <Form.Check
                                custom
                                label="Manager"
                                name="IsSupervisor"
                                inline
                                checked={
                                    employeeChanges.IsSupervisor
                                        ? employeeChanges.IsSupervisor
                                        : false
                                }
                                onChange={handleChange}
                                id="isSupervisor"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="Supervisor">
                    <Form.Label className="font-weight-bold">
                        Supervisor
                    </Form.Label>
                    <Form.Control
                        as="select"
                        custom
                        value={
                            employeeChanges.SupervisorID
                                ? employeeChanges.SupervisorID
                                : false
                        }
                        onChange={handleChange}
                        name="SupervisorID"
                        isInvalid={errors.SupervisorID}
                    >
                        {supervisors.map(supervisor => {
                            return (
                                <option
                                    value={supervisor.EmployeeID}
                                    key={`${supervisor.EmployeeID},${supervisor.UserID}`}
                                >
                                    {supervisor.FirstName +
                                        " " +
                                        supervisor.LastName}
                                </option>
                            );
                        })}
                        <option disabled hidden value={-1}>
                            Select a supervisor...
                        </option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.SupervisorID}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label className="font-weight-bold">
                        Work Codes
                    </Form.Label>
                    <Multiselect
                        data={workCodes}
                        value={workCodeChanges}
                        textField="Description"
                        dataKey="WorkCodeID"
                        onChange={value => setWorkCodeChanges(value)}
                        placeholder="Employee work codes"
                        dropUp
                    />
                </Form.Group>
            </Form>
        </Modal>
    );
};

EmployeeForm.propTypes = {
    // Object of selected employee.
    employee: PropTypes.object.isRequired,
    // Boolean that tracks if there is any ongoing API calls.
    contentLoading: PropTypes.bool.isRequired,
    // Function for submitting the form
    handleSubmit: PropTypes.func.isRequired,
    // Boolean to control if the Modal is shown
    modalShow: PropTypes.bool.isRequired,
    // Function to hide the Modal when it is closed or the form is completed
    onHide: PropTypes.func.isRequired,
    // Array of work code objects.
    workCodes: PropTypes.array.isRequired,
    // Array of department objects.
    departments: PropTypes.array.isRequired,
    // Array of employee objects where IsSupervisor is true
    supervisors: PropTypes.array.isRequired,
    // Array of work code objects associated with the selected employee.
    employeeWorkCodes: PropTypes.array.isRequired,
    // Boolean to indicate if the project is saving or not
    employeeSaving: PropTypes.bool.isRequired,
    changesMade: PropTypes.bool.isRequired,
    setChangesMade: PropTypes.func.isRequired,
};

export default EmployeeForm;
