import React, { useState, useEffect } from "react";
import { Pagination, PaginationItem, PaginationLink, Spinner, Alert } from "reactstrap";
import { useHistory } from "react-router-dom";
import LogListItem from "./LogListItem";
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
    const { data, isLoading } = useQuery(["getLogs", { params }], fetchLogs, {
        onError: (err) => {
            setError("Database Error, please reload the page.");
        },
    });

    return (
        <div>
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
