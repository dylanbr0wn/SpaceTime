import { AuthError } from "msal";
import * as React from "react";

/**
 * @name ErrorPage
 * @component
 * @category Login
 * @param {Object} props Props. See propTypes for details.
 * @description Loading screen displayed while login is commencing.
 */
const ErrorPage = ({ error }: { error: AuthError | string | null }) => {
    return (
        <div
            className="container g-light text-center"
            style={{ height: "100vh", width: "100%", position: "relative" }}
        >
            <div
                style={{
                    marginLeft: "auto",
                    marginTop: "auto",
                    position: "absolute",
                    top: "30%",
                    right: 0,
                    left: 0,
                    fontFamily: "Arial",
                }}
            >
                <>
                    <i className="fas fa-exclamation-triangle fa-10x"></i>
                    <div style={{ marginTop: 10 }}>{error}</div>
                </>
            </div>
        </div>
    );
};

export default ErrorPage;
