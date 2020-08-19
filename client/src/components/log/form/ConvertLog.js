import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LogForm from "./LogForm";
import { Spinner, Container } from "reactstrap";
import { useQuery, useMutation } from "react-query";
import { digBlankCV, blankForm } from "./FormData.json";
import { fetchLog } from "../../../queries/log";
import axios from "axios";

const ConvertLog = ({
    match: {
        params: { id },
    },
}) => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const [data, setData] = useState(undefined);
    const token = useSelector((state) => state.auth.token);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const [upload, { isLoading: sLoading }] = useMutation(
        async (data) => {
            const { data: result } = await axios({
                method: "post",
                url: `/api/logs/convert`,
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
    const { data: oData } = useQuery([`cLog`, { token, id, old: true }], fetchLog, {
        onError: (err) => {
            console.error(err);
            history.goBack();
        },
        onSuccess: (oData) => {
            var newData = {
                ...blankForm,
                _id: oData._id,
                title: oData["title"] || "",
                genre: oData["genre"] || "",
                description: oData["description"] || "",
                copyrightInfo: {
                    ...blankForm.copyrightInfo,
                    videoSource: oData.video_source || "",
                    captionSource: oData.caption_source || "",
                    originalLocation: oData.original_copy_location || "",
                },
            };
            if (oData.description.includes("<iframe")) {
                newData["description"] = oData["description"].split("\r\n")[0] || "";
                newData.digitalInfo = [
                    {
                        ...digBlankCV,
                        length: oData.length || "",
                        clickviewUrl: oData.description
                            .replace(/(\r\n|\n|\r)/gm, " ")
                            .split(" ")
                            .filter((v) => {
                                return v.includes("https://click");
                            })[0],
                    },
                ];
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
            setData(newData);
            setLoading(false);
        },
    });
    if (!loggedIn && loggedIn !== null) return <Redirect to="/logs" />;
    if (loading)
        return (
            <Container className="content">
                <Spinner color="primary" />
            </Container>
        );
    return (
        <Container className="content">
            <LogForm
                upload={upload}
                data={data}
                type="convert"
                errors={errors}
                sLoading={sLoading}
                oldLog={oData}
            />
        </Container>
    );
};

export default ConvertLog;
