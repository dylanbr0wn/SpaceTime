import React from "react";
import * as ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import { ApolloProvider } from "@apollo/client";
import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";

import App from "./components/App";
import ErrorPage from "./components/login/Error";
import Loading from "./components/login/Loading";
import store from "./redux/configureStore";
import { authProvider } from "./services/authProvider";
import { client } from "./api";

import "./index.css";

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
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
            </MsalProvider>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
