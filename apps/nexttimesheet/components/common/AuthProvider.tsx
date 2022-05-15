import React from "react";
import type { NavigateProps } from "react-router-dom";
import { Route, useLocation, useNavigate } from "react-router-dom";

export const Navigate: React.FC<NavigateProps> = ({ to, replace, state }) => {
    const navigate = useNavigate();

    React.useEffect(() => {
        navigate(to, { replace, state });
    }, [navigate, to, replace, state]);

    return null;
};

const AuthProvider = ({ children, condition }: any) => {
    const location = useLocation();

    if (!condition) {
        return (
            <Navigate to="/register/join" state={{ from: location }} replace />
        );
    }

    return children;
};

export default AuthProvider;
