import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LogForm from "./LogForm";
import { Spinner, Container } from "reactstrap";
import { useQuery } from "react-query";
import { digBlankCV, blankForm } from "./FormData.json";
import { fetchLog } from "../../../queries/log";
const ConvertLog = ({
    match: {
        params: { id },
    },
}) => {
    const { digBlankCV } = require("./FormData.json");
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const [data, setData] = useState(undefined);
    const token = useSelector((state) => state.auth.token);
    const [errors, setErrors] = useState([]);
    const [sLoading, setSLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const { data: oData } = useQuery([`cLog-${id}`, { token, id, old: true }], fetchLog, {
        onError: (err) => {
            console.error(err);
            history.goBack();
        },
        onSuccess: (oData) => {
            var newData = JSON.parse(JSON.stringify(blankForm));
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
                //upload={upload}
                data={data}
                type="convert"
                errors={errors}
                sLoading={sLoading}
                oldLog={oData._id}
            />
        </Container>
    );
};

export default ConvertLog;
