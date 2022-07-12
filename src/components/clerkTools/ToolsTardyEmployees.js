import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import PropTypes from "prop-types";

import ItemList from "../common/ItemList";
import DescriptionItem from "../common/DescriptionItem";
import { defaultEmployee } from "../../services/objects";
import { SelectColumnFilter } from "../../services/filters";
import Modal from "../common/Modal";
import { readTardyEmployeesReportDispatch } from "../../redux/actions/reportsActions";

/**
 * @name TardyEmployees
 * @component
 * @category Clerk Tools
 * @param {Object} props Props. See propTypes for details.
 * @description Tardy employee report tool. Provides a list of all tardy employees based on
 * cut off date.
 */
const ToolsTardyEmployees = ({
    readTardyEmployeesReportDispatch,
    settings,
    departments,
}) => {
    const [tardyEmployees, setTardyEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(defaultEmployee);
    const [newLoad, setNewLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getDepartmentName = employee => {
            if (employee.DepartmentID) {
                const Dept = departments.find(
                    department =>
                        department.DepartmentID === employee.DepartmentID
                );
                return Dept ? Dept.DeptName : "";
            } else {
                return "";
            }
        };
        if (newLoad) {
            readTardyEmployeesReportDispatch(
                new Date(settings.CutOffDate)
            ).then(result => {
                if (result.success) {
                    setTardyEmployees(
                        result.data.map(employee => {
                            return {
                                ...employee,
                                Role: employee["IsAdministrator"]
                                    ? "Administrator"
                                    : employee["IsPayrollClerk"]
                                    ? "Payroll Clerk"
                                    : employee["IsSupervisor"]
                                    ? "Manager"
                                    : "Employee",
                                ActiveStatus: employee["IsActive"]
                                    ? "Active"
                                    : "Inactive",
                                DeptName: getDepartmentName(employee),
                            };
                        })
                    );
                    setNewLoad(false);
                } else {
                    toast.warn("Error: " + result.data);
                    setNewLoad(false);
                }
            });
        }
    }, [
        newLoad,
        departments,
        settings.CutOffDate,
        readTardyEmployeesReportDispatch,
    ]);

    //handles showing info modal when a tardy employee is clicked
    const handleClick = employee => {
        setShowModal(true);
        setSelectedEmployee(employee);
    };

    // Handles reloading when reload button is pressed
    const handleReload = () => {
        setNewLoad(true);
    };

    const getEmployeeDepartment = EmployeeDepartmentID => {
        let Dept = departments.find(
            department => department.DepartmentID === EmployeeDepartmentID
        );
        return Dept ? Dept.DeptName : "";
    };

    //Employee list sub component is everything needed for a React Table setup
    const EmployeeList = () => {
        const data = React.useMemo(() => tardyEmployees, []);
        const columns = React.useMemo(
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
                    accessor: "DeptName",
                    Filter: SelectColumnFilter, // Filter is for specifying a filter method other than the default
                    filter: "includes", // filter is for specifying a filter type. See react-table docs for details.
                },
                {
                    Header: "Email",
                    accessor: "Email",
                },
                {
                    Header: "Role",
                    accessor: "Role",
                    Filter: SelectColumnFilter,
                    filter: "includes",
                },
            ],
            []
        );
        return (
            <ItemList
                data={data}
                columns={columns}
                handleClick={handleClick}
                itemsPerPage={5}
                filterGlobal={false}
            />
        );
    };

    return (
        <>
            <Row>
                <Col>
                    <p>
                        Lists all employees that have not submitted any time on
                        the current pay period.
                    </p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button
                        disabled={newLoad}
                        style={{ marginBottom: 10 }}
                        variant="outline-success"
                        onClick={handleReload}
                    >
                        Reload{" "}
                        <i
                            style={{ marginLeft: 5 }}
                            className="fas fa-sync"
                        ></i>
                    </Button>
                </Col>
            </Row>
            {!newLoad ? (
                <EmployeeList />
            ) : (
                <>
                    <Row>
                        <Col className="text-center">
                            <Spinner
                                className="justify-content-center"
                                animation="border"
                                role="status"
                            />
                            <span className="sr-only">Loading...</span>
                        </Col>
                    </Row>
                </>
            )}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                title="Employee Details"
            >
                {selectedEmployee.DepartmentID && (
                    <>
                        <Row>
                            <Col>
                                <DescriptionItem
                                    header="First Name"
                                    info={selectedEmployee.FirstName}
                                />
                            </Col>
                            <Col>
                                <DescriptionItem
                                    header="Last Name"
                                    info={selectedEmployee.LastName}
                                />
                            </Col>
                            <Col>
                                <DescriptionItem
                                    header="ID"
                                    info={selectedEmployee.EmployeeID}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <DescriptionItem
                                    header="Email"
                                    info={selectedEmployee.Email}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <DescriptionItem
                                    header="Department"
                                    info={getEmployeeDepartment(
                                        selectedEmployee.DepartmentID
                                    )}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <DescriptionItem
                                    header="SAMAccountName"
                                    info={selectedEmployee.SAMAccountName}
                                />
                            </Col>
                            <Col>
                                <DescriptionItem
                                    header="DiamondEmpID"
                                    info={selectedEmployee.DiamondEmpID}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <DescriptionItem
                                    header="Role"
                                    info={selectedEmployee.Role}
                                />
                            </Col>
                            <Col>
                                <DescriptionItem
                                    header="Status"
                                    info={selectedEmployee.ActiveStatus}
                                />
                            </Col>
                        </Row>
                    </>
                )}
            </Modal>
        </>
    );
};

ToolsTardyEmployees.propTypes = {
    settings: PropTypes.object.isRequired,
    // Object with current setting information
    departments: PropTypes.array.isRequired,
    // Array of department objects
    readTardyEmployeesReportDispatch: PropTypes.func.isRequired,
    // Dispatch function for loading tardy employees
};

const mapStateToProps = state => {
    return {
        settings: state.settings,
        departments: state.departments,
    };
};

const mapDispatchToProps = {
    readTardyEmployeesReportDispatch,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolsTardyEmployees);
