import React, { Fragment, useCallback, useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LogForm from "./LogForm";
import axios from "axios";
import { Spinner, Container } from "reactstrap";

const EditLog = ({
    match: {
        params: { id },
    },
}) => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const [data, setData] = useState({});
    const token = useSelector((state) => state.auth.token);
    const [errors, setErrors] = useState([]);
    const [sLoading, setSLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const upload = useCallback(
        (data) => {
            setSLoading(true);
            axios({
                method: "put",
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
    useEffect(() => {
        if (id && token) {
            var config = {
                method: "get",
                url: `/api/logs/${id}`,
                headers: {
                    "Content-type": "application/json",
                    "x-auth-token": token,
                },
            };
            axios(config)
                .then((result) => {
                    if (result.data) {
                        setData(result.data);
                    } else {
                        setErrors([{ msg: "No Log with that ID found" }]);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    history.goBack();
                });
        }
    }, [id, token, history]);
    return (
        <Container className="content">
            {!loggedIn && loggedIn !== null ? <Redirect to="/logs" /> : <Fragment />}
            {!loading ? (
                <LogForm
                    upload={upload}
                    data={data}
                    type="edit"
                    errors={errors}
                    sLoading={sLoading}
                />
            ) : (
                <Spinner color="primary" />
            )}
        </Container>
    );
};

export default EditLog;
