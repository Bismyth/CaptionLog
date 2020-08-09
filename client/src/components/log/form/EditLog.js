import React, { Fragment, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LogForm from "./LogForm";
import axios from "axios";
import { Spinner, Container } from "reactstrap";
import { useMutation, useQuery } from "react-query";
import { fetchLog } from "../../../queries/log";

const EditLog = ({
    match: {
        params: { id },
    },
}) => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const token = useSelector((state) => state.auth.token);
    const [errors, setErrors] = useState([]);
    const history = useHistory();
    const [upload, { isLoading: sLoading }] = useMutation(
        async (data) => {
            const { data: result } = await axios({
                method: "put",
                url: `/api/logs`,
                headers: {
                    "Content-type": "application/json",
                    "x-auth-token": token,
                },
                data,
            });
            return result;
        },
        {
            onError: ({ response }) => {
                if (response.status === 422) setErrors(response.data.errors);
            },
            onSuccess: (data) => {
                history.push(`/log/${data._id}`);
            },
        }
    );
    const { data, isLoading } = useQuery([`elog-${id}`, { token, id }], fetchLog, {
        onError: (err) => {
            console.error(err);
        },
    });
    return (
        <Container className="content">
            {!loggedIn && loggedIn !== null ? <Redirect to="/logs" /> : <Fragment />}
            {!isLoading ? (
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
