import React, { useState } from "react";
import Modal from "../common/Modal";
import PropTypes from "prop-types";

/**
 * @name PasswordForm
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description Form for changing a users password. Is presented in a Modal.
 */
const PasswordForm = ({ loading, handleSubmit, modalShow, onHide }) => {
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
	const [errors, setErrors] = useState({});

	const handleChange = ({ target }) => {
		if (target.name === "newPassword") {
			setNewPassword(target.value);
		} else if (target.name === "newPasswordConfirm") {
			setNewPasswordConfirm(target.value);
		}
	};

	const SubmitButton = () => (
		<Button disabled={newPassword === ""} onClick={onSubmit}>
			{loading ? "Loading..." : "Save Password"}
		</Button>
	);
	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			onSubmit();
		}
	};

	const onSubmit = () => {
		if (!formIsValid()) return;
		handleSubmit(newPassword);
	};

	const formIsValid = () => {
		const errors = {};

		if (!newPassword) errors.newPassword = "New password is required.";
		if (newPassword.length > 72)
			errors.newPassword = "Password must be less than 72 characters.";
		if (newPassword.length < 8)
			errors.newPassword = "Password must be at least 8 characters long.";
		if (!newPasswordConfirm)
			errors.newPasswordConfirm = "Please confirm your password.";
		if (newPassword !== newPasswordConfirm)
			errors.newPasswordConfirm = "Passwords do not match.";

		setErrors(errors);
		// Form is valid if the errors object still has no properties
		return Object.keys(errors).length === 0;
	};

	return (
		<Modal
			SubmitButton={SubmitButton}
			show={modalShow}
			onHide={onHide}
			title="Change Password"
		>
			<Form>
				<Form.Group controlId="newPassword">
					<Form.Label>New Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						name="newPassword"
						value={newPassword}
						onChange={handleChange}
						isInvalid={errors.newPassword}
					/>
					<Form.Control.Feedback type="invalid">
						{errors.newPassword}
					</Form.Control.Feedback>
				</Form.Group>

				<Form.Group controlId="newPasswordConfirm">
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						name="newPasswordConfirm"
						value={newPasswordConfirm}
						onChange={handleChange}
						isInvalid={errors.newPasswordConfirm}
						onKeyDown={handleKeyDown}
					/>
					<Form.Control.Feedback type="invalid">
						{errors.newPasswordConfirm}
					</Form.Control.Feedback>
				</Form.Group>
				{errors.match && (
					<div className="alert alert-danger" role="alert">
						{errors.match}
					</div>
				)}
			</Form>
		</Modal>
	);
};

PasswordForm.propTypes = {
	loading: PropTypes.bool.isRequired,
	// Tracks if there is any ongoing API calls
	handleSubmit: PropTypes.func.isRequired,
	// Function for submitting the form
	modalShow: PropTypes.bool.isRequired,
	// Boolean to control if the Modal is shown
	onHide: PropTypes.func.isRequired,
	// Function to hide the Modal when it is closed or the form is completed
};

export default PasswordForm;
