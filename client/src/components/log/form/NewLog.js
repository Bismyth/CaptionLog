import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LogForm from "./LogForm";
import { useMutation } from "react-query";
import axios from "axios";

const NewLog = () => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const userRoles = {
        ...useSelector((state) => {
            if (state.auth.user) {
                return state.auth.user.roles;
            } else {
                return undefined;
            }
        }),
    };
    const [errors, setErrors] = useState([]);
    const history = useHistory();
    const [upload, { isLoading: sLoading }] = useMutation(
        async (data) => {
            const { data: result } = await axios({
                method: "post",
                url: `/api/logs`,
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
    if (!userRoles.write && loggedIn !== null) return <Redirect to="/" />;
    return <LogForm upload={upload} type="new" sLoading={sLoading} errors={errors} />;
};

export default NewLog;
