// import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import React, { Suspense, useEffect } from "react";
import { connect } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import { animated, useTransition } from "@react-spring/web";

import { useGetUserFromAuth0Query } from "../api";
import Register from "../register/Register";

import AuthProvider, { Navigate } from "./common/AuthProvider";
import ErrorBoundary from "./common/ErrorBoundary";
import Loading from "./common/Loading";
import Menu from "./Menu";
import EmployeeTimesheet from "./EmployeeTimesheet";
import ConfirmTenant from "../register/ConfirmTenant";
import Join from "../register/Join";
import Create from "../register/Create";
import UserDetails from "../register/UserDetails";
import DashBoard from "./Dashboard";

/**
 * @name AuthRoute
 * @component
 * @description Wrapper for routes where authentication is needed.
 * Will reroute to login page if trying to access a route wrapped with AuthRoute and not authenticated
 */
const AuthRouter = () => {
    const location = useLocation();

    const { user } = useAuth0();

    const {
        error,
        loading,
        data: TimesheetUserData,
    } = useGetUserFromAuth0Query({
        variables: {
            auth0Id: String(user?.sub),
        },
        skip: !user,
    });

    // React.useEffect(() => {
    //     if (!TimesheetUserData?.getUserFromAuth0) {
    //         console.log("here");
    //         navigate("/register");
    //     }
    // }, [TimesheetUserData, navigate]);

    // React Spring hook for animating page transisitons.
    const transitions = useTransition(location, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    });

    return (
        <div className="w-full h-full">
            {/* <Menu /> */}

            {
                <ErrorBoundary>
                    <>
                        <Suspense fallback={<Loading />}>
                            {/* This is to adjust to the width of the content depending on if the sidebar is pinned or not */}
                            <Routes>
                                <Route path="/" element={<DashBoard />}>
                                    <Route
                                        path="time/:userId"
                                        element={
                                            <AuthProvider
                                                condition={
                                                    TimesheetUserData?.getUserFromAuth0
                                                }
                                            >
                                                <EmployeeTimesheet
                                                    user={
                                                        TimesheetUserData?.getUserFromAuth0
                                                    }
                                                />
                                            </AuthProvider>
                                        }
                                    />
                                    <Route
                                        index
                                        element={
                                            <Navigate
                                                to={`/time/${TimesheetUserData?.getUserFromAuth0?.id}`}
                                                replace
                                            />
                                        }
                                    />
                                </Route>

                                <Route
                                    path="register"
                                    element={
                                        <Register
                                            loadingTimesheetUser={loading}
                                            timesheetUserData={
                                                TimesheetUserData
                                            }
                                        />
                                    }
                                >
                                    <Route path="join" element={<Join />} />
                                    <Route path="create" element={<Create />} />
                                    <Route
                                        path="token/:token"
                                        element={<ConfirmTenant />}
                                    ></Route>
                                    <Route
                                        path="tenant/:tenantId/user/create"
                                        element={<UserDetails />}
                                    />
                                </Route>
                            </Routes>
                        </Suspense>
                    </>
                </ErrorBoundary>
            }
        </div>
    );
};

export default AuthRouter;
