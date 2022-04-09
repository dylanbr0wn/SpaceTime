import React from "react";
import configureStore from "../redux/configureStore";
import { Provider as ReduxProvider } from "react-redux";
import initialState from "../redux/reducers/initialState";
import "regenerator-runtime/runtime";

const store = configureStore(initialState);

export default function Wrapper({ children }) {
    return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
