import React, { Fragment, useState } from "react";
import {
	Card,
	CardBody,
	Button,
	CardText,
	CardTitle,
	Alert,
	Spinner,
	Collapse,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const LogListItem = (props) => {
	const loggedIn = useSelector((state) => state.auth.isAuthenticated);
	const [open, setOpen] = useState({});
	const toggle = (e) => {
		setOpen({
			...open,
			[e.target.id]: !open[e.target.id],
		});
	};
	return (
		<div id="accordion">
			{!props.loading ? (
				props.data.length > 0 ? (
					props.data.map(({ _id, title, description }) => (
						<Card key={_id}>
							<CardBody>
								<CardTitle className="d-flex">
									<Link
										to={"/log/" + _id}
										className="text-dark"
									>
										{title}
									</Link>
									<div className="ml-auto mr-3">
										{loggedIn ? (
											<Fragment>
												<Button
													size="sm"
													className="mr-1"
												>
													Edit
												</Button>
												<Button size="sm">
													Delete
												</Button>
											</Fragment>
										) : (
											<Fragment />
										)}
									</div>
								</CardTitle>
								<CardText>{description}</CardText>
							</CardBody>
						</Card>
					))
				) : (
					<Alert color="info">No Results Found</Alert>
				)
			) : (
				<Spinner color="primary" />
			)}
		</div>
	);
};

export default LogListItem;
