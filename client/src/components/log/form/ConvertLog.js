import React, { Fragment, useCallback, useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LogForm from "./LogForm";
import axios from "axios";
import { Spinner, Container } from "reactstrap";

const ConvertLog = ({
    match: {
        params: { id },
    },
}) => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const [data, setData] = useState(undefined);
    const [oData, setOData] = useState(undefined);
    const token = useSelector((state) => state.auth.token);
    const [errors, setErrors] = useState([]);
    const [sLoading, setSLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    // const upload = useCallback(
    //     (data) => {
    //         setSLoading(true);
    //         axios({
    //             method: "post",
    //             url: `/api/logs?type=convert`,
    //             headers: {
    //                 "Content-type": "application/json",
    //                 "x-auth-token": token,
    //             },
    //             data,
    //         })
    //             .then((result) => {
    //                 history.push(`/log/${result.data._id}`);
    //             })
    //             .catch((err) => {
    //                 setSLoading(false);
    //                 setErrors(err.response.data["errors"]);
    //             });
    //     },
    //     [token, history]
    // );
    useEffect(() => {
        if (id && token) {
            var config = {
                method: "get",
                url: `/api/logs/${id}?type=old`,
                headers: {
                    "Content-type": "application/json",
                    "x-auth-token": token,
                },
            };
            axios(config)
                .then((result) => {
                    console.log(result.data);

                    var oData = result.data;
                    var newData = {
                        title: "",
                        description: "",
                        genre: "",
                        copyrightInfo: {
                            teacherName: "",
                            captionSource: "",
                            dateOfCompletion: "",
                            videoSource: "",
                            originalLocation: "",
                        },
                        digitalInfo: [],
                        physicalInfo: [],
                    };

                    newData["title"] = oData["title"] || "";
                    newData["description"] = oData["description"] || "";
                    newData["genre"] = oData["genre"] || "";

                    setOData(result.data);
                    setData(newData);
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
                    //upload={upload}
                    data={data}
                    type="convert"
                    errors={errors}
                    sLoading={sLoading}
                    oldLog={oData._id}
                />
            ) : (
                <Spinner color="primary" />
            )}
        </Container>
    );
};

export default ConvertLog;
