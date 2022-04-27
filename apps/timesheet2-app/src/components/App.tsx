import ErrorPage from "./login/Error";
import AuthRouter from "./AuthRouter";

import "./style/reactDatesStyles.css";
import { useAuth0 } from "@auth0/auth0-react";
import * as React from "react";
import Loading from "./common/Loading";
import TimesheetAuthProvider from "../auth/TimesheetAuthProvider";

/**
 * @name App
 * @component
 * @description Contains the react-router switch for routing to the application pages.
 * Will attempt JWT authentication on mount.
 */
const App = () => {
    // const idToken = useIdToken();

    // const account = useAccount();
    const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

    return (
        <div
            className="w-screen min-h-screen h-screen dark:bg-black appearance-none "
            style={{ margin: 0, padding: 0 }}
        >
            {!isLoading ? (
                <>
                    {isAuthenticated ? (
                        <AuthRouter />
                    ) : (
                        // DB Login is complete and successful
                        <div className="w-full h-full flex flex-col">
                            <div className="flex flex-col w-40 h-40 m-auto bg-slate-900 rounded ">
                                <div className="text-center text-sky-300 text-2xl my-6">
                                    Timesheet
                                </div>
                                <button
                                    onClick={() => loginWithRedirect()}
                                    className="bg-slate-800 mx-auto h-10 w-28 rounded p-2 text-sky-300 hover:bg-slate-700 transition-colors"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <Loading />
            )}
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
