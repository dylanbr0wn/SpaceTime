import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Modal from "../common/Modal";
import PropTypes from "prop-types";

/**
 * @name WorkCodeForm
 * @component
 * @category Object Admin
 * @param {Object} props Props. See propTypes for details.
 * @description Form for editting a workcode object.
 */
const WorkCodeForm = ({
	workCode,
	workCodeSaving,
	handleSubmit,
	modalShow,
	onHide,
	changesMade,
	setChangesMade,
}) => {
	const [workCodeChanges, setWorkCodeChanges] = useState(workCode);

	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (modalShow && !changesMade) {
			setChangesMade(false);
			setErrors({});
			setWorkCodeChanges(workCode);
		}
	}, [changesMade, modalShow, setChangesMade, workCode]);

	// Handles changes in the work code form. Updates the local state of the work code.
	const handleChange = ({ target }) => {
		setChangesMade(true);
		let changedWorkCode = workCodeChanges;
		let value = target.value;
		let name = target.name;
		if (name === "IsDefault" || name === "ExportToDynamics") {
			value = target.checked;
		}
		setWorkCodeChanges({ ...changedWorkCode, [name]: value });
	};

	// Handles limiting multiplier field to 2 decimals.
	const handleBlur = () => {
		const cleanNum = parseFloat(workCodeChanges.Multiplier).toFixed(2);
		setWorkCodeChanges({ ...workCodeChanges, Multiplier: cleanNum });
	};

	//Checks if the form is valid on submission. If not, errors will be displayed. If it is valid, will begin updating work code state with local altered state.
	const onSubmit = () => {
		if (!formIsValid()) return;
		handleSubmit(workCodeChanges);
	};

	//Submit form button sub component
	const SubmitButton = () => (
		<Button disabled={workCodeChanges === workCode} onClick={onSubmit}>
			{workCodeSaving
				? "Saving..."
				: workCode.WorkCodeID
				? "Save Changes"
				: "Create Work Code"}
		</Button>
	);

	//Checks if form is valid. If not, well set errors as specified and return false. If form is valid, will return true.
	const formIsValid = () => {
		const errors = {};

		if (!workCodeChanges.Code || workCodeChanges.Code === "")
			errors.Code = "Work code cannot be blank.";
		if (workCodeChanges.Code.length > 50)
			errors.Code = "Work code must be less than 15 characters long.";
		if (!workCodeChanges.Description || workCodeChanges.Description === "")
			errors.Description = "Work code description cannot be blank.";
		if (workCodeChanges.Description.length > 50)
			errors.Description =
				"work code description must be less than 50 characters long.";
		if (!workCodeChanges.Multiplier || workCodeChanges.Multiplier === "")
			errors.Multiplier = "Work code multiplier can't be empty.";
		if (
			workCodeChanges.Multiplier
				? parseFloat(workCodeChanges.Multiplier) >= 10000
				: false
		)
			errors.Multiplier = "Multiplier must be less than 10000.";

		setErrors(errors);
		// Form is valid if the errors object still has no properties
		return Object.keys(errors).length === 0;
	};

	return (
		<Modal
			SubmitButton={SubmitButton}
			show={modalShow}
			user={workCodeChanges}
			onHide={() => onHide(changesMade)}
			title={workCode.WorkCodeID ? "Edit Work Code" : "Create Work Code"}
		>
			<Form>
				<Row>
					<Col>
						<Form.Group controlId="WorkCodeID">
							<Form.Label className="font-weight-bold">WorkCode ID</Form.Label>
							<Form.Control
								type="number"
								placeholder="WorkCode ID"
								name="WorkCodeID"
								value={
									workCodeChanges.WorkCodeID ? workCodeChanges.WorkCodeID : ""
								}
								onChange={handleChange}
								disabled
							/>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group controlId="Code">
							<Form.Label className="font-weight-bold">Work Code</Form.Label>
							<Form.Control
								type="text"
								placeholder="WorkCode"
								name="Code"
								value={workCodeChanges.Code ? workCodeChanges.Code : ""}
								onChange={handleChange}
								isInvalid={errors.Code}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.Code}
							</Form.Control.Feedback>
						</Form.Group>
					</Col>
				</Row>
				<Form.Group controlId="Description">
					<Form.Label className="font-weight-bold">
						WorkCode Description
					</Form.Label>
					<Form.Control
						type="text"
						placeholder="WorkCode Description"
						name="Description"
						value={
							workCodeChanges.Description ? workCodeChanges.Description : ""
						}
						onChange={handleChange}
						isInvalid={errors.Description}
					/>
					<Form.Control.Feedback type="invalid">
						{errors.Description}
					</Form.Control.Feedback>
				</Form.Group>
				<Form.Group controlId="Multiplier">
					<Form.Label className="font-weight-bold">Multiplier</Form.Label>
					<Form.Control
						type="number"
						placeholder="Multiplier"
						name="Multiplier"
						step="0.01"
						value={workCodeChanges.Multiplier ? workCodeChanges.Multiplier : ""}
						onChange={handleChange}
						onBlur={handleBlur}
						isInvalid={errors.Multiplier}
					/>
					<Form.Control.Feedback type="invalid">
						{errors.Multiplier}
					</Form.Control.Feedback>
				</Form.Group>
				<Row>
					<Col>
						<Form.Group controlId="IsDefault">
							<Form.Label className="font-weight-bold">Is Default</Form.Label>
							<Form.Check
								custom
								label="WorkCode is Default?"
								name="IsDefault"
								checked={
									workCodeChanges.IsDefault ? workCodeChanges.IsDefault : false
								}
								onChange={handleChange}
							/>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group controlId="ExportToDynamics">
							<Form.Label className="font-weight-bold">
								Export Work Code
							</Form.Label>
							<Form.Check
								custom
								label="Export work code in dynamics?"
								name="ExportToDynamics"
								checked={
									workCodeChanges.ExportToDynamics
										? workCodeChanges.ExportToDynamics
										: false
								}
								onChange={handleChange}
							/>
						</Form.Group>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

WorkCodeForm.propTypes = {
	// Object of selected work code.
	workCode: PropTypes.object.isRequired,
	// Boolean that tracks if the workcode is saving or not.
	workCodeSaving: PropTypes.bool.isRequired,
	// Function for submitting the form
	handleSubmit: PropTypes.func.isRequired,
	// Boolean to control if the Modal is shown
	modalShow: PropTypes.bool.isRequired,
	// Function to hide the Modal when it is closed or the form is completed
	onHide: PropTypes.func.isRequired,

	changesMade: PropTypes.bool.isRequired,
	setChangesMade: PropTypes.func.isRequired,
};

export default WorkCodeForm;
