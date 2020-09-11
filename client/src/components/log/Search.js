import React, { useState, useEffect, Fragment } from "react";
import { Input, Form, Spinner } from "reactstrap";
import { useHistory } from "react-router-dom";
import LogListItem from "./LogListItem";
import SearchBar from "./SearchBar";
import { useQuery } from "react-query";
import { searchLogs } from "../../queries/log";

const Search = ({ match: { params }, location: { scroll } }) => {
    useEffect(() => {
        if (scroll) document.getElementById("scroll").scroll(0, scroll);
    }, [scroll]);
    const { term } = params;
    const history = useHistory();
    const [value, setValue] = useState(decodeURIComponent(term));
    const { isLoading, data } = useQuery(["getLogs", { params }], searchLogs, {
        onError: (err) => {
            console.error(err);
        },
    });
    return (
        <div>
            <h1>Search</h1>
            <Form
                onSubmit={(e) => {
                    history.push(`/search/${encodeURIComponent(e.target.search.value)}`);
                    e.preventDefault();
                }}
                className="mb-3"
            >
                <SearchBar className="mb-1" value={value} update={setValue} />
            </Form>
            {isLoading ? (
                <Spinner color="primary" />
            ) : (
                <LogListItem data={data} page={`/search/${term}`} />
            )}
        </div>
    );
};

export default Search;
