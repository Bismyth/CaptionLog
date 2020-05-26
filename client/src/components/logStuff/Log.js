import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
    Container,
    Button,
    Spinner,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "./scroll.css";

const Log = (props) => {
    const history = useHistory();
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const token = useSelector((state) => state.auth.token);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            var config = {};
            var query = "";
            if (loggedIn) {
                config.headers = {
                    "Content-type": "application/json",
                };
                if (token) config.headers["x-auth-token"] = token;
                query = "/api/logs/fview/" + props.match.params.id;
            } else {
                query = "/api/logs/pview/" + props.match.params.id;
            }
            const result = await axios(query, config);
            setData(result.data);
            setLoading(false);
        };

        fetchData();
    }, [props.match.params.id, token, loggedIn]);

    return (
        <div id="scroll">
            <Container>
                <div className="logging">
                    {!loading ? (
                        <Fragment>
                            <Button
                                onClick={() => {
                                    history.goBack();
                                }}
                                className="mb-2"
                            >
                                Back
                            </Button>
                            <Container>
                                <h2>{data.title}</h2>
                                <ListGroup>
                                    <ListGroupItem>
                                        <ListGroupItemHeading>
                                            Description:
                                        </ListGroupItemHeading>
                                        <ListGroupItemText>
                                            {data.description}
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                    {loggedIn ? (
                                        <Fragment>
                                            <ListGroupItem>
                                                <ListGroupItemHeading>
                                                    Disks:
                                                </ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    {data.disks}
                                                </ListGroupItemText>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <ListGroupItemHeading>
                                                    Length:
                                                </ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    {data.length}
                                                </ListGroupItemText>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <ListGroupItemHeading>
                                                    Genre:
                                                </ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    {data.genre}
                                                </ListGroupItemText>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <ListGroupItemHeading>
                                                    Caption Source:
                                                </ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    {data.caption_source}
                                                </ListGroupItemText>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <ListGroupItemHeading>
                                                    Original Copy Location:
                                                </ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    {
                                                        data.original_copy_location
                                                    }
                                                </ListGroupItemText>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <ListGroupItemHeading>
                                                    Video Source:
                                                </ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    {data.video_source}
                                                </ListGroupItemText>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <ListGroupItemHeading>
                                                    Other:
                                                </ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    {data.other}
                                                </ListGroupItemText>
                                            </ListGroupItem>
                                        </Fragment>
                                    ) : (
                                        <Fragment />
                                    )}
                                    <ListGroupItem>
                                        <ListGroupItemHeading>
                                            {data.completed
                                                ? "Completed"
                                                : "Incomplete"}
                                        </ListGroupItemHeading>
                                        <ListGroupItemText>
                                            Completed on{" "}
                                            {new Date(
                                                data.date_of_completion
                                            ).toString()}
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                </ListGroup>
                            </Container>
                        </Fragment>
                    ) : (
                        <Spinner color="primary" />
                    )}
                </div>
            </Container>
        </div>
    );
};

export default Log;
