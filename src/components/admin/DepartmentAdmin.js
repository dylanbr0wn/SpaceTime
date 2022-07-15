import React, { useState, Suspense, lazy } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import "../style/UserAdmin.css";
const ItemList = lazy(() => import("../common/ItemList"));
import { saveDepartmentDispatch } from "../../redux/actions/objectsActions";
import { SelectColumnFilter } from "../../services/filters";
import { defaultDepartment } from "../../services/objects";
const DepartmentForm = lazy(() => import("./DepartmentForm"));
import ErrorBoundary from "../common/ErrorBoundary";
const ConfirmCloseModal = lazy(() => import("../common/ConfirmCloseModal"));
import Loading from "../common/Loading";

/**
 * @name DepartmentAdmin
 * @component
 * @category Object Admin
 * @param {Object} props Props. See propTypes for details.
 * @description Department administration page.
 */
const DepartmentAdmin = ({ departments, saveDepartmentDispatch }) => {
	const [modalShow, setModalShow] = useState(false);
	const [departmentSaving, setDepartmentSaving] = useState(false);
	const [selectedDepartment, setSelectedDepartment] =
		useState(defaultDepartment);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [changesMade, setChangesMade] = useState(false);

	// Handles selecting a department from table, makes it active, and shows modal.
	const handleClick = (row) => {
		setSelectedDepartment(row);
		setModalShow(true);
	};

	//Creates a list of departments that is memoized for later use.
	const data = React.useMemo(
		() =>
			departments.map((department) => {
				return {
					...department,
					ActiveStatus: department["IsActive"] ? "Active" : "Inactive",
				};
			}),
		[departments]
	);

	//Columns specifier for react tables
	const columns = React.useMemo(
		() => [
			{
				Header: "Department Name",
				accessor: "DeptName", // accessor is the "key" in the data
			},
			{
				Header: "Department ID",
				accessor: "DepartmentID",
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

	//Handles submit for departments modal. Dispatches redux action and api call with saveDepartment. Creates toast on completion.
	const handleSubmit = async (department) => {
		const result = await saveDepartmentDispatch(department);
		if (result.success) {
			toast.success("Department Saved!");
			setModalShow(false);
		} else {
			toast.warn("Error: " + result.data);
		}
		setDepartmentSaving(false);
		setSelectedDepartment(defaultDepartment);
		setChangesMade(false);
	};

	//Handles closing the modal. If no changes have been made will close without confirmation.
	const handleHide = (changes) => {
		setDepartmentSaving(true);
		if (changes) {
			setShowConfirmModal(true);
			setModalShow(false);
		} else {
			setModalShow(false);
			setSelectedDepartment(defaultDepartment);
		}
		setDepartmentSaving(false);
	};

	// Handles confirming modal close.
	const handleConfirmHide = () => {
		setShowConfirmModal(false);
		setModalShow(false);
		setSelectedDepartment(defaultDepartment);
		setChangesMade(false);
	};

	return (
		<>
			<Container fluid className="userContainer bg-light">
				<Card className="userCard">
					<ErrorBoundary>
						<Card.Header className="text-center" as="h3">
							Department Admin
						</Card.Header>
						<Card.Body>
							{departments.length > 0 && (
								<>
									<Button
										style={{ marginBottom: 10 }}
										variant="outline-success"
										onClick={() => handleClick(defaultDepartment)}
									>
										New Department
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
				<ErrorBoundary>
					<Suspense fallback={<p />}>
						<DepartmentForm
							changesMade={changesMade}
							setChangesMade={setChangesMade}
							departmentSaving={departmentSaving}
							department={selectedDepartment}
							handleSubmit={handleSubmit}
							modalShow={modalShow}
							onHide={handleHide}
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
							title="Close Department Edit"
						/>
					</Suspense>
				</ErrorBoundary>
			</Container>
		</>
	);
};

DepartmentAdmin.propTypes = {
	departments: PropTypes.array.isRequired,
	// Array of department objects.
	saveDepartmentDispatch: PropTypes.func.isRequired,
	// Function for saving departments.
};

const mapStateToProps = (state) => {
	return {
		loading: state.apiCallsInProgress > 0,
		departments: state.departments,
	};
};

const mapDispatchToProps = {
	saveDepartmentDispatch,
};

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentAdmin);
