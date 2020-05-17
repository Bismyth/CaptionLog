import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
	Card,
	CardBody,
	CardTitle,
	CardText,
	Button,
	Spinner,
	Pagination,
	PaginationItem,
	PaginationLink,
	Alert,
	Form,
	Input,
	InputGroup,
	InputGroupText,
	InputGroupAddon,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import searchIcon from "../Magnifying_glass_icon.svg";

const Logs = (props) => {
	const history = useHistory();

	const loggedIn = useSelector((state) => state.auth.isAuthenticated);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("a");
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	const [value, setValue] = useState("");
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const result = await axios(`/api/logs/view?search=${search}`);
			setData(result.data);
			setLoading(false);
		};

		fetchData();
	}, [search]);
	return (
		<div className="content">
			<h1>Logs</h1>
			<Pagination
				aria-label="Alphabet Navigation"
				size="sm"
				style={{
					flexWrap: "wrap",
					justifyContent: "center",
				}}
			>
				<PaginationItem>
					<PaginationLink onClick={() => setSearch("[0-9]")}>
						#
					</PaginationLink>
				</PaginationItem>
				{alphabet.map((char) => (
					<PaginationItem key={char}>
						<PaginationLink
							onClick={() => setSearch(char.toLowerCase())}
							autoFocus={char === search}
						>
							{char}
						</PaginationLink>
					</PaginationItem>
				))}
			</Pagination>
			<Form
				onSubmit={(e) => {
					history.push("/search/" + encodeURIComponent(value));
					e.preventDefault();
				}}
			>
				<InputGroup className="mb-3">
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
						onChange={(e) => {
							setValue(e.target.value);
						}}
						value={value}
						name="search"
					/>
					<Button>Search</Button>
				</InputGroup>
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
	);
};

export default Logs;
