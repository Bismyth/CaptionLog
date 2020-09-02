import React, { useState, useEffect } from "react";
import { Pagination, PaginationItem, PaginationLink, Form, Spinner, Alert } from "reactstrap";
import { useHistory } from "react-router-dom";
import LogListItem from "./LogListItem";
import SearchBar from "./SearchBar";
import { useQuery } from "react-query";
import { fetchLogs } from "../../queries/log";

const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const AtoZ = ({ match: { params }, location: { scroll } }) => {
    useEffect(() => {
        if (scroll) document.getElementById("scroll").scroll(0, scroll);
    }, [scroll]);
    const { search = "a" } = params;
    const history = useHistory();
    const [error, setError] = useState("");
    const [value, setValue] = useState("");
    const { data, isLoading } = useQuery(["getLogs", { params }], fetchLogs, {
        onError: (err) => {
            setError("Database Error, please reload the page.");
        },
    });

    return (
        <div>
            <h1 style={{ display: "inline-block" }} className="mr-auto">
                Logs
            </h1>

            <Pagination
                aria-label="Alphabet Navigation"
                size="sm"
                style={{
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {alphabet.map((char) => (
                    <PaginationItem
                        key={char}
                        active={decodeURIComponent(search) === char.toLowerCase()}
                    >
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
            {/* <Form
                onSubmit={(e) => {
                    history.push(`/search/${encodeURIComponent(value)}/title`);
                    e.preventDefault();
                }}
            >
                <SearchBar className="mb-3" value={value} update={setValue} />
            </Form> */}
            {error ? <Alert color="danger">{error}</Alert> : null}
            {isLoading ? (
                <Spinner color="primary" />
            ) : (
                <LogListItem data={data} page={`/atoz/${search}`} />
            )}
        </div>
    );
};

export default AtoZ;
