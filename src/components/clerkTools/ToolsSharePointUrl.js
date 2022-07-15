import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import { saveSettingsDispatch } from "../../redux/actions/objectsActions";
import SavingIcon from "../common/SavingIcon";

/**
 * @name ToolsSharePointUrl
 * @component
 * @category Clerk Tools
 * @param {Object} props Props. See propTypes for details.
 * @description Time sheet sharepoint url tool. Provides a text input.
 */
const ToolsSharePointUrl = ({ settings, saveSettingsDispatch }) => {
	const [url, setUrl] = useState("");
	const [savingUrl, setSavingUrl] = useState(false);
	const [errors, setErrors] = useState({});
	const [timeoutId, setTimeoutId] = useState(null);

	useEffect(() => {
		setUrl(settings.SharepointURLForApproval);
	}, [settings]);

	//Handles dispatching redux action and api call with saveSettings when the url is changed.
	const handleChange = ({ target }) => {
		setErrors({});
		setSavingUrl(true);
		setUrl(target.value);
		if (timeoutId) clearTimeout(timeoutId);
		setTimeoutId(
			setTimeout(async () => {
				const result = await saveSettingsDispatch({
					...settings,
					SharepointURLForApproval: target.value,
				});
				if (result.success) {
					setSavingUrl(false);
				} else {
					toast.warn("Error: " + result.data);
					setErrors({ date: "Couldnt save settings." });
					setSavingUrl(false);
				}
			}, 750)
		);
	};

	return (
		<>
			<Row>
				<Col>
					<div className="h5">SharePoint Approval URL </div>
				</Col>
			</Row>
			<Row noGutters>
				<Col xs={8}>
					<Form.Group controlId="formBasicEmail">
						<Form.Control type="text" value={url} onChange={handleChange} />
					</Form.Group>
				</Col>
				<Col xs={4}>
					<SavingIcon
						saving={savingUrl}
						error={Object.keys(errors).length !== 0}
						errorMessage={errors.date}
					/>
				</Col>
			</Row>
		</>
	);
};

ToolsSharePointUrl.propTypes = {
	settings: PropTypes.object.isRequired,
	// Object with current setting information
	saveSettingsDispatch: PropTypes.func.isRequired,
	// Dispatch function for saving settings information
};

const mapStateToProps = (state) => {
	return {
		settings: state.settings,
	};
};

const mapDispatchToProps = {
	saveSettingsDispatch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolsSharePointUrl);
