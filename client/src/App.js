import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/authActions";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Toolbar from "./components/Toolbar";
import Home from "./components/Home";
import Logs from "./components/logStuff/Logs";
import Log from "./components/logStuff/Log";
import Search from "./components/logStuff/Search";
import LogForm from "./components/logStuff/LogForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);
    return (
        <Router basename={`${process.env.PUBLIC_URL}`}>
            <Toolbar />
            <Switch>
                <Route
                    path={`${process.env.PUBLIC_URL}/logs/:search?`}
                    component={Logs}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/log/:id`}
                    component={Log}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/newLog`}
                    component={LogForm}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/edit/:id`}
                    component={LogForm}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/search/:value?/:field?`}
                    component={Search}
                />
                <Route path={`${process.env.PUBLIC_URL}/`} component={Home} />
            </Switch>
        </Router>
    );
};

export default App;
