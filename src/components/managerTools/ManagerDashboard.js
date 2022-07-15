import React, { useEffect, useState, lazy, Suspense } from "react";
import { connect } from "react-redux";
import moment from "moment";

import { useHistory } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";
import PropTypes from "prop-types";

const SubordinateList = lazy(() =>
	import("../common/dashboard/SubordinateList")
);
import { getManagerSubordinates } from "../../services/selectors";
import Loading from "../common/Loading";
import LockButton from "../common/dashboard/LockButton";
import { readSubordinatesDispatch } from "../../redux/actions/subordinatesActions";
import {
	SelectColumnStatusFilter,
	SliderColumnFilter,
} from "../../services/filters";
import ErrorBoundary from "../common/ErrorBoundary";

/**
 * @name ManagerDashboard
 * @param {Object} props Props. See propTypes for details.
 * @component
 * @category Manager Tools
 * @description Manager/Supervisor dashboard for subordinate timesheet management.
 */
const ManagerDashboard = ({
	settings,
	subordinates,
	readSubordinatesDispatch,
	CurrentUserID,
}) => {
	const history = useHistory();

	const [reload, setReload] = useState(false);
	const [noSubordinates, setNoSubordinates] = useState(false);

	useEffect(() => {
		if (!noSubordinates) {
			readSubordinatesDispatch(
				CurrentUserID,
				moment.utc(settings.CutOffDate).toDate()
			).then((res) => {
				if (res.data.length === 0) {
					setNoSubordinates(true);
				}
			});
		}
	}, [
		settings.CutOffDate,
		CurrentUserID,
		noSubordinates,
		readSubordinatesDispatch,
	]);

	// Handles pressing the reload button and refetching subrodiantes.
	const handleReload = () => {
		setReload(true);
		readSubordinatesDispatch(
			CurrentUserID,
			moment.utc(settings.CutOffDate).toDate()
		).then(() => {
			setReload(false);
		});
	};

	// Handles routing to a manager page for selected employee
	const handleClick = (item) => {
		history.push(`/timesheet/${item.EmployeeID}/manager`);
	};

	// React table input data list.
	const data = React.useMemo(() => subordinates, [subordinates]);

	// React table input colum attributes.
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
				Header: "Email",
				accessor: "Email",
			},
			{
				Header: "Total Period Hours",
				accessor: "Total",
				Filter: SliderColumnFilter,
				filter: "lessThan",
				disableSortBy: true,
			},
			{
				Header: "Timesheet Status",
				accessor: "TimesheetStatus",
				Filter: SelectColumnStatusFilter, //Custom filters need to be used to process the cell with added color
				filter: "equalStatus",
				//
				// eslint-disable-next-line react/display-name, react/prop-types
				Cell: ({ value }) => (
					// eslint-disable-next-line react/prop-types
					<span className={value.color}>
						{
							// eslint-disable-next-line react/prop-types
							value.status
						}
					</span>
				), //Adds color to the text
			},
			// {
			//     Header: "Employee Status",
			//     accessor: "ActiveStatus",
			//     Filter: SelectColumnFilter,
			//     filter: "includes",
			// },
			{
				// Make an expander cell
				// eslint-disable-next-line react/display-name
				Header: () => <div className="text-right">Timesheet lock</div>,
				accessor: "LockStatus",
				id: "unlocker", // It needs an ID
				// eslint-disable-next-line react/display-name, react/prop-types
				Cell: ({ row, value }) => (
					<LockButton row={row} value={value} CurrentUserID={CurrentUserID} />
				),
				disableFilters: true,
				disableSortBy: true,
				disableGlobalFilter: true,
			},
		],
		[CurrentUserID]
	);

	return (
		<Container fluid className="userContainer bg-light">
			<Card className="userCard">
				<ErrorBoundary>
					<Card.Header className="text-center" as="h3">
						Manager Dashboard
					</Card.Header>

					<Card.Body>
						{subordinates.length > 0 && (
							<>
								<Row>
									<Col xs={3}>
										<Button
											disabled={reload}
											style={{ marginBottom: 10 }}
											variant="outline-success"
											onClick={handleReload}
										>
											Reload{" "}
											<i style={{ marginLeft: 5 }} className="fas fa-sync"></i>
										</Button>
									</Col>
									<Col xs={6}>
										<div className="text-center">Date range:</div>
										<Card.Title className="text-center">
											{moment.utc(settings.CutOffDate).format("L")} to{" "}
											{moment.utc(settings.CutOffDate).add(14, "d").format("L")}
										</Card.Title>
									</Col>
								</Row>

								<LoadingOverlay
									active={reload}
									text="Loading Manager Dashboard"
									fadeSpeed={100}
									spinner
									styles={{
										overlay: (base) => ({
											...base,
											background: "rgba(255, 255, 255, 0.7)",
										}),
										spinner: (base) => ({
											...base,
											width: "100px",
											"& svg circle": {
												stroke: "rgba(50, 50, 50, 0.7)",
											},
										}),
										content: (base) => ({
											...base,
											color: "rgba(50, 50, 50, 0.7)",
										}),
									}}
								>
									<Suspense fallback={<Loading />}>
										<SubordinateList
											data={data}
											columns={columns}
											handleClick={handleClick}
										/>
									</Suspense>
								</LoadingOverlay>
							</>
						)}
						{noSubordinates && <div>No subordinates are assigned to you</div>}
					</Card.Body>
				</ErrorBoundary>
			</Card>
		</Container>
	);
};
ManagerDashboard.propTypes = {
	settings: PropTypes.object.isRequired,
	subordinates: PropTypes.array.isRequired,
	readSubordinatesDispatch: PropTypes.func.isRequired,
	CurrentUserID: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => {
	return {
		settings: state.settings,
		subordinates: getManagerSubordinates(state),
		CurrentUserID: state.currentUser.user.EmployeeID,
	};
};

const mapDispatchToProps = {
	readSubordinatesDispatch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerDashboard);
