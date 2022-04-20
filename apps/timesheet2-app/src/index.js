// Global css
// app wide imports
import React from "react";
import { render } from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";

import "react-dates/initialize";

import App from "./components/App";
import ErrorPage from "./components/login/Error";
import Loading from "./components/login/Loading";
import store from "./redux/configureStore";
import { authProvider } from "./services/authProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-widgets/styles.css";
import "./components/style/App.css";

/**
 * Provides both Redux and react-router context for the application.
 */

render(
    <MsalProvider instance={authProvider}>
        <MsalAuthenticationTemplate
            errorComponent={ErrorPage}
            loadingComponent={Loading}
            interactionType={InteractionType.Redirect}
        >
            <ReduxProvider store={store}>
                <Router>
                    <App />
                </Router>
            </ReduxProvider>
        </MsalAuthenticationTemplate>
    </MsalProvider>,
    document.getElementById("app")
);
