import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
    Container,
    Spinner,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Badge,
} from "reactstrap";
import { useSelector } from "react-redux";
import "./scroll.css";
import BackButton from "../BackButton";
import logDisplay from "./LogDisplay.json";
import Edit from "./actionButtons/Edit";
import Delete from "./actionButtons/Delete";
import { useHistory } from "react-router-dom";
const Log = (props) => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const token = useSelector((state) => state.auth.token);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState(false);
    const history = useHistory();
    const { format, ratingColours } = logDisplay;
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            var result;
            var config = {
                url: `${process.env.PUBLIC_URL}/api/logs/${props.match.params.id}`,
                method: "get",
            };
            if (loggedIn) {
                config.headers = {
                    "Content-type": "application/json",
                };
                config.headers["x-auth-token"] = token;
            }
            try {
                result = await axios(config);
            } catch (e) {
                history.goBack();
            }
            if (result.data) setMovie(result.data.movieInfo !== undefined);
            setData(result.data);
            setLoading(false);
        };
        fetchData();
    }, [props.match.params.id, token, loggedIn, history]);
    return (
        <Container className="content">
            {!loading ? (
                <Fragment>
                    <div className="d-flex align-items-center mb-2">
                        <BackButton className="mr-1" />
                        <h2>
                            {data.title}
                            {movie ? ` (${data.movieInfo.year}) ` : ""}
                            {movie ? (
                                <Badge
                                    style={{
                                        backgroundColor: ratingColours[data.movieInfo.rating],
                                    }}
                                >
                                    {data.movieInfo.rating}
                                </Badge>
                            ) : (
                                <Fragment />
                            )}
                        </h2>
                        <div className="ml-auto">
                            <Edit id={data._id} />
                            <Delete id={data._id} old={false} />
                        </div>
                    </div>
                    {Object.entries(format).map(([key, [{ heading, multi }, ...entries]]) => {
                        if (multi) {
                            if (Object.keys(data).includes(key) && data[key].length > 0) {
                                return (
                                    <Fragment key={key}>
                                        <h3 className="mt-2">{heading}</h3>
                                        <ListGroup>
                                            {data[key].map((value, i) => (
                                                <ListGroupItem key={i}>
                                                    {value.name ? (
                                                        <ListGroupItemHeading>
                                                            {value.name}
                                                        </ListGroupItemHeading>
                                                    ) : (
                                                        <Fragment />
                                                    )}
                                                    <ListGroupItemText>
                                                        {entries
                                                            .filter((value) => {
                                                                return value.align === "left";
                                                            })
                                                            .map((v, i) => {
                                                                if (
                                                                    Object.keys(value).includes(
                                                                        v.value
                                                                    )
                                                                ) {
                                                                    return (
                                                                        <Fragment
                                                                            key={`${key[0]}-${v.value}-${i}`}
                                                                        >
                                                                            <span>
                                                                                {v.renderPart.replace(
                                                                                    `{${v.value}}`,
                                                                                    value[v.value]
                                                                                )}
                                                                            </span>{" "}
                                                                            <br />
                                                                        </Fragment>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <Fragment
                                                                            key={`${key[0]}-${v.value}-${i}`}
                                                                        />
                                                                    );
                                                                }
                                                            })}
                                                    </ListGroupItemText>
                                                </ListGroupItem>
                                            ))}
                                        </ListGroup>
                                    </Fragment>
                                );
                            } else {
                                return <Fragment key={key} />;
                            }
                        } else {
                            return (
                                <Fragment key={key}>
                                    {key !== "main" ? (
                                        <h3 className="mt-2">{heading}</h3>
                                    ) : (
                                        <Fragment />
                                    )}
                                    <ListGroup>
                                        {entries.map((v) => {
                                            if (key === "main") var source = data;
                                            else source = data[key];
                                            if (Object.keys(source).includes(v.value)) {
                                                return (
                                                    <ListGroupItem key={`${key[0]}-${v.value}`}>
                                                        <ListGroupItemHeading>
                                                            {v.header}
                                                        </ListGroupItemHeading>
                                                        <ListGroupItemText>
                                                            {v.special === "date"
                                                                ? new Date(
                                                                      source[v.value]
                                                                  ).toDateString()
                                                                : source[v.value]}
                                                        </ListGroupItemText>
                                                    </ListGroupItem>
                                                );
                                            } else {
                                                return <Fragment key={`${key[0]}-${v.value}`} />;
                                            }
                                        })}
                                    </ListGroup>
                                </Fragment>
                            );
                        }
                    })}
                </Fragment>
            ) : (
                <Spinner color="primary" />
            )}
        </Container>
    );
};

export default Log;
