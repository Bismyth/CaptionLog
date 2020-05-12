import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/authActions";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Toolbar from "./components/Toolbar";
import Home from "./components/Home";
import Logs from "./components/Logs";
import Log from "./components/Log";

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
			<div className="content">
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/logs" exact component={Logs} />
					<Route path="/logs/:id" component={Log} />
				</Switch>
			</div>
		</Router>
	);
};

export default App;
