import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/authActions";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Toolbar from "./components/Toolbar";
import Home from "./components/Home";
import Logs from "./components/logStuff/Logs";
import Log from "./components/logStuff/Log";
import Search from "./components/logStuff/Search";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(loadUser());
	}, [dispatch]);
	return (
		<Router>
			<Toolbar />
			<Switch>
				<Route path="/logs/:id?" component={Logs} />
				<Route path="/log/:id" component={Log} />
				<Route path="/search/:value?/:field?" component={Search} />
				<Route path="/" component={Home} />
			</Switch>
		</Router>
	);
};

export default App;
