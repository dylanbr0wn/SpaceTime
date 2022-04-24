import React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { ApolloProvider } from "@apollo/client";

import Auth0ProviderWithHistory from "./auth/Auth0ProviderWithHistory";
import App from "./components/App";
import { client } from "./api";

import "./index.css";

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <Router>
                <Auth0ProviderWithHistory>
                    <App />
                </Auth0ProviderWithHistory>
            </Router>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
