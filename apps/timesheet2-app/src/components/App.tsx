import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Loading from "./login/Loading";
import { ADLoginCurrentUser } from "../redux/actions/currentUserActions";
import AuthRouter from "./AuthRouter";

import "./style/reactDatesStyles.css";

import { useIdToken } from "../services/authProvider";
import ErrorPage from "./login/Error";

/**
 * @name App
 * @component
 * @description Contains the react-router switch for routing to the application pages.
 * Will attempt JWT authentication on mount.
 */
const App = ({ isAuthenticated, ADLoginCurrentUser }: {isAuthenticated: boolean; ADLoginCurrentUser: any}) => {
    const [failMessage, setFailMessage] = useState(null);
    const [doneLogin, setDoneLogin] = useState(false);
    const idToken = useIdToken();

    useEffect(() => {
        if (!doneLogin && idToken) {
            //If AAD is done and this is the first attempt at loading then proceed to get details from API
            ADLoginCurrentUser(idToken).then((res:any) => {
                if (!res.success) {
                    setFailMessage(
                        res.data ||
                            "An unknown error occured while trying to log you in. Please contact IT."
                    );
                }
                setDoneLogin(true);
            });
        }
    }, [ADLoginCurrentUser, idToken, doneLogin]);

    return (
        <Container id="appContainer" fluid style={{ margin: 0, padding: 0 }}>
            {doneLogin ? (
                <>
                    {isAuthenticated ? (
                        <AuthRouter /> // DB Login is complete and successful
                    ) : (
                        <ErrorPage error={failMessage} /> // DB Login is complete and failed
                    )}
                </>
            ) : (
                // DB login is still loading/running
                <Loading />
            )}
            <ToastContainer
                autoClose={3000}
                position="top-center"
                closeOnClick
            />
        </Container>
    );
};

App.propTypes = {
    // Boolean that tracks if the user is authenticated or not.
    isAuthenticated: PropTypes.bool.isRequired,
    // Dispatch function for logging a user in using JWT.
    ADLoginCurrentUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state:any) => {
    return {
        isAuthenticated: state.isAuthenticated,
    };
};

const mapDispatchToProps = {
    ADLoginCurrentUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
