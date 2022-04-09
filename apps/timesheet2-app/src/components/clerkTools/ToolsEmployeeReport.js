import React, { useState, useEffect } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import "../style/ExportsCard.css";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import { readEmployeeTimeSheetReportDispatch } from "../../redux/actions/reportsActions";
import { readEmployeesDispatch } from "../../redux/actions/employeesActions";
import { connect } from "react-redux";
import { Combobox } from "react-widgets";
// import { defaultEmployee } from "../../services/objects";
import FileDownload from "js-file-download";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

/**
 * @name ToolsEmployeeReport
 * @component
 * @category Clerk Tools
 * @param {Object} props Props. See propTypes for details.
 * @description Employee timesheet report tool. Provides name input, and a date range input.
 */
const ToolsEmployeeReport = ({
    readEmployeesDispatch,
    loading,
    employees,
    readEmployeeTimeSheetReportDispatch,
    isTablet,
}) => {
    const [timeSheetStart, setTimeSheetStart] = useState(null);
    const [timeSheetEnd, setTimeSheetEnd] = useState(null);
    const [employeeIDToReport, setEmployeeIDToReport] = useState(-1);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [focusedInput, setFocusedInput] = useState(null);
    const [timeSheetLoading, setTimeSheetLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (employees.length === 0 && !loading) {
            readEmployeesDispatch();
        }
    }, [loading, employees.length, readEmployeesDispatch]);

    // Handles updating local settings for timesheet report.
    const handleTimeSheetReportChange = ({ startDate, endDate }) => {
        setTimeSheetStart(startDate);
        setTimeSheetEnd(endDate);
    };

    // Handles submitting timesheet reprot form. First checks form validity. If valid, will dispatch redux action and api call through loadEmployeeTimeSheetReport.
    const handleTimeSheetReportSubmit = async () => {
        if (!formIsValid()) {
            return;
        } else {
            setTimeSheetLoading(true);
            const result = await readEmployeeTimeSheetReportDispatch(
                employeeIDToReport,
                moment(timeSheetStart).utc().toDate(),
                moment(timeSheetEnd).utc().toDate()
            );
            if (result.success) {
                setTimeSheetLoading(false);
                FileDownload(result.data, `${employeeIDToReport}_report.csv`);
            } else {
                setTimeSheetLoading(false);
                toast.warn("Error: " + result.data);
            }
        }
    };

    //Sub component for the item list.
    // let ListItem = ({ item }) => (
    //     <span>
    //         <strong>{item.FirstName}</strong>
    //         {" " + item.LastName}
    //         <em> ID: {item.EmployeeID}</em>
    //     </span>
    // );
    // ListItem.propTypes = {
    //     item: PropTypes.object.isRequired,
    // };

    // Custom filter used in the search input.
    // const filter = (employee, value) => {
    //     let search = value.toLowerCase();
    //     const lastName = employee.LastName ? employee.LastName : "";
    //     const firstName = employee.FirstName ? employee.FirstName : "";
    //     if (firstName.toLowerCase().indexOf(search) === 0) return true;
    //     if (lastName.toLowerCase().indexOf(search) === 0) return true;
    //     if (toString(employee.EmployeeID).toLowerCase().indexOf(search) === 0)
    //         return true;
    //     return false;
    // };

    //Checks if form fields are valid and sets errors accordingly
    const formIsValid = () => {
        let errors = {};

        if (!timeSheetStart || !timeSheetEnd)
            errors.date = "Please select a valid date range.";
        if (employeeIDToReport < 0)
            errors.employee = "Please select an employee.";
        setErrors(errors);
        // Form is valid if the errors object still has no properties
        return Object.keys(errors).length === 0;
    };

    return (
        <>
            <Row>
                <Col>
                    <div className="h5">Employee Timesheet Report (.csv)</div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Combobox
                        style={{ marginBottom: 10 }}
                        data={employees}
                        value={employeeIDToReport}
                        dataKey="EmployeeID"
                        textField={item => {
                            return item.EmployeeID
                                ? item.FirstName +
                                      " " +
                                      item.LastName +
                                      " ID: " +
                                      item.EmployeeID
                                : employeeSearch;
                        }}
                        onChange={value => {
                            if (employeeIDToReport > -1) {
                                setEmployeeIDToReport(-1);
                            }
                            setEmployeeSearch(value);
                        }}
                        onSelect={value => {
                            setEmployeeIDToReport(value.EmployeeID);
                        }}
                        filter={"contains"}
                        placeholder="Select an Employee..."
                    />
                    {errors.employee && (
                        <div className="invalid-text">{errors.employee}</div>
                    )}
                </Col>
            </Row>
            <Row>
                <Col xs={7}>
                    <DateRangePicker
                        startDate={timeSheetStart} // momentPropTypes.momentObj or null,
                        startDateId="your_unique_start_date_id_2" // PropTypes.string.isRequired,
                        endDate={timeSheetEnd} // momentPropTypes.momentObj or null,
                        endDateId="your_unique_end_date_id_2" // PropTypes.string.isRequired,
                        onDatesChange={handleTimeSheetReportChange} // PropTypes.func.isRequired,
                        focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                        onFocusChange={focusedInput =>
                            setFocusedInput(focusedInput)
                        } // PropTypes.func.isRequired,
                        hideKeyboardShortcutsPanel
                        showDefaultInputIcon
                        small={isTablet}
                        inputIconPosition="after"
                        isOutsideRange={() => false}
                    />
                    {errors.date && (
                        <div className="invalid-text">{errors.date}</div>
                    )}
                </Col>
                <Col>
                    <div style={{ height: 48, padding: 5 }}>
                        {timeSheetLoading ? (
                            <Button variant="primary" disabled>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ marginRight: 5 }}
                                />
                                Loading...
                            </Button>
                        ) : (
                            <Button
                                onClick={handleTimeSheetReportSubmit}
                                // className=" d-block"
                            >
                                Create Report
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>
        </>
    );
};

ToolsEmployeeReport.propTypes = {
    // Bool indicating if use is in tablet mode
    isTablet: PropTypes.bool.isRequired,
    // Dispatch function for loading employees
    readEmployeesDispatch: PropTypes.func.isRequired,
    // Boolean for indicating if an API call is in progress
    loading: PropTypes.bool.isRequired,
    // Array of employee objects
    employees: PropTypes.array.isRequired,
    // Dispatch function for requesting a timesheet report
    readEmployeeTimeSheetReportDispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        loading: state.apiCallsInProgress > 0,
        employees: state.employees,
    };
};

const mapDispatchToProps = {
    readEmployeeTimeSheetReportDispatch,
    readEmployeesDispatch,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolsEmployeeReport);
