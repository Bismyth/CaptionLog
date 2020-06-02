import React, { useState, useEffect } from "react";
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
const Logs = (props) => {
    const history = useHistory();
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
        var updatedUrl = "/logs/" + encodeURIComponent(search);
        if (history.location.pathname !== updatedUrl) history.push(updatedUrl);
        const fetchData = async () => {
            setLoading(true);
            const result =
                decodeURIComponent(search) === "#"
                    ? await axios(`/api/logs?search=[0-9]`)
                    : await axios(`/api/logs?search=${search}`);

            setData(result.data);
            setLoading(false);
        };
        fetchData();
    }, [search, history]);
    useEffect(() => {
        if (props.match.params.search) setSearch(props.match.params.search);
    }, [props.match.params.search]);
    return (
        <div id="scroll">
            <Container className="content">
                <div>
                    <h1 className="mr-auto">Logs</h1>
                    <Button
                        className="ml-auto"
                        onClick={() => {
                            history.push("/newLog");
                        }}
                    >
                        +New Log
                    </Button>
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
