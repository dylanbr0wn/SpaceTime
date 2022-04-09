// import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import React, { Suspense, useEffect } from "react";
import { connect } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Routes, useLocation } from "react-router-dom";

import { animated, useTransition } from "@react-spring/web";

// const Settings = lazy(() => import("./settings/Settings"));
// const DepartmentAdmin = lazy(() => import("./admin/DepartmentAdmin"));
// const ProjectAdmin = lazy(() => import("./admin/ProjectAdmin"));
// const EmployeeAdmin = lazy(() => import("./admin/EmployeeAdmin"));
// const WorkCodeAdmin = lazy(() => import("./admin/WorkCodeAdmin"));
// const ToolsDashboard = lazy(() => import("./clerkTools/ToolsDashboard"));
// import EmployeeTimesheet from "./EmployeeTimesheet/EmployeeTimesheet";
import { readObjectsDispatch } from "../redux/actions/objectsActions";

import ErrorBoundary from "./common/ErrorBoundary";
import Loading from "./common/Loading";
// const ManagerDashboard = lazy(() => import("./managerTools/ManagerDashboard"));
// import ManagerTimesheet from "./managerTools/ManagerTimesheet";
// const PayrollTimesheetDashboard = lazy(() =>
//     import("./clerkTools/PayrollTimesheetDashboard")
// );
// import PayrollTimesheet from "./clerkTools/PayrollTimesheet";
// import ProtectedRoute from './common/ProtectedRoute'
import Sidebar from "./common/Sidebar";
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
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({
        minWidth: 768,
        maxWidth: 1279,
    });

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
            <div className="w-full h-16 rounded-lg bg-slate-900 border-slate-800 border p-1 flex">
                <div className="p-0.5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-md group h-9 my-auto ml-2 cursor-pointer">
                    <div className="bg-slate-900 rounded-md group-hover:bg-transparent transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 fill-current text-sky-500 group-hover:text-slate-900 transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </div>
                </div>
                <div className="w-full"></div>
            </div>
            <ErrorBoundary>
                <Sidebar isTablet={isTablet} />
            </ErrorBoundary>

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
                            {!isMobile &&
                                transitions(({ item, props, key }: any) => (
                                    <animated.div
                                        key={key}
                                        // style={
                                        //     sidebarPinToggle && !isTablet
                                        //         ? { ...props, width: "84vw" }
                                        //         : props
                                        // }
                                        className="trans-group"
                                    >
                                        <Suspense fallback={<Loading />}>
                                            {/* This is to adjust to the width of the content depending on if the sidebar is pinned or not */}
                                            {/* <Routes location={item}>
                                                <ProtectedRoute
                                                    path="/managerDashboard"
                                                    component={ManagerDashboard}
                                                    condition={
                                                        user.IsSupervisor
                                                    }
                                                />
                                                <ProtectedRoute
                                                    path="/timesheet/:id/manager"
                                                    component={ManagerTimesheet}
                                                    condition={
                                                        user.IsSupervisor
                                                    }
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
                                                />
                                                <Route
                                                    path="/timesheet/:id"
                                                    element={
                                                        <EmployeeTimesheet/>
                                                    }
                                                />

                                                <ProtectedRoute
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
                                                    element={<Settings/>}
                                                />
                                                <Route 
                                                element={<Navigate
                                                to={`/timesheet/${user.EmployeeID}`}
                                                />} />
                                                
                                                {!loading && (
                                                    <Route
                                                        element={<PageNotFound/>}
                                                    />
                                                )}
                                            </Routes> */}
                                        </Suspense>
                                    </animated.div>
                                ))}
                            {isMobile &&
                                transitions(({ item, props, key }: any) => (
                                    <animated.div
                                        key={key}
                                        style={{ ...props, width: "100vw" }}
                                        className="trans-group"
                                    >
                                        {" "}
                                        {/* This is to adjust to the width of the content depending on if the sidebar is pinned or not */}
                                        <Suspense fallback={<Loading />}>
                                            <Routes location={item}>
                                                {/* <Route exact path="/home" component={Home} /> */}
                                                {/* <Route
                                                    
                                                    path="/timesheet/:id"
                                                    element={
                                                        <EmployeeTimesheet/>
                                                    }
                                                />
                                                <Route
                                                element={ <Navigate
                                                    to={`/timesheet/${user.EmployeeID}`}
                                                />}
                                                />
                                               
                                                {!loading && (
                                                    <Route
                                                        element={<PageNotFound/>}
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
