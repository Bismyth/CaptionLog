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
import Delete from "./actionButtons/Delete";
import { useHistory } from "react-router-dom";
import { classHeading } from "../../config";

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
const OldLog = (props) => {
    const token = useSelector((state) => state.auth.token);
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        setLoading(true);
        var config = {
            url: `/api/logs/${props.match.params.id}?type=old`,
            method: "get",
        };
        if (token) {
            config.headers = {
                "Content-type": "application/json",
                "x-auth-token": token,
            };
        }
        axios(config)
            .then((result) => {
                setData(result.data);
                setLoading(false);
            })
            .catch((err) => {
                history.goBack();
            });
    }, [props.match.params.id, token, history]);
    return (
        <Container className="content">
            {!loading ? (
                <Fragment>
                    <div className={classHeading}>
                        <BackButton className="mr-1" />
                        <h2>{data.title}</h2>
                        {loggedIn ? (
                            <div className="ml-auto">
                                <Delete id={data._id} old={true} />
                            </div>
                        ) : (
                            <Fragment />
                        )}
                    </div>
                    <ListGroup>
                        {Object.entries(data).map(([key, value]) => {
                            if (Object.keys(display).includes(key))
                                return (
                                    <ListGroupItem key={key}>
                                        <ListGroupItemHeading>{display[key]}</ListGroupItemHeading>
                                        <ListGroupItemText>{value}</ListGroupItemText>
                                    </ListGroupItem>
                                );
                            else return <Fragment key={key} />;
                        })}
                        <ListGroupItem>
                            <ListGroupItemHeading>
                                {data.completed ? "Completed" : "Incomplete"}
                            </ListGroupItemHeading>
                            <ListGroupItemText>
                                Completed on {new Date(data.date_of_completion).toString()}
                            </ListGroupItemText>
                        </ListGroupItem>
                    </ListGroup>
                </Fragment>
            ) : (
                <Spinner color="primary" />
            )}
        </Container>
    );
};

export default OldLog;
