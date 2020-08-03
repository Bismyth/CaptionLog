import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/authActions";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import Toolbar from "./components/Toolbar";
import Home from "./components/Home";
import Logs from "./components/log/AtoZ";
import OldLog from "./components/log/display/OldLog";
import Log from "./components/log/display/Log";
import Search from "./components/log/Search";
import LogForm from "./components/log/form/LogForm";
import EditSelector from "./components/log/form/EditSelector";
import Video from "./components/log/display/Video";
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
                    <Route path={`/atoz/:search?`} component={Logs} />
                    <Route path={`/oldLog/:id`} component={OldLog} />
                    <Route path={`/log/:id`} component={Log} />
                    <Route path={`/video/:id/:vid`} component={Video} />
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
