import React, { useState, useEffect, Fragment } from "react";
import {
    Pagination,
    PaginationItem,
    PaginationLink,
    Form,
    Container,
    Button,
    Spinner,
    Alert,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./scroll.css";
import { setPage } from "../../redux/actions/pageActions";
import LogListItem from "./LogListItem";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import { useQuery } from "react-query";
import { fetchLogs } from "../../queries/log";

const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const AtoZ = ({ match: { params } }) => {
    const { search = "a" } = params;
    const history = useHistory();
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [value, setValue] = useState("");
    const { data, isLoading } = useQuery(["getLogs", { params }], fetchLogs, {
        onError: (err) => {
            setError("Database Error, please reload the page.");
        },
    });
    useEffect(() => {
        dispatch(setPage("Logs"));
    }, [dispatch]);
    return (
        <Container className="content">
            <div>
                <h1 style={{ display: "inline-block" }} className="mr-auto">
                    Logs
                </h1>
                {loggedIn ? (
                    <Button
                        style={{ float: "right" }}
                        className="ml-auto"
                        onClick={() => {
                            history.push(`/newLog`);
                        }}
                    >
                        +New Log
                    </Button>
                ) : (
                    <Fragment />
                )}
            </div>

            <Pagination
                aria-label="Alphabet Navigation"
                size="sm"
                style={{
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {alphabet.map((char) => (
                    <PaginationItem key={char} active={search === char.toLowerCase()}>
                        <PaginationLink
                            onClick={(e) => {
                                history.push(`/atoz/${encodeURIComponent(char.toLowerCase())}`);
                            }}
                            className="bg-darkgray"
                        >
                            {char}
                        </PaginationLink>
                    </PaginationItem>
                ))}
            </Pagination>
            <Form
                onSubmit={(e) => {
                    history.push(`/search/${encodeURIComponent(value)}/title`);
                    e.preventDefault();
                }}
            >
                <SearchBar className="mb-3" value={value} update={setValue} />
            </Form>
            {error ? <Alert color="danger">{error}</Alert> : <Fragment />}
            {isLoading ? <Spinner color="primary" /> : <LogListItem data={data} />}
        </Container>
    );
};

export default AtoZ;
