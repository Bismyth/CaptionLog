import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LogForm from "./LogForm";
import { Spinner } from "reactstrap";
import { useMutation, useQuery } from "react-query";
import { fetchLog } from "../../../queries/log";
import axios from "axios";

const EditLog = ({
    match: {
        params: { id },
    },
}) => {
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
    const [upload] = useMutation(
        async (data) => {
            const { data: result } = await axios({
                method: "put",
                url: `/api/logs`,
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
    const { isLoading, data } = useQuery([`log`, { id }], fetchLog, {
        onError: (err) => {
            console.error(err);
        },
        cacheTime: 0,
        refetchOnWindowFocus: false,
    });
    if (!userRoles.write && loggedIn !== null) return <Redirect to="/" />;
    if (isLoading) return <Spinner color="primary" />;
    return <LogForm upload={upload} data={data} type="edit" errors={errors} />;
};

export default EditLog;
