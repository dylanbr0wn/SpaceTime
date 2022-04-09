import React from "react";
import { Navigate, Route } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ path, component: Component, condition }:any) => {
    return (
        <Route
            
            path={path}
            element={
                condition ? <Component /> : <Navigate to="/login" />
            }
        ></Route>
    );
};
ProtectedRoute.propTypes = {
    path: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
        .isRequired,
    condition: PropTypes.bool.isRequired,
};

export default ProtectedRoute;
