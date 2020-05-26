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
    const [search, setSearch] = useState(props.match.params.id || "a");
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
                    ? await axios(`/api/logs/view?search=[0-9]`)
                    : await axios(`/api/logs/view?search=${search}`);

            setData(result.data);
            setLoading(false);
        };
        fetchData();
    }, [search, history]);
    useEffect(() => {
        if (props.match.params.id) setSearch(props.match.params.id);
    }, [props.match.params.id]);
    return (
        <div id="scroll">
            <Container className="content">
                <h1>Logs</h1>
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
