import React, { Fragment } from "react";
import { Card, CardBody, CardText, CardTitle, Alert } from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Edit from "./actionButtons/Edit";
import Convert from "./actionButtons/Convert";
import Delete from "./actionButtons/Delete";
import LogHeader from "./LogHeader";

const LogListItem = ({ data, setData }) => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    return (
        <Fragment>
            {data.length > 0 ? (
                data.map(({ _id, title, description, old, movieInfo }) => (
                    <Card key={_id}>
                        <CardBody>
                            <CardTitle className="d-flex">
                                <Link
                                    to={old ? `/oldLog/${_id}` : `/log/${_id}`}
                                    className="text-dark"
                                >
                                    {old ? (
                                        title
                                    ) : (
                                        <LogHeader title={title} movieInfo={movieInfo} />
                                    )}
                                </Link>
                                {loggedIn ? (
                                    <div className="ml-auto mr-3">
                                        {old ? (
                                            <Convert className="mr-1" id={_id} />
                                        ) : (
                                            <Edit className="mr-1" id={_id} />
                                        )}
                                        <Delete id={_id} old={old} update={setData} />
                                    </div>
                                ) : null}
                            </CardTitle>
                            <CardText>{description}</CardText>
                        </CardBody>
                    </Card>
                ))
            ) : (
                <Alert color="info">No Results Found</Alert>
            )}
        </Fragment>
    );
};

export default React.memo(LogListItem);
