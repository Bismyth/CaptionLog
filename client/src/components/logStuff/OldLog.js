import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
    Container,
    Spinner,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
} from "reactstrap";
import { useSelector } from "react-redux";
import "./scroll.css";
import BackButton from "../BackButton";
const OldLog = (props) => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const token = useSelector((state) => state.auth.token);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const display = {
        description: "Description:",
        disks: "Disks:",
        length: "Length:",
        genre: "Genre:",
        caption_source: "Caption Source:",
        original_copy_location: "Original Copy Location:",
        video_source: "Video Source:",
        other: "Other: ",
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            var config = {
                url: `${process.env.PUBLIC_URL}/api/logs/${props.match.params.id}?type=old`,
                method: "get",
            };
            if (loggedIn) {
                config.headers = {
                    "Content-type": "application/json",
                };
                config.headers["x-auth-token"] = token;
            }
            const result = await axios(config);
            setData(result.data);
            setLoading(false);
        };
        fetchData();
    }, [props.match.params.id, token, loggedIn]);

    return (
        <div id="scroll">
            <Container className="content">
                {!loading ? (
                    <Fragment>
                        <div className="d-flex align-items-center mb-2">
                            <BackButton className="mr-1" />
                            <h2>{data.title}</h2>
                        </div>
                        <ListGroup>
                            {Object.entries(data).map(([key, value]) => {
                                if (Object.keys(display).includes(key))
                                    return (
                                        <ListGroupItem key={key}>
                                            <ListGroupItemHeading>
                                                {display[key]}
                                            </ListGroupItemHeading>
                                            <ListGroupItemText>
                                                {value}
                                            </ListGroupItemText>
                                        </ListGroupItem>
                                    );
                                else return <Fragment key={key} />;
                            })}
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
                    </Fragment>
                ) : (
                    <Spinner color="primary" />
                )}
            </Container>
        </div>
    );
};

export default OldLog;
