import React, { useState, Suspense, lazy } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import "../style/UserAdmin.css";
const ItemList = lazy(() => import("../common/ItemList"));
import { saveProjectDispatch } from "../../redux/actions/objectsActions";
import { SelectColumnFilter } from "../../services/filters";
import { defaultProject } from "../../services/objects";
const ProjectForm = lazy(() => import("./ProjectForm"));
import ErrorBoundary from "../common/ErrorBoundary";
import Loading from "../common/Loading";
const ConfirmCloseModal = lazy(() => import("../common/ConfirmCloseModal"));

/**
 * @name ProjectAdmin
 * @component
 * @category Object Admin
 * @param {Object} props Props. See propTypes for details.
 * @description Project administration page.
 */
const ProjectAdmin = ({ projects, departments, saveProjectDispatch }) => {
	const [modalShow, setModalShow] = useState(false);
	const [selectedProject, setSelectedProject] = useState(defaultProject);
	const [projectSaving, setProjectSaving] = useState(false);
	const [changesMade, setChangesMade] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	// Handles selecting an project from table, makes it active, and shows modal.
	const handleClick = (row) => {
		setSelectedProject(row);
		setModalShow(true);
	};

	//Creates a list of projects that is memoized for later use. Needed for React Table efficiency
	const data = React.useMemo(() => {
		const getDepartmentName = (project) => {
			const Dept = departments.find(
				(department) => department.DepartmentID === project.DepartmentID
			);
			return Dept ? Dept.DeptName : "";
		};
		return projects.map((project) => {
			return {
				...project,
				DepartmentName: getDepartmentName(project),
				ActiveStatus: project["IsActive"] ? "Active" : "Inactive",
			};
		});
	}, [projects, departments]);

	//Columns specifier for react tables
	const columns = React.useMemo(
		() => [
			{
				Header: "DeptCode",
				accessor: "DeptCode", // accessor is the "key" in the data
			},
			{
				Header: "Project Name",
				accessor: "Name", // accessor is the "key" in the data
			},
			{
				Header: "Project Description",
				accessor: "Description", // accessor is the "key" in the data
			},
			{
				Header: "Project ID",
				accessor: "ProjectID",
			},
			{
				Header: "Department",
				accessor: "DepartmentName",
				Filter: SelectColumnFilter,
				filter: "includes",
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

	//Handles submit for project modal. Dispatches redux action and api call with saveProject. Creates toast on completion.
	const handleSubmit = async (project) => {
		setProjectSaving(true);
		const result = await saveProjectDispatch(project);
		if (result.success) {
			toast.success("Project saved!");
			setModalShow(false);
		} else {
			toast.warn("Error: " + result.data);
		}
		setProjectSaving(false);
		setSelectedProject(defaultProject);
		setChangesMade(false);
	};

	//Handles closing the modal. If no changes have been made will close without confirmation.
	const handleHide = (changes) => {
		if (changes) {
			setShowConfirmModal(true);
			setModalShow(false);
		} else {
			setModalShow(false);
			setSelectedProject(defaultProject);
		}
	};

	// Handles confirming modal close.
	const handleConfirmHide = () => {
		setShowConfirmModal(false);
		setModalShow(false);
		setSelectedProject(defaultProject);
		setChangesMade(false);
	};

	return (
		<>
			<Container fluid className="userContainer bg-light">
				<Card className="userCard">
					<ErrorBoundary>
						<Card.Header className="text-center" as="h3">
							Project Admin
						</Card.Header>
						<Card.Body>
							{projects.length > 0 && (
								<>
									<Button
										style={{ marginBottom: 10 }}
										variant="outline-success"
										onClick={() => handleClick(defaultProject)}
									>
										New Project
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
						<ProjectForm
							changesMade={changesMade}
							setChangesMade={setChangesMade}
							projectSaving={projectSaving}
							project={selectedProject}
							departments={departments}
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
							title="Close Project Edit"
						/>
					</Suspense>
				</ErrorBoundary>
			</Container>
		</>
	);
};

ProjectAdmin.propTypes = {
	projects: PropTypes.array.isRequired,
	// Array of project objects.
	departments: PropTypes.array.isRequired,
	// Array of department objects.
	saveProjectDispatch: PropTypes.func.isRequired,
	// Dispatch function for saving projects
};

const mapStateToProps = (state) => {
	return {
		projects: state.projects,
		departments: state.departments,
	};
};

const mapDispatchToProps = {
	saveProjectDispatch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectAdmin);
