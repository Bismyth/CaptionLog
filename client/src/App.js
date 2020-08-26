import React, { useEffect, useState } from "react";
import { useDispatch, Provider } from "react-redux";
import store from "./redux/store";
import { loadUser, checkLocal, logout } from "./redux/actions/authActions";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import Toolbar from "./components/Toolbar";
import Home from "./components/Home";
import Logs from "./components/log/AtoZ";
import OldLog from "./components/log/display/OldLog";
import Log from "./components/log/display/Log";
import Search from "./components/log/Search";
import EditLog from "./components/log/form/EditLog";
import NewLog from "./components/log/form/NewLog";
import ConvertLog from "./components/log/form/ConvertLog";
import EditSelector from "./components/log/form/EditSelector";
import Video from "./components/log/display/Video";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./scroll.css";
import { ReactComponent as CircleUp } from "./icons/arrow_circle_up-black-24dp.svg";

axios.defaults.baseURL = process.env.PUBLIC_URL;

axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response.status === 401 && error.response.data.msg === "Token is not valid") {
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);

const AppWrapper = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
};

const App = () => {
    const [showScroll, setShowScroll] = useState(false);
    const checkScrollTop = (e) => {
        if (!showScroll && e.target.scrollTop > 400) {
            setShowScroll(true);
        } else if (showScroll && e.target.scrollTop <= 400) {
            setShowScroll(false);
        }
    };
    const scrollTop = () => {
        document.getElementById("scroll").scrollTo({ top: 0, behavior: "smooth" });
    };
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser());
        dispatch(checkLocal());
    }, [dispatch]);
    return (
        <Provider store={store}>
            <Router basename={process.env.PUBLIC_URL}>
                <Toolbar />

                <div id="scroll" onScroll={checkScrollTop}>
                    <Switch>
                        <Route path={`/atoz/:search?`} component={Logs} />
                        <Route path={`/oldLog/:id`} component={OldLog} />
                        <Route path={`/log/:id`} component={Log} />
                        <Route path={`/video/:id/:vid`} component={Video} />
                        <Route path={`/newLog`} component={NewLog} />
                        <Route path={`/edit/:id`} component={EditLog} />
                        <Route path={`/convert/:id`} component={ConvertLog} />
                        <Route path={`/modi`} component={EditSelector} />
                        <Route path={`/search/:value?/:field?`} component={Search} />
                        <Route path={`/`} component={Home} />
                    </Switch>
                    <CircleUp
                        className="scrollTop"
                        onClick={scrollTop}
                        style={{ height: 40, display: showScroll ? "flex" : "none" }}
                    />
                </div>
            </Router>
        </Provider>
    );
};

export default AppWrapper;
