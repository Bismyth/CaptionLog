import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LogForm from "./LogForm";
import { Container } from "reactstrap";
import { useMutation } from "react-query";
import axios from "axios";

const NewLog = () => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const token = useSelector((state) => state.auth.token);
    const [errors, setErrors] = useState([]);
    const history = useHistory();
    const [upload, { isLoading: sLoading }] = useMutation(
        async (data) => {
            const { data: result } = await axios({
                method: "post",
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
            onSuccess: (data) => {
                history.push(`/log/${data._id}`);
            },
            onError: ({ response }) => {
                if (response.status === 422) setErrors(response.data["errors"]);
            },
        }
    );
    if (!loggedIn && loggedIn !== null) return <Redirect to="/logs" />;
    return (
        <Container className="content">
            <LogForm upload={upload} type="new" sLoading={sLoading} errors={errors} />
        </Container>
    );
};

export default NewLog;
