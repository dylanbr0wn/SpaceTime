import React, { lazy, Suspense } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

import "../style/UserAdmin.css";
const ToolsDynamicsExport = lazy(() => import("./ToolsDynamicsExport"));
const ToolsEmployeeReport = lazy(() => import("./ToolsEmployeeReport"));
const ToolsCutOffDate = lazy(() => import("./ToolsCutOffDate"));
// const ToolsSharePointUrl = lazy(() => import("./ToolsSharePointUrl"));
const ToolsTardyEmployees = lazy(() => import("./ToolsTardyEmployees"));
import ErrorBoundary from "../common/ErrorBoundary";
import Loading from "../common/Loading";
import { useMediaQuery } from "react-responsive";

/**
 * @name ClerkDashboard
 * @component
 * @category Clerk Tools
 * @param {Object} props Props. See propTypes for details.
 * @description Top level clerk dashboard component.
 */
const ToolsDashboard = () => {
	const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1279 });

	return (
		<>
			<Container fluid className="bg-light userContainer">
				<div className="p-md-2">
					<Row className="pb-md-3">
						<Col>
							<Card>
								<ErrorBoundary>
									<Card.Header as="h4">Exports</Card.Header>
									<Card.Body>
										<Suspense fallback={<Loading />}>
											<ToolsDynamicsExport isTablet={isTablet} />
										</Suspense>
										<hr />
										<Suspense fallback={<Loading />}>
											<ToolsEmployeeReport isTablet={isTablet} />
										</Suspense>
									</Card.Body>
								</ErrorBoundary>
							</Card>
						</Col>
						<Col>
							<Card>
								<ErrorBoundary>
									<Card.Header as="h4">Timesheet Settings</Card.Header>
									<Card.Body>
										<Suspense fallback={<Loading />}>
											<ToolsCutOffDate />
										</Suspense>
										{/* <hr />
                                        <Suspense fallback={<Loading />}>
                                            <ToolsSharePointUrl />
                                        </Suspense> */}
									</Card.Body>
								</ErrorBoundary>
							</Card>
						</Col>
					</Row>
					<Row className="pt-md-3">
						<Col>
							<Card>
								<ErrorBoundary>
									<Card.Header as="h4">Tardy Employees</Card.Header>
									<Card.Body>
										<Suspense fallback={<Loading />}>
											<ToolsTardyEmployees />
										</Suspense>
									</Card.Body>
								</ErrorBoundary>
							</Card>
						</Col>
					</Row>
				</div>
			</Container>
		</>
	);
};
export default ToolsDashboard;
