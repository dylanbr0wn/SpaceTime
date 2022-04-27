import React from "react";
import { useNavigate } from "react-router-dom";

import { AppState, Auth0Provider } from "@auth0/auth0-react";

import { auth0Config } from "../config";

const Auth0ProviderWithHistory = ({ children }) => {
    const navigate = useNavigate();

    const onRedirectCallback = (appState: AppState | undefined) => {
        navigate(appState?.returnTo || window.location.pathname);
    };

    return (
        <Auth0Provider
            domain={auth0Config.domain}
            clientId={auth0Config.clientId}
            redirectUri={window.location.origin}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;
