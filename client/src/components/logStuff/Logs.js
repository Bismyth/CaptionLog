import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
    Pagination,
    PaginationItem,
    PaginationLink,
    Form,
    Container,
    Button,
    Spinner,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./scroll.css";
import { setPage } from "../../redux/actions/pageActions";
import LogListItem from "./LogListItem";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";

const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const Logs = ({
    match: {
        params: { search: psearch = "a" },
    },
}) => {
    const history = useHistory();
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(psearch);
    const [value, setValue] = useState("");
    useEffect(() => {
        dispatch(setPage("Logs"));
    }, [dispatch]);
    useEffect(() => {
        var updatedUrl = `/logs/${encodeURIComponent(search)}`;
        if (history.location.pathname !== updatedUrl) history.push(updatedUrl);
        setLoading(true);
        var term = decodeURIComponent(search) === "#" ? "[0-9]" : search;
        axios({
            method: "get",
            url: `/api/logs?search=${term}`,
        }).then((result) => {
            setData(result.data);
            setLoading(false);
        });
    }, [search, history]);
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
                    <PaginationItem key={char} active={search === char}>
                        <PaginationLink
                            onClick={() => setSearch(char.toLowerCase())}
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
            {!loading ? <LogListItem data={data} setData={setData} /> : <Spinner color="primary" />}
        </Container>
    );
};

export default Logs;
