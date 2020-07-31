import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/authActions";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import Toolbar from "./components/Toolbar";
import Home from "./components/Home";
import Logs from "./components/logStuff/Logs";
import OldLog from "./components/logStuff/OldLog";
import Log from "./components/logStuff/Log";
import Search from "./components/logStuff/Search";
import LogForm from "./components/logStuff/form/LogForm";
import EditSelector from "./components/logStuff/form/EditSelector";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

axios.defaults.baseURL = process.env.PUBLIC_URL;

const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Toolbar />
            <div id="scroll">
                <Switch>
                    <Route path={`/logs/:search?`} component={Logs} />
                    <Route path={`/oldLog/:id`} component={OldLog} />
                    <Route path={`/log/:id`} component={Log} />
                    <Route path={`/newLog`} component={LogForm} />
                    <Route path={`/edit/:id`} component={LogForm} />
                    <Route path={`/modi`} component={EditSelector} />
                    <Route path={`/search/:value?/:field?`} component={Search} />
                    <Route path={`/`} component={Home} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;
