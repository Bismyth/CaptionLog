import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
    Pagination,
    PaginationItem,
    PaginationLink,
    Form,
    Input,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Container,
    Button,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import searchIcon from "../../Magnifying_glass_icon.svg";
import "./scroll.css";
import { setPage } from "../../redux/actions/pageActions";
import LogListItem from "./LogListItem";
import { useSelector } from "react-redux";
const Logs = (props) => {
    const history = useHistory();
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(props.match.params.search || "a");
    const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const [value, setValue] = useState("");
    useEffect(() => {
        dispatch(setPage("Logs"));
    }, [dispatch]);
    useEffect(() => {
        var updatedUrl = `/logs/${encodeURIComponent(search)}`;
        if (history.location.pathname !== updatedUrl) history.push(updatedUrl);
        const fetchData = async () => {
            setLoading(true);
            const result =
                decodeURIComponent(search) === "#"
                    ? await axios(
                          `${process.env.PUBLIC_URL}/api/logs?search=[0-9]`
                      )
                    : await axios(
                          `${process.env.PUBLIC_URL}/api/logs?search=${search}`
                      );
            setData(result.data);
            setLoading(false);
        };
        fetchData();
    }, [search]);
    useEffect(() => {
        if (props.match.params.search) setSearch(props.match.params.search);
    }, [props.match.params.search]);
    return (
        <div id="scroll">
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
                                history.push(
                                    `${process.env.PUBLIC_URL}/newLog`
                                );
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
                        history.push(
                            `/search/${encodeURIComponent(value)}/title`
                        );
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
                    </InputGroup>
                </Form>
                <LogListItem loading={loading} data={data} />
            </Container>
        </div>
    );
};

export default Logs;
