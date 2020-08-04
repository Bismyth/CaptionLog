import React, { Fragment, useCallback, useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LogForm from "./LogForm";
import axios from "axios";
import { Spinner, Container } from "reactstrap";
import { digBlank, digBlankCV, physBlank, blankForm } from "./FormData.json";

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
                    var newData = blankForm;
                    if (oData.description.includes("<iframe")) {
                        newData["description"] = oData["description"].split("\r\n")[0] || "";
                        newData.digitalInfo.push({
                            ...digBlankCV,
                            length: oData.length || "",
                            clickviewUrl: oData.description
                                .replace(/(\r\n|\n|\r)/gm, " ")
                                .split(" ")
                                .filter((v) => {
                                    return v.includes("https://click");
                                })[0],
                        });
                    } else {
                        newData["description"] = oData["description"] || "";
                    }
                    if (oData.date_of_completion) {
                        var date = new Date(oData.date_of_completion);
                        var d = date.getDate() + "";
                        var m = date.getMonth() + 1 + "";
                        var y = date.getFullYear() + "";
                        if (d.length < 2) d = "0" + d;
                        if (m.length < 2) m = "0" + m;
                        newData.copyrightInfo.dateOfCompletion = [y, m, d].join("-");
                    }
                    newData["title"] = oData["title"] || "";
                    newData["genre"] = oData["genre"] || "";
                    newData.copyrightInfo.videoSource = oData.video_source || "";
                    newData.copyrightInfo.captionSource = oData.caption_source || "";
                    newData.copyrightInfo.originalLocation = oData.original_copy_location || "";
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
