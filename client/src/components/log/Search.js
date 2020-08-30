import React, { useState, useEffect } from "react";
import { Input, Form, Spinner } from "reactstrap";
import { useHistory } from "react-router-dom";
import LogListItem from "./LogListItem";
import SearchBar from "./SearchBar";
import { useQuery } from "react-query";
import { fetchLogs } from "../../queries/log";

const Search = ({ match: { params }, location: { scroll } }) => {
    useEffect(() => {
        if (scroll) document.getElementById("scroll").scroll(0, scroll);
    }, [scroll]);
    const { value: search, field } = params;
    const history = useHistory();
    const [value, setValue] = useState(decodeURIComponent(search));
    const { isLoading, data } = useQuery(["getLogs", { params }], fetchLogs, {
        onError: (err) => {
            console.error(err);
        },
    });
    return (
        <div>
            <h1>Search</h1>
            <Form
                onSubmit={(e) => {
                    history.push(`/search/${encodeURIComponent(e.target.search.value)}/${field}`);
                    e.preventDefault();
                }}
                className="mb-3"
            >
                <SearchBar className="mb-1" value={value} update={setValue} />
                <Input
                    type="select"
                    className="ml-auto w-auto"
                    onChange={(e) => {
                        history.push(`/search/${encodeURIComponent(search)}/${e.target.value}`);
                    }}
                    value={field}
                >
                    <option value="title">Title</option>
                    <option value="description">Description</option>
                </Input>
            </Form>
            {isLoading ? (
                <Spinner color="primary" />
            ) : (
                <LogListItem data={data} page={`/search/${search}/${field}`} />
            )}
        </div>
    );
};

export default Search;
