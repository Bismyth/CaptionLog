import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
	Card,
	CardBody,
	CardTitle,
	CardText,
	Button,
	Spinner,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const Logs = () => {
	const history = useHistory();

	const loggedIn = useSelector((state) => state.auth.isAuthenticated);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const result = await axios("/api/logs");
			console.log(result.data);
			setData(result.data);
			setLoading(false);
		};

		fetchData();
	}, []);
	return (
		<div className="logging">
			<h1>Logs</h1>
			{!loading ? (
				data.map(({ _id, title, description }) => (
					<Card key={_id}>
						<CardBody>
							<CardTitle>{title}</CardTitle>
							<CardText>{description}</CardText>
							{loggedIn ? (
								<Button
									onClick={() => {
										history.push("/logs/" + _id);
									}}
								>
									More Info
								</Button>
							) : (
								<Fragment />
							)}
						</CardBody>
					</Card>
				))
			) : (
				<Spinner color="primary" />
			)}
		</div>
	);
};

export default Logs;
