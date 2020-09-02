import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LogForm from "./LogForm";
import { Spinner } from "reactstrap";
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
    const userRoles = {
        ...useSelector((state) => {
            if (state.auth.user) {
                return state.auth.user.roles;
            } else {
                return undefined;
            }
        }),
    };
    const [data, setData] = useState(undefined);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const [upload, { isLoading: sLoading }] = useMutation(
        async (data) => {
            const { data: result } = await axios({
                method: "post",
                url: `/api/logs/convert`,
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
    const { data: oData } = useQuery([`oldLog`, { id, old: true }], fetchLog, {
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
                newData.copyrightInfo.dateOfCompletion = date.toISOString().substr(0, 10);
            }
            setData(newData);
            setLoading(false);
        },
    });
    if (!userRoles.write && loggedIn !== null) return <Redirect to="/logs" />;
    if (loading) return <Spinner color="primary" />;
    return (
        <LogForm
            upload={upload}
            data={data}
            type="convert"
            errors={errors}
            sLoading={sLoading}
            oldLog={oData}
        />
    );
};

export default ConvertLog;
