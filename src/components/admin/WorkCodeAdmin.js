import React, { useState, Suspense, lazy } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import "../style/UserAdmin.css";
import { SelectColumnFilter } from "../../services/filters";
import { saveWorkCodeDispatch } from "../../redux/actions/objectsActions";
import { defaultWorkCode } from "../../services/objects";
import ErrorBoundary from "../common/ErrorBoundary";
import Loading from "../common/Loading";
const ConfirmCloseModal = lazy(() => import("../common/ConfirmCloseModal"));
const ItemList = lazy(() => import("../common/ItemList"));
const WorkCodeForm = lazy(() => import("./WorkCodeForm"));

/**
 * @name WorkCodeAdmin
 * @component
 * @category Object Admin
 * @param {Object} props Props. See propTypes for details.
 * @description WorkCode administration page.
 */
const WorkCodeAdmin = ({ workCodes, saveWorkCodeDispatch }) => {
	const [modalShow, setModalShow] = useState(false);
	const [selectedWorkCode, setSelectedWorkCode] = useState(defaultWorkCode);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [workCodeSaving, setWorkCodeSaving] = useState(false);
	const [changesMade, setChangesMade] = useState(false);
	// Handles selecting work code from table, makes it active, and shows modal.
	const handleClick = (row) => {
		setSelectedWorkCode(row);
		setModalShow(true);
	};

	//Creates a list of work codes that is memoized for later use. Needed for React Table efficiency
	const data = React.useMemo(
		() =>
			workCodes.map((workCode) => {
				return {
					...workCode,
					DefaultStatus: workCode["IsDefault"] ? "Yes" : "No",
					ExportStatus: workCode["ExportToDynamics"] ? "Yes" : "No",
				};
			}),
		[workCodes]
	);

	//Columns specifier for react tables
	const columns = React.useMemo(
		() => [
			{
				Header: "WorkCode",
				accessor: "Code", // accessor is the "key" in the data
			},
			{
				Header: "Description",
				accessor: "Description", // accessor is the "key" in the data
			},
			{
				Header: "Multiplier",
				accessor: "Multiplier",
				Filter: SelectColumnFilter,
				filter: "equal",
			},
			{
				Header: "Default",
				accessor: "DefaultStatus",
				Filter: SelectColumnFilter,
				filter: "includes",
			},
			{
				Header: "Export",
				accessor: "ExportStatus",
				Filter: SelectColumnFilter,
				filter: "includes",
			},
		],
		[]
	);

	//Handles submit for work code modal. Dispatches redux action and api call with saveWorkCode. Creates toast on completion.
	const handleSubmit = async (workcode) => {
		setWorkCodeSaving(true);
		const result = await saveWorkCodeDispatch(workcode);
		if (result.success) {
			toast.success("Work Code saved!");
			setModalShow(false);
		} else {
			toast.warn("Error: " + result.data);
		}
		setWorkCodeSaving(false);
		setSelectedWorkCode(defaultWorkCode);
		setChangesMade(false);
	};

	//Handles closing the modal. If no changes have been made will close without confirmation.
	const handleHide = (changes) => {
		if (changes) {
			setShowConfirmModal(true);
			setModalShow(false);
		} else {
			setModalShow(false);
			setSelectedWorkCode(defaultWorkCode);
		}
	};

	// Handles confirming modal close.
	const handleConfirmHide = () => {
		setShowConfirmModal(false);
		setModalShow(false);
		setSelectedWorkCode(defaultWorkCode);
		setChangesMade(false);
	};

	return (
		<>
			<Container fluid className="userContainer bg-light">
				<Card className="userCard">
					<ErrorBoundary>
						<Card.Header className="text-center" as="h3">
							Work Code Admin
						</Card.Header>
						<Card.Body>
							{workCodes.length > 0 && (
								<>
									<Button
										style={{ marginBottom: 10 }}
										variant="outline-success"
										onClick={() => handleClick(defaultWorkCode)}
									>
										New Work Code
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
						<WorkCodeForm
							changesMade={changesMade}
							setChangesMade={setChangesMade}
							workCodeSaving={workCodeSaving}
							workCode={selectedWorkCode}
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
							title="Close Work Code Edit"
						/>
					</Suspense>
				</ErrorBoundary>
			</Container>
		</>
	);
};

WorkCodeAdmin.propTypes = {
	workCodes: PropTypes.array.isRequired,
	// Array of workcode objects.
	saveWorkCodeDispatch: PropTypes.func.isRequired,
	// Dispatch function for saving work codes.
};

const mapStateToProps = (state) => {
	return {
		loading: state.apiCallsInProgress > 0,
		workCodes: state.workCodes,
	};
};

const mapDispatchToProps = {
	saveWorkCodeDispatch,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkCodeAdmin);
