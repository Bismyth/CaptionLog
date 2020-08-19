import React, { useState } from "react";
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
    const { isLoading, data } = useQuery([`log`, { token, id }], fetchLog, {
        onError: (err) => {
            console.error(err);
        },
        cacheTime: 0,
        refetchOnWindowFocus: false,
    });
    if (!loggedIn && loggedIn !== null) return <Redirect to="/" />;
    if (isLoading)
        return (
            <Container className="content">
                <Spinner color="primary" />
            </Container>
        );
    return (
        <Container className="content">
            <LogForm upload={upload} data={data} type="edit" errors={errors} sLoading={sLoading} />
        </Container>
    );
};

export default EditLog;
