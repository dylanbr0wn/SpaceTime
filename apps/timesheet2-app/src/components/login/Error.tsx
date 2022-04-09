import React from "react";
import PropTypes from "prop-types";

/**
 * @name ErrorPage
 * @component
 * @category Login
 * @param {Object} props Props. See propTypes for details.
 * @description Loading screen displayed while login is commencing.
 */
const ErrorPage = ({ error }:any) => {
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
ErrorPage.propTypes = {
    // An error string to display on the apge
    error: PropTypes.string,
};

export default ErrorPage;
