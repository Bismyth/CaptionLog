import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
	Card,
	CardBody,
	CardTitle,
	CardText,
	Button,
	Spinner,
	InputGroup,
	Input,
	InputGroupAddon,
	InputGroupText,
	Alert,
	Form,
	Container,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import searchIcon from "../Magnifying_glass_icon.svg";

const Search = (props) => {
	const history = useHistory();
	const loggedIn = useSelector((state) => state.auth.isAuthenticated);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState(props.match.params.value || "a");
	const [field, setField] = useState(props.match.params.field || "title");
	const [value, setValue] = useState(decodeURIComponent(search));
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const result = await axios(
				`/api/logs/search?value=${search}&field=${field}`
			);
			setData(result.data);
			setLoading(false);
		};
		fetchData();
	}, [search, field]);
	return (
		<div style={{ height: "calc(100vh - 56px)", overflowY: "scroll" }}>
			<div className="content">
				<Container>
					<h1>Search</h1>
				</Container>
				<Form
					onSubmit={(e) => {
						setSearch(e.target.search.value);
						e.preventDefault();
					}}
					className="mb-3"
				>
					<InputGroup className="mb-1">
						<InputGroupAddon addonType="prepend">
							<InputGroupText>
								<img
									src={searchIcon}
									alt="search"
									style={{ height: "20px" }}
								/>
							</InputGroupText>
						</InputGroupAddon>
						<Input
							placeholder="Search..."
							autoFocus={true}
							onChange={(e) => {
								setValue(e.target.value);
							}}
							value={value}
							name="search"
						/>
					</InputGroup>
					<Input
						style={{ width: "auto" }}
						type="select"
						className="ml-auto"
						onChange={(e) => {
							setField(e.target.value);
						}}
					>
						<option value="title">Title</option>
						<option value="description">Description</option>
					</Input>
				</Form>

				{!loading ? (
					data.length > 0 ? (
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
						<Alert color="info">No Results Found</Alert>
					)
				) : (
					<Spinner color="primary" />
				)}
			</div>
		</div>
	);
};

export default Search;
