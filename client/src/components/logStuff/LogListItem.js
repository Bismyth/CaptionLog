import React, { Fragment, useState, useEffect } from "react";
import { Card, CardBody, CardText, CardTitle, Alert, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Edit from "./actionButtons/Edit";
import Delete from "./actionButtons/Delete";

const LogListItem = (props) => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const [data, setData] = useState(props.data);
    const removeItem = (id) => {
        setData((d) => {
            return d.filter((v) => {
                return v._id !== id;
            });
        });
    };
    useEffect(() => {
        setData(props.data);
    }, [props.data]);
    return (
        <div id="accordion">
            {!props.loading ? (
                data.length > 0 ? (
                    data.map(({ _id, title, description, old }) => (
                        <Card key={_id}>
                            <CardBody>
                                <CardTitle className="d-flex">
                                    <Link
                                        to={old ? `/oldLog/${_id}` : `/log/${_id}`}
                                        className="text-dark"
                                    >
                                        {title}
                                    </Link>
                                    <div className="ml-auto mr-3">
                                        {loggedIn ? (
                                            <Fragment>
                                                {old ? (
                                                    <Fragment />
                                                ) : (
                                                    <Edit className="mr-1" id={_id} />
                                                )}
                                                <Delete id={_id} old={old} update={removeItem} />
                                            </Fragment>
                                        ) : (
                                            <Fragment />
                                        )}
                                    </div>
                                </CardTitle>
                                <CardText>{description}</CardText>
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <Alert color="info">No Results Found</Alert>
                )
            ) : (
                <Spinner color="primary" />
            )}
        </div>
    );
};

export default LogListItem;
