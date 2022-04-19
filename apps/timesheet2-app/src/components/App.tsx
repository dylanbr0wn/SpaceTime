import PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";

import { useQuery } from "@apollo/client";
import { useAccount, useIsAuthenticated } from "@azure/msal-react";

import { TIMESHEET_DATA, useInitDataQuery } from "../api";
import { ADLoginCurrentUser } from "../redux/actions/currentUserActions";
import { useIdToken } from "../services/authProvider";

import ErrorPage from "./login/Error";
import Loading from "./login/Loading";
import AuthRouter from "./AuthRouter";

import "react-toastify/dist/ReactToastify.css";
import "./style/reactDatesStyles.css";

/**
 * @name App
 * @component
 * @description Contains the react-router switch for routing to the application pages.
 * Will attempt JWT authentication on mount.
 */
const App = () => {
    const [failMessage, setFailMessage] = React.useState("");
    const [doneLogin, setDoneLogin] = React.useState(false);
    // const idToken = useIdToken();

    // const account = useAccount();
    const isAuthenticated = useIsAuthenticated();

    // useEffect(() => {
    //     if (!doneLogin && idToken) {

    //         // // If AAD is done and this is the first attempt at loading then proceed to get details from API
    //         // ADLoginCurrentUser(idToken).then((res: any) => {
    //         //     if (!res.success) {
    //         //         setFailMessage(
    //         //             res.data ||
    //         //                 "An unknown error occured while trying to log you in. Please contact IT."
    //         //         );
    //         //     }
    //         //     setDoneLogin(true);
    //         // });
    //     }
    // }, [ADLoginCurrentUser, idToken, doneLogin]);

    // const { loading, error, data, refetch } = useInitDataQuery({
    //     variables: {
    //         email: account?.username || "",
    //     },
    // });

    // React.useEffect(() => {
    //     if (account?.username) {
    //         refetch();
    //     }
    // }, [account, refetch]);

    // React.useEffect(() => {
    //     if (data) {
    //         console.log(data);
    //     }
    // }, [data]);

    return (
        <div
            className="w-full h-full dark:bg-black appearance-none "
            style={{ margin: 0, padding: 0 }}
        >
            {
                <>
                    {isAuthenticated ? (
                        <AuthRouter /> // DB Login is complete and successful
                    ) : (
                        <ErrorPage error={failMessage} /> // DB Login is complete and failed
                    )}
                </>
            }
            <ToastContainer
                autoClose={3000}
                position="top-center"
                closeOnClick
            />
        </div>
    );
};

// App.propTypes = {
//     // Boolean that tracks if the user is authenticated or not.
//     isAuthenticated: PropTypes.bool.isRequired,
//     // Dispatch function for logging a user in using JWT.
//     ADLoginCurrentUser: PropTypes.func.isRequired,
// };

// const mapStateToProps = (state: any) => {
//     return {
//         isAuthenticated: state.isAuthenticated,
//     };
// };

// const mapDispatchToProps = {
//     ADLoginCurrentUser,
// };

export default App;
