import React from "react";
import {
    Container,
    Spinner,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
} from "reactstrap";
import { useSelector } from "react-redux";
import BackButton from "../../BackButton";
import Convert from "../actionButtons/Convert";
import Delete from "../actionButtons/Delete";
import { useHistory } from "react-router-dom";
import { classHeading } from "../../../config";
import { useQuery } from "react-query";
import { fetchLog } from "../../../queries/log";

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

const OldLog = ({
    match: {
        params: { id },
    },
}) => {
    const token = useSelector((state) => state.auth.token);
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const history = useHistory();
    const { isLoading, data, error } = useQuery([`oldLog`, { id, token, old: true }], fetchLog);
    if (error) history.goBack();
    if (isLoading)
        return (
            <Container className="content">
                <Spinner color="primary" />
            </Container>
        );
    return (
        <Container className="content">
            <div className={classHeading}>
                <BackButton className="mr-1" back={false} />
                <h2>{data.title}</h2>
                {loggedIn ? (
                    <div className="ml-auto">
                        <Convert className="mr-1" id={data._id} />
                        <Delete id={data._id} old={true} back={true} />
                    </div>
                ) : null}
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
                    else return null;
                })}
                {data.completed && data.date_of_completion ? (
                    <ListGroupItem>
                        <ListGroupItemHeading>
                            {data.completed ? "Completed" : "Incomplete"}
                        </ListGroupItemHeading>
                        <ListGroupItemText>
                            Completed on {new Date(data.date_of_completion).toDateString()}
                        </ListGroupItemText>
                    </ListGroupItem>
                ) : null}
            </ListGroup>
        </Container>
    );
};

export default OldLog;
