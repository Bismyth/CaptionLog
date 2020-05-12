import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
	Container,
	Button,
	Spinner,
	ListGroup,
	ListGroupItem,
	ListGroupItemHeading,
	ListGroupItemText,
} from "reactstrap";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const Log = (props) => {
	const history = useHistory();

	const loggedIn = useSelector((state) => state.auth.isAuthenticated);
	const token = useSelector((state) => state.auth.token);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			//If token add to headers
			if (token) config.headers["x-auth-token"] = token;
			const result = await axios(
				"/api/logs/" + props.match.params.id,
				config
			);
			console.log(result.data);
			setData(result.data);
			setLoading(false);
		};

		fetchData();
	}, []);

	return (
		<Fragment>
			{loggedIn ? (
				<div className="logging">
					{!loading ? (
						<Fragment>
							<Button
								onClick={() => {
									history.push("/logs");
								}}
								className="mb-2"
							>
								Back
							</Button>
							<Container>
								<h2>{data.title}</h2>
								<ListGroup>
									<ListGroupItem>
										<ListGroupItemHeading>
											Description:
										</ListGroupItemHeading>
										<ListGroupItemText>
											{data.description}
										</ListGroupItemText>
									</ListGroupItem>
									<ListGroupItem>
										<ListGroupItemHeading>
											Disks:
										</ListGroupItemHeading>
										<ListGroupItemText>
											{data.disks}
										</ListGroupItemText>
									</ListGroupItem>
									<ListGroupItem>
										<ListGroupItemHeading>
											Length:
										</ListGroupItemHeading>
										<ListGroupItemText>
											{data.length}
										</ListGroupItemText>
									</ListGroupItem>
									<ListGroupItem>
										<ListGroupItemHeading>
											Genre:
										</ListGroupItemHeading>
										<ListGroupItemText>
											{data.genre}
										</ListGroupItemText>
									</ListGroupItem>
									<ListGroupItem>
										<ListGroupItemHeading>
											Caption Source:
										</ListGroupItemHeading>
										<ListGroupItemText>
											{data.caption_source}
										</ListGroupItemText>
									</ListGroupItem>
									<ListGroupItem>
										<ListGroupItemHeading>
											Original Copy Location:
										</ListGroupItemHeading>
										<ListGroupItemText>
											{data.original_copy_location}
										</ListGroupItemText>
									</ListGroupItem>
									<ListGroupItem>
										<ListGroupItemHeading>
											Video Source:
										</ListGroupItemHeading>
										<ListGroupItemText>
											{data.video_source}
										</ListGroupItemText>
									</ListGroupItem>
									<ListGroupItem>
										<ListGroupItemHeading>
											Other:
										</ListGroupItemHeading>
										<ListGroupItemText>
											{data.other}
										</ListGroupItemText>
									</ListGroupItem>
									<ListGroupItem>
										<ListGroupItemHeading>
											{data.completed
												? "Completed"
												: "Incomplete"}
										</ListGroupItemHeading>
										<ListGroupItemText>
											Completed on{" "}
											{new Date(
												data.date_of_completion
											).toString()}
										</ListGroupItemText>
									</ListGroupItem>
								</ListGroup>
							</Container>
						</Fragment>
					) : (
						<Spinner color="primary" />
					)}
				</div>
			) : (
				<Redirect to="/logs" />
			)}
		</Fragment>
	);
};

export default Log;
