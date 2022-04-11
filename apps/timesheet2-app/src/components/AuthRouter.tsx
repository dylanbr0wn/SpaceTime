// import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import React, { Suspense, useEffect } from "react";
import { connect } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";

import { animated, useTransition } from "@react-spring/web";

import { readObjectsDispatch } from "../redux/actions/objectsActions";

import ErrorBoundary from "./common/ErrorBoundary";
import Loading from "./common/Loading";
import Menu from "./common/Menu";
import ProtectedRoute from "./common/ProtectedRoute";
// const Settings = lazy(() => import("./settings/Settings"));
// const DepartmentAdmin = lazy(() => import("./admin/DepartmentAdmin"));
// const ProjectAdmin = lazy(() => import("./admin/ProjectAdmin"));
// const EmployeeAdmin = lazy(() => import("./admin/EmployeeAdmin"));
// const WorkCodeAdmin = lazy(() => import("./admin/WorkCodeAdmin"));
// const ToolsDashboard = lazy(() => import("./clerkTools/ToolsDashboard"));
import EmployeeTimesheet from "./EmployeeTimesheet";
// const ManagerDashboard = lazy(() => import("./managerTools/ManagerDashboard"));
// import ManagerTimesheet from "./managerTools/ManagerTimesheet";
// const PayrollTimesheetDashboard = lazy(() =>
//     import("./clerkTools/PayrollTimesheetDashboard")
// );
// import PayrollTimesheet from "./clerkTools/PayrollTimesheet";
// import ProtectedRoute from './common/ProtectedRoute'

// import PageNotFound from './PageNotFound'

/**
 * @name AuthRoute
 * @component
 * @description Wrapper for routes where authentication is needed.
 * Will reroute to login page if trying to access a route wrapped with AuthRoute and not authenticated
 */
const AuthRouter = ({
    objectsLoaded,
    readObjectsDispatch,
    loading,
    user,
    sidebarPinToggle,
}: any) => {
    const location = useLocation();

    // React Spring hook for animating page transisitons.
    const transitions = useTransition(location, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    });

    useEffect(() => {
        if (!objectsLoaded) {
            readObjectsDispatch();
        }
    }, [objectsLoaded, readObjectsDispatch]);

    return (
        <div className="w-full h-full p-3 m-0">
            <Menu />

            <div
                id="page-content-wrapper"
                // style={
                //     sidebarPinToggle
                //         ? { width: isTablet ? "78vw" : "84vw" }
                //         : {}
                // }
            >
                {/* This is to adjust to the width of the content depending on if the sidebar is pinned or not */}
                {objectsLoaded && (
                    <ErrorBoundary>
                        <>
                            {transitions(({ opacity }, item) => (
                                <animated.div className="w-full">
                                    <Suspense fallback={<Loading />}>
                                        {/* This is to adjust to the width of the content depending on if the sidebar is pinned or not */}
                                        <Routes location={item}>
                                            {/* <ProtectedRoute
                                                path="/managerDashboard"
                                                component={ManagerDashboard}
                                                condition={user.IsSupervisor}
                                            />
                                            <ProtectedRoute
                                                path="/timesheet/:id/manager"
                                                component={ManagerTimesheet}
                                                condition={user.IsSupervisor}
                                            />
                                            <ProtectedRoute
                                                path="/payrollTimesheetDashboard"
                                                component={
                                                    PayrollTimesheetDashboard
                                                }
                                                condition={
                                                    user.IsPayrollClerk ||
                                                    user.IsAdministrator
                                                }
                                            />
                                            <ProtectedRoute
                                                path="/timesheet/:id/payroll"
                                                component={PayrollTimesheet}
                                                condition={
                                                    user.IsPayrollClerk ||
                                                    user.IsAdministrator
                                                }
                                            /> */}
                                            <Route
                                                path="/timesheet/:id"
                                                element={<EmployeeTimesheet />}
                                            />

                                            {/* <ProtectedRoute
                                                exact
                                                path="/employeeAdmin"
                                                component={EmployeeAdmin}
                                                condition={
                                                    user.IsPayrollClerk ||
                                                    user.IsAdministrator
                                                }
                                            />
                                            <ProtectedRoute
                                                exact
                                                path="/departmentAdmin"
                                                component={DepartmentAdmin}
                                                condition={
                                                    user.IsPayrollClerk ||
                                                    user.IsAdministrator
                                                }
                                            />
                                            <ProtectedRoute
                                                exact
                                                path="/projectAdmin"
                                                component={ProjectAdmin}
                                                condition={
                                                    user.IsPayrollClerk ||
                                                    user.IsAdministrator
                                                }
                                            />
                                            <ProtectedRoute
                                                exact
                                                path="/workCodeAdmin"
                                                component={WorkCodeAdmin}
                                                condition={
                                                    user.IsPayrollClerk ||
                                                    user.IsAdministrator
                                                }
                                            />
                                            <ProtectedRoute
                                                exact
                                                path="/clerkDashboard"
                                                component={ToolsDashboard}
                                                condition={
                                                    user.IsPayrollClerk ||
                                                    user.IsAdministrator
                                                }
                                            />
                                            <Route
                                                path="/settings"
                                                element={<Settings />}
                                            />
                                            <Route
                                                element={
                                                    <Navigate
                                                        to={`/timesheet/${user.EmployeeID}`}
                                                    />
                                                }
                                            />

                                            {!loading && (
                                                <Route
                                                    element={<PageNotFound />}
                                                />
                                            )} */}
                                        </Routes>
                                    </Suspense>
                                </animated.div>
                            ))}
                        </>
                    </ErrorBoundary>
                )}
            </div>
        </div>
    );
};

AuthRouter.propTypes = {
    // Boolean for identifying if objects have been loaded.
    objectsLoaded: PropTypes.bool.isRequired,
    // Dispatch function for loading objects.
    readObjectsDispatch: PropTypes.func.isRequired,
    // Boolean for indicating if an API call is in progress
    loading: PropTypes.bool.isRequired,
    // User info object
    user: PropTypes.object.isRequired,
    // Bool indicating if sidebar is pinned or not
    sidebarPinToggle: PropTypes.bool.isRequired,
};

const mapStateToProps = (state: any) => ({
    loading: state.apiCallsInProgress > 0,
    objectsLoaded:
        state.projects.length > 0 &&
        state.departments.length > 0 &&
        state.workCodes.length > 0,
    user: state.currentUser.user,
    sidebarPinToggle: state.currentUser.preferences.SidebarPin.Value ?? false,
});

const mapDispatchToProps = {
    readObjectsDispatch,
    // logoutCurrentUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthRouter);
