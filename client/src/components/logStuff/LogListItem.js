import React, { Fragment } from "react";
import {
    Card,
    CardBody,
    Button,
    CardText,
    CardTitle,
    Alert,
    Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import editButton from "../../icons/edit-black-24dp.svg";
import deleteButton from "../../icons/delete-black-24dp.svg";

const LogListItem = (props) => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    return (
        <div id="accordion">
            {!props.loading ? (
                props.data.length > 0 ? (
                    props.data.map(({ _id, title, description, old }) => (
                        <Card key={_id}>
                            <CardBody>
                                <CardTitle className="d-flex">
                                    <Link
                                        to={
                                            old
                                                ? `/oldLog/${_id}`
                                                : `/log/${_id}`
                                        }
                                        className="text-dark"
                                    >
                                        {title}
                                    </Link>
                                    <div className="ml-auto mr-3">
                                        {loggedIn ? (
                                            <Fragment>
                                                <img
                                                    src={editButton}
                                                    alt="Edit"
                                                    className="link-arrow mr-1"
                                                />
                                                <img
                                                    src={deleteButton}
                                                    alt="Delete"
                                                    className="link-arrow"
                                                />
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
