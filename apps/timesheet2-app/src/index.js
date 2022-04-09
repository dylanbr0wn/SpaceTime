//Global css
import "bootstrap/dist/css/bootstrap.min.css";
import "react-widgets/styles.css";
import "react-dates/initialize";
import "./components/style/App.css";

//app wide imports
import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./components/App";
import store from "./redux/configureStore";
import { Provider as ReduxProvider } from "react-redux";
import { authProvider } from "./services/authProvider";
import { MsalProvider, MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import Loading from "./components/login/Loading";
import ErrorPage from "./components/login/Error";

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
