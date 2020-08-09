import axios from "axios";
export const fetchLog = async (key, { token, id, old }) => {
    var config = {
        url: `/api/logs/${id}`,
        method: "get",
    };
    if (old) config.params = { type: "old" };
    if (token) {
        config.headers = {
            "Content-type": "application/json",
            "x-auth-token": token,
        };
    }
    const { data } = await axios(config);
    return data;
};

export const fetchLogs = async (key, { params }) => {
    if (decodeURIComponent(params.search) === "#") params.search = "[0-9]";
    var config = {
        url: `/api/logs`,
        method: "get",
        params,
    };
    const { data } = await axios(config);
    return data;
};
