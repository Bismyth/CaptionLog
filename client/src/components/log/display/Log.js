import React, { Fragment } from "react";
import {
    Container,
    Spinner,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Button,
} from "reactstrap";
import { useSelector } from "react-redux";
import BackButton from "../../BackButton";
import { format } from "./LogDisplay.json";
import Edit from "../actionButtons/Edit";
import Delete from "../actionButtons/Delete";
import { useHistory, Link } from "react-router-dom";
import LogHeader from "../LogHeader";
import { classHeading } from "../../../config";
import { useQuery } from "react-query";
import "../scroll.css";
import { fetchLog } from "../../../queries/log";

const Log = ({
    match: {
        params: { id },
    },
}) => {
    const token = useSelector((state) => state.auth.token);
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const history = useHistory();
    const { data, isLoading } = useQuery([`log-${id}`, { token, id }], fetchLog, {
        onError: (err) => {
            history.goBack();
        },
    });
    if (isLoading)
        return (
            <Container className="content">
                <Spinner color="primary" />
            </Container>
        );
    return (
        <Container className="content">
            <div className={classHeading}>
                <BackButton className="mr-1" />
                <h2>
                    <LogHeader title={data.title} movieInfo={data.movieInfo} />
                </h2>
                {loggedIn ? (
                    <div className="ml-auto">
                        <Edit id={data._id} />
                        <Delete id={data._id} old={false} back={true} />
                    </div>
                ) : (
                    <Fragment />
                )}
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
                                                        if (Object.keys(value).includes(v.value)) {
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
                                                {value.location && key === "digitalInfo" ? (
                                                    <Button
                                                        tag={Link}
                                                        to={`/video/${data._id}/${value._id}`}
                                                        className="ml-auto"
                                                        disabled
                                                    >
                                                        Go to Video
                                                    </Button>
                                                ) : value.clickviewUrl ? (
                                                    <Fragment></Fragment>
                                                ) : (
                                                    <Fragment />
                                                )}
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
                            {key !== "main" ? <h3 className="mt-2">{heading}</h3> : <Fragment />}
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
                                                        ? new Date(source[v.value]).toDateString()
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
        </Container>
    );
};

export default Log;
