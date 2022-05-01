import React, { useEffect, useState, Suspense, useMemo, lazy } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "../style/UserAdmin.css";
const ItemList = lazy(() => import("../common/ItemList"));
import {
    saveEmployeeDispatch,
    readEmployeesDispatch,
    readEmployeeWorkCodesDispatch,
} from "../../redux/actions/employeesActions";
import {
    SelectColumnFilter,
    SelectColumnRoleFilter,
} from "../../services/filters";
const EmployeeForm = lazy(() => import("./EmployeeForm"));
import { defaultEmployee } from "../../services/objects";
import ErrorBoundary from "../common/ErrorBoundary";
import Loading from "../common/Loading";
import { getActiveDepartments, getSupervisors } from "../../services/selectors";
const ConfirmCloseModal = lazy(() => import("../common/ConfirmCloseModal"));

/**
 * @name EmployeeAdmin
 * @component
 * @category Object Admin
 * @param {Object} props Props. See propTypes for details.
 * @description User administration page.
 */
const EmployeeAdmin = ({
    employees,
    readEmployeesDispatch,
    departments,
    activeDepartments,
    workCodes,
    saveEmployeeDispatch,
    readEmployeeWorkCodesDispatch,
    supervisors,
}) => {
    const [modalShow, setModalShow] = useState(false);
    const [modalContentLoading, setModalContentLoading] = useState(false);
    const [employeeSaving, setEmployeeSaving] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(defaultEmployee);
    const [selectedEmployeeWorkCodes, setSelectedEmployeeWorkCodes] = useState(
        []
    );
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [changesMade, setChangesMade] = useState(false);

    useEffect(() => {
        if (employees.length === 0) {
            const loadEmployees = async () => {
                const result = await readEmployeesDispatch();
                if (!result.success) {
                    toast.warn(`Error loading employees. ${result.data}`);
                }
            };
            loadEmployees();
        }
    }, [employees.length, readEmployeesDispatch]);

    // Fetches default work codes for currently selected employee whenever work code list changes
    const defaultWorkCodes = useMemo(
        () => workCodes.filter(code => code.IsDefault),
        [workCodes]
    );

    // Handles selecting an employee from table, makes it active, and shows modal.
    const handleClick = async row => {
        if (!row.EmployeeID) {
            setSelectedEmployee(row);
            setSelectedEmployeeWorkCodes(defaultWorkCodes);
            setModalShow(true);
        } else {
            setModalContentLoading(true);
            setModalShow(true);
            let result = await readEmployeeWorkCodesDispatch(row.EmployeeID);
            if (result.success) {
                setSelectedEmployee(row);
                setSelectedEmployeeWorkCodes(result.data);
                setModalContentLoading(false);
            } else {
                setModalShow(false);
                setModalContentLoading(false);
                toast.warn(result.data);
            }
        }
    };

    //Creates a list of employees that is memoized for later use.
    const data = useMemo(
        () =>
            employees.map(employee => {
                const getSupervisorsName = employee => {
                    let supervisor = employees.find(
                        emp => emp.EmployeeID === employee.SupervisorID
                    );
                    return `${supervisor ? supervisor.FirstName : ""} ${
                        supervisor ? supervisor.LastName : ""
                    }`;
                };

                const getDepartmentName = employee => {
                    if (employee.DeptName) {
                        return employee.DeptName;
                    } else {
                        if (employee.DepartmentID) {
                            const Dept = departments.find(
                                department =>
                                    department.DepartmentID ===
                                    employee.DepartmentID
                            );
                            return Dept ? Dept.DeptName : "";
                        } else {
                            return "";
                        }
                    }
                };

                const getRole = employee => {
                    let roles = [];
                    if (employee.IsAdministrator) {
                        roles.push("Administrator");
                    }
                    if (employee.IsPayrollClerk) {
                        roles.push("Payroll Clerk");
                    }
                    if (employee.IsSupervisor) {
                        roles.push("Manager");
                    }
                    if (roles.length === 0) {
                        roles.push("Employee");
                    }

                    return roles.join(", ");
                };

                return {
                    ...employee,
                    Role: getRole(employee),
                    ActiveStatus: employee["IsActive"] ? "Active" : "Inactive",
                    SupervisorName: employee.SupervisorID
                        ? getSupervisorsName(employee)
                        : "",
                    DepartmentName: getDepartmentName(employee),
                };
            }),
        [employees, departments]
    );

    //Columns specifier for react tables
    const columns = useMemo(
        () => [
            {
                Header: "First Name",
                accessor: "FirstName", // accessor is the "key" in the data
            },
            {
                Header: "Last Name",
                accessor: "LastName",
            },
            {
                Header: "Department",
                accessor: "DepartmentName",
                Filter: SelectColumnFilter, // Filter is for specifying a filter method other than the default
                filter: "includes", // filter is for specifying a filter type. See react-table docs for details.
            },
            {
                Header: "Supervisor",
                accessor: "SupervisorName",
                Filter: SelectColumnFilter,
                filter: "includes",
            },
            {
                Header: "Email",
                accessor: "Email",
            },
            {
                Header: "Role",
                accessor: "Role",
                Filter: SelectColumnRoleFilter,
                filter: "is",
            },
            {
                Header: "Active",
                accessor: "ActiveStatus",
                Filter: SelectColumnFilter,
                filter: "includes",
            },
        ],
        []
    );

    //Handles submit for employee modal. Dispatches redux action and api call with saveEmployee. Creates toast on completion.
    const handleSubmit = async (employeeChanges, workCodeChanges) => {
        setEmployeeSaving(true);
        const result = await saveEmployeeDispatch(
            employeeChanges,
            workCodeChanges
        );
        if (result.success) {
            toast.success("Employee Saved!");
            setModalShow(false);
        } else {
            toast.warn("Error: " + result.data);
        }
        setEmployeeSaving(false);
        setSelectedEmployee(defaultEmployee);
        setSelectedEmployeeWorkCodes(defaultWorkCodes);
        setChangesMade(false);
    };

    //Handles closing the modal. If no changes have been made will close without confirmation.
    const handleHide = isChanged => {
        if (isChanged) {
            setShowConfirmModal(true);
            setModalShow(false);
        } else {
            setModalShow(false);
            setSelectedEmployee(defaultEmployee);
            setSelectedEmployeeWorkCodes(defaultWorkCodes);
        }
    };

    // Handles confirming modal close.
    const handleConfirmHide = () => {
        setShowConfirmModal(false);
        setModalShow(false);
        setSelectedEmployee(defaultEmployee);
        setSelectedEmployeeWorkCodes(defaultWorkCodes);
        setChangesMade(false);
    };

    return (
        <>
            <Container fluid className="userContainer bg-light">
                <Card className="userCard">
                    <ErrorBoundary>
                        <Card.Header className="text-center" as="h3">
                            Employee Admin
                        </Card.Header>
                        <Card.Body>
                            {employees.length > 0 && (
                                <>
                                    <Button
                                        style={{ marginBottom: 10 }}
                                        variant="outline-success"
                                        onClick={() =>
                                            handleClick(defaultEmployee)
                                        }
                                    >
                                        New Employee
                                    </Button>
                                    <Suspense fallback={<Loading />}>
                                        <ItemList
                                            data={data}
                                            columns={columns}
                                            handleClick={handleClick}
                                        />
                                    </Suspense>
                                </>
                            )}
                        </Card.Body>
                    </ErrorBoundary>
                </Card>
                {employees.length > 0 && (
                    <ErrorBoundary>
                        <Suspense fallback={<p />}>
                            <EmployeeForm
                                changesMade={changesMade}
                                setChangesMade={setChangesMade}
                                contentLoading={modalContentLoading}
                                employeeSaving={employeeSaving}
                                employee={selectedEmployee}
                                handleSubmit={handleSubmit}
                                modalShow={modalShow}
                                onHide={handleHide}
                                workCodes={workCodes}
                                departments={activeDepartments}
                                supervisors={supervisors}
                                employeeWorkCodes={selectedEmployeeWorkCodes}
                            />
                        </Suspense>
                        <Suspense fallback={<p />}>
                            <ConfirmCloseModal
                                style={{ zIndex: 1010 }}
                                onHide={() => {
                                    setShowConfirmModal(false);
                                    setModalShow(true);
                                }}
                                onConfirm={handleConfirmHide}
                                modalShow={showConfirmModal}
                                body="By closing this screen all unsaved data will be lost."
                                title="Close Employee Edit"
                            />
                        </Suspense>
                    </ErrorBoundary>
                )}
            </Container>
        </>
    );
};

EmployeeAdmin.propTypes = {
    employees: PropTypes.array.isRequired,
    // Array of user objects.
    readEmployeesDispatch: PropTypes.func.isRequired,
    // Dispatch function for loading users
    departments: PropTypes.array.isRequired,
    // Array of department objects.
    workCodes: PropTypes.array.isRequired,
    // Array of work code objects.
    saveEmployeeDispatch: PropTypes.func.isRequired,
    //Dispatch function for saving a user.
    readEmployeeWorkCodesDispatch: PropTypes.func.isRequired,
    supervisors: PropTypes.array.isRequired,
    activeDepartments: PropTypes.array.isRequired,
};

const mapStateToProps = state => {
    return {
        employees: state.employees,
        activeDepartments: getActiveDepartments(state),
        departments: state.departments,
        workCodes: state.workCodes,
        supervisors: getSupervisors(state), //A selector. ALlows for selecting filtered data while removing unessecary updates due recomputing data
    };
};

const mapDispatchToProps = {
    saveEmployeeDispatch,
    readEmployeesDispatch,
    readEmployeeWorkCodesDispatch,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeAdmin);
