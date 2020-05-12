import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/authActions";

import Toolbar from "./components/Toolbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(loadUser());
	}, []);
	return (
		<div className="App">
			<Toolbar />
		</div>
	);
};

export default App;
