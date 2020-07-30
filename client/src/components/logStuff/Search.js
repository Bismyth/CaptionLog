import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Form, Container } from "reactstrap";
import { useHistory } from "react-router-dom";
import "./scroll.css";
import LogListItem from "./LogListItem";
import SearchBar from "./SearchBar";
const Search = (props) => {
    const history = useHistory();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(props.match.params.value || "a");
    const [field, setField] = useState(props.match.params.field || "title");
    const [value, setValue] = useState(decodeURIComponent(search));
    useEffect(() => {
        var updatedUrl = `/search/${encodeURIComponent(search)}/${field}`;
        if (history.location.pathname !== updatedUrl) history.push(updatedUrl);
        const fetchData = async () => {
            setLoading(true);
            const result = await axios(
                `${process.env.PUBLIC_URL}/api/logs?value=${search}&field=${field}`
            );
            setData(result.data);
            setLoading(false);
        };
        fetchData();
    }, [search, field, history]);
    useEffect(() => {
        var val = props.match.params.value;
        var fie = props.match.params.field;
        if (val) {
            setSearch(val);
            setValue(val);
        }
        if (fie) setField(fie);
    }, [props.match.params.value, props.match.params.field]);
    return (
        <Container className="content">
            <h1>Search</h1>
            <Form
                onSubmit={(e) => {
                    setSearch(e.target.search.value);
                    e.preventDefault();
                }}
                className="mb-3"
            >
                <SearchBar className="mb-1" value={value} update={setValue} />
                <Input
                    type="select"
                    className="ml-auto w-auto"
                    onChange={(e) => {
                        setField(e.target.value);
                        setSearch(value);
                    }}
                    value={field}
                >
                    <option value="title">Title</option>
                    <option value="description">Description</option>
                </Input>
            </Form>
            <LogListItem loading={loading} data={data} />
        </Container>
    );
};

export default Search;
