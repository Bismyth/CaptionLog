import React, { Fragment } from "react";
import { Card, CardBody, CardText, CardTitle, Alert } from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Edit from "./actionButtons/Edit";
import Convert from "./actionButtons/Convert";
import Delete from "./actionButtons/Delete";
import LogHeader from "./LogHeader";
import { setPage } from "../../redux/actions/pageActions";

const LogListItem = ({ data, page }) => {
    const userRoles = {
        ...useSelector((state) => {
            if (state.auth.user) {
                return state.auth.user.roles;
            } else {
                return undefined;
            }
        }),
    };
    const dispatch = useDispatch();
    return (
        <Fragment>
            {data.length > 0 ? (
                data.map(({ _id, title, description, old, movieInfo }) => (
                    <Card key={_id}>
                        <CardBody>
                            <CardTitle className="d-flex">
                                <Link
                                    onClick={() => {
                                        dispatch(
                                            setPage({
                                                page,
                                                scrollPos: document.getElementById("scroll")
                                                    .scrollTop,
                                            })
                                        );
                                    }}
                                    to={old ? `/oldLog/${_id}` : `/log/${_id}`}
                                    className="text-dark"
                                >
                                    {old ? (
                                        title
                                    ) : (
                                        <LogHeader title={title} movieInfo={movieInfo} />
                                    )}
                                </Link>
                                {userRoles.write ? (
                                    <div className="ml-auto mr-3">
                                        {old ? (
                                            <Convert className="mr-1" id={_id} page={page} />
                                        ) : (
                                            <Edit className="mr-1" id={_id} page={page} />
                                        )}
                                        <Delete id={_id} old={old} />
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
