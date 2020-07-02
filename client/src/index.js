import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import history from "./history";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <Provider store={store}>
        <Router history={history} basename={process.env.PUBLIC_URL}>
            <App />
        </Router>
    </Provider>,
    rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
