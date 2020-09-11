import React, { useEffect, useState } from "react";
import { useDispatch, Provider } from "react-redux";
import store from "./redux/store";
import { loadUser, checkLocal } from "./redux/actions/authActions";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import Toolbar from "./components/Toolbar";
import Home from "./components/Home";
import AtoZ from "./components/log/AtoZ";
import OldLog from "./components/log/display/OldLog";
import Log from "./components/log/display/Log";
import Search from "./components/log/Search";
import EditLog from "./components/log/form/EditLog";
import NewLog from "./components/log/form/NewLog";
import ConvertLog from "./components/log/form/ConvertLog";
import EditSelector from "./components/log/form/EditSelector";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./scroll.css";
import { ReactComponent as CircleUp } from "./icons/arrow_circle_up-black-24dp.svg";
import Roles from "./components/auth/Roles";
import { Container } from "reactstrap";

axios.defaults.baseURL = process.env.PUBLIC_URL;

axios.interceptors.response.use(
    (response) => response,
    (error) => {
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
                    <Container className="content">
                        <Switch>
                            <Route path={`/permissions`} component={Roles} />
                            <Route path={`/atoz/:search?`} component={AtoZ} />
                            <Route path={`/oldLog/:id`} component={OldLog} />
                            <Route path={`/log/:id`} component={Log} />
                            <Route path={`/newLog`} component={NewLog} />
                            <Route path={`/edit/:id`} component={EditLog} />
                            <Route path={`/convert/:id`} component={ConvertLog} />
                            <Route path={`/modi`} component={EditSelector} />
                            <Route path={`/search/:term?`} component={Search} />
                            <Route path={`/`} component={Home} />
                        </Switch>
                    </Container>
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
