import React, { useCallback, Fragment, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LogForm from "./LogForm";
import axios from "axios";
import { Container } from "reactstrap";

const NewLog = () => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const token = useSelector((state) => state.auth.token);
    const [sLoading, setSLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const history = useHistory();
    const upload = useCallback(
        (data) => {
            setSLoading(true);
            axios({
                method: "post",
                url: `/api/logs`,
                headers: {
                    "Content-type": "application/json",
                    "x-auth-token": token,
                },
                data,
            })
                .then((result) => {
                    history.push(`/log/${result.data._id}`);
                })
                .catch((err) => {
                    setSLoading(false);
                    setErrors(err.response.data["errors"]);
                });
        },
        [token, history]
    );
    return (
        <Container className="content">
            {!loggedIn && loggedIn !== null ? <Redirect to="/logs" /> : <Fragment />}
            <LogForm upload={upload} type="new" sLoading={sLoading} errors={errors} />
        </Container>
    );
};

export default NewLog;
