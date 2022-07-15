import React, { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { connect } from "react-redux";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

import { readPayrollSubordinatesDispatch } from "../../redux/actions/subordinatesActions";
import {
	SelectColumnFilter,
	SelectColumnStatusFilter,
	SliderColumnFilter,
} from "../../services/filters";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import ErrorBoundary from "../common/ErrorBoundary";
const SubordinateList = lazy(() =>
	import("../common/dashboard/SubordinateList")
);
import Loading from "../common/Loading";
import LockButton from "../common/dashboard/LockButton";
import { getPayrollSubordinates } from "../../services/selectors";

/**
 * @name ManagerDashboard
 * @param {Object} props Props. See propTypes for details.
 * @component
 * @category Manager Tools
 * @description Manager/Supervisor dashboard for subordinate timesheet management.
 */
const PayrollTimesheetDashboard = ({
	settings,
	subordinates,
	readPayrollSubordinatesDispatch,
	CurrentUserID,
}) => {
	const history = useHistory();

	const [reload, setReload] = useState(false);

	useEffect(() => {
		readPayrollSubordinatesDispatch(
			CurrentUserID,
			moment.utc(settings.CutOffDate).toDate()
		);
	}, [CurrentUserID, readPayrollSubordinatesDispatch, settings.CutOffDate]);

	// Handles reloading the list of subrodinates.
	const handleReload = () => {
		setReload(true);
		readPayrollSubordinatesDispatch(
			CurrentUserID,
			moment.utc(settings.CutOffDate).toDate()
		).then(() => {
			setReload(false);
		});
	};

	// Handles selecting a employee from subordinate list and directing the manager/payroll clerk to a managerial page.
	const handleClick = useCallback(
		(item) => {
			history.push(`/timesheet/${item.EmployeeID}/payroll`);
		},
		[history]
	);

	// Memoized Subordinate list for React Table
	const data = React.useMemo(() => subordinates, [subordinates]);

	// Memoized Column attribute list for React Table
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
				style: {
					fontSize: "0.9rem",
				},
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
				Filter: SelectColumnStatusFilter,
				filter: "equalStatus",
				// eslint-disable-next-line react/display-name, react/prop-types
				Cell: ({ value }) => (
					// eslint-disable-next-line react/prop-types
					<span className={value.color}>
						{
							// eslint-disable-next-line react/prop-types
							value.status
						}
					</span>
				),
			},
			// {
			//     Header: "Employee Status",
			//     accessor: "ActiveStatus",
			//     Filter: SelectColumnFilter,
			//     filter: "includes",
			// },
			{
				Header: "Department",
				accessor: "DeptName",
				Filter: SelectColumnFilter,
				filter: "includes",
			},

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
						Payroll Timesheet Dashboard
					</Card.Header>
					<Card.Body
						className="subordinate-list"
						style={{ height: "85vh", overflow: "auto" }}
					>
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
									text="Loading Payroll Timesheet Dashboard"
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
					</Card.Body>
				</ErrorBoundary>
			</Card>
		</Container>
	);
};
PayrollTimesheetDashboard.propTypes = {
	settings: PropTypes.object.isRequired,
	subordinates: PropTypes.array.isRequired,
	CurrentUserID: PropTypes.number.isRequired,
	readPayrollSubordinatesDispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	settings: state.settings,
	subordinates: getPayrollSubordinates(state),
	CurrentUserID: state.currentUser.user.EmployeeID,
});

const mapDispatchToProps = {
	readPayrollSubordinatesDispatch,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PayrollTimesheetDashboard);
