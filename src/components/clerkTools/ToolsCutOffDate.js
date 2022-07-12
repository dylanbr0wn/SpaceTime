import React, { useState, useEffect } from "react";
import { SingleDatePicker } from "react-dates";
import moment from "moment";
import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import { saveSettingsDispatch } from "../../redux/actions/objectsActions";
import SavingIcon from "../common/SavingIcon";

// moment.locale('en-ca');

/**
 * @name ToolsCutOffDate
 * @component
 * @category Clerk Tools
 * @param {Object} props Props. See propTypes for details.
 * @description Time sheet cut off date selection tool. Provides a date selection input.
 */
const ToolsCutOffDate = ({ settings, saveSettingsDispatch }) => {
    const [cutOffDate, setCutOffDate] = useState(
        moment.utc(settings.CutOffDate)
    );
    const [focused, setFocused] = useState(false);
    const [savingDate, setSavingDate] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setCutOffDate(moment.utc(settings.CutOffDate));
    }, [settings]);

    //Handles dispatching redux action and api call with saveSettings when the date is changed.
    const handleDateChange = async date => {
        setErrors({});
        setSavingDate(true);
        const result = await saveSettingsDispatch({
            ...settings,
            CutOffDate: date.toDate(),
        });
        if (result.success) {
            setSavingDate(false);
        } else {
            toast.warn("Error: " + result.data);
            setErrors({ date: "Couldnt save settings." });
            setSavingDate(false);
        }
    };

    return (
        <>
            <Row>
                <Col>
                    <div className="h5">Cut Off Date </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <SingleDatePicker
                        date={cutOffDate} // momentPropTypes.momentObj or null
                        onDateChange={handleDateChange} // PropTypes.func.isRequired
                        focused={focused} // PropTypes.bool
                        onFocusChange={({ focused }) => setFocused(focused)} // PropTypes.func.isRequired
                        id="your_unique_id" // PropTypes.string.isRequired,
                        showDefaultInputIcon
                        hideKeyboardShortcutsPanel
                        numberOfMonths={1}
                        isOutsideRange={() => false}
                    />
                    <SavingIcon
                        saving={savingDate}
                        error={Object.keys(errors).length !== 0}
                        errorMessage={errors.date}
                    />
                </Col>
            </Row>
        </>
    );
};

ToolsCutOffDate.propTypes = {
    settings: PropTypes.object.isRequired,
    // Object with current setting information
    saveSettingsDispatch: PropTypes.func.isRequired,
    // Dispatch function for saving settings information
};

const mapStateToProps = state => {
    return {
        loading: state.apiCallsInProgress > 0,
        settings: state.settings,
    };
};

const mapDispatchToProps = {
    saveSettingsDispatch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolsCutOffDate);
