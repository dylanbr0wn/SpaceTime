import React, { useState } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import { connect } from "react-redux";
import FileDownload from "js-file-download";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import { readDynamicsReportDispatch } from "../../redux/actions/reportsActions";
import "../style/ExportsCard.css";

moment.locale("en-ca");

/**
 * @name DynamicsExport
 * @component
 * @category Clerk Tools
 * @param {Object} props Props. See propTypes for details.
 * @description Dynamics export tool. Provides a date range input.
 */
const ToolsDynamicsExport = ({ readDynamicsReportDispatch, isTablet }) => {
    const [dynamicsStart, setDynamicsStart] = useState(null);
    const [dynamicsEnd, setDynamicsEnd] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [dynamicsLoading, setDynamicsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Handles changes in the dynamics export input fields. Updates the local attributes.
    const handleDynamicsChange = ({ startDate, endDate }) => {
        setDynamicsStart(startDate);
        setDynamicsEnd(endDate);
    };

    // Handles submitting dynamics export. First checks form validity. If valid, will dispatch redux action and api call through readDynamicsReportDispatch.
    const handleDynamicsSubmit = async () => {
        if (!formIsValid()) {
            return;
        } else {
            setDynamicsLoading(true);
            const result = await readDynamicsReportDispatch(
                moment(dynamicsStart).subtract(12, "hours").toDate(),
                moment(dynamicsEnd).subtract(12, "hours").toDate()
            );

            if (result.success) {
                setDynamicsLoading(false);
                FileDownload(result.data, `dynamics_report.csv`);
            } else {
                setDynamicsLoading(false);
                toast.warn("Error: " + result.data);
            }
        }
    };

    // Checks if form is valid
    const formIsValid = () => {
        let errors = {};

        if (!dynamicsStart || !dynamicsEnd)
            errors.date = "Please select a valid date range.";
        setErrors(errors);
        // Form is valid if the errors object still has no properties
        return Object.keys(errors).length === 0;
    };

    return (
        <>
            <Row>
                <Col>
                    <div className="h5">Dynamics Export</div>
                </Col>
            </Row>
            <Row>
                <Col xs={7}>
                    <DateRangePicker
                        startDate={dynamicsStart} // momentPropTypes.momentObj or null,
                        startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                        endDate={dynamicsEnd} // momentPropTypes.momentObj or null,
                        endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                        onDatesChange={handleDynamicsChange} // PropTypes.func.isRequired,
                        focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                        onFocusChange={(focusedInput) =>
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
                        {dynamicsLoading ? (
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
                                onClick={handleDynamicsSubmit}
                                className=" d-block"
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

ToolsDynamicsExport.propTypes = {
    // Dispatch function for getting report data
    readDynamicsReportDispatch: PropTypes.func.isRequired,
    // Bool indicating if use is in tablet mode
    isTablet: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
    readDynamicsReportDispatch,
};

export default connect(null, mapDispatchToProps)(ToolsDynamicsExport);
