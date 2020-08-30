import axios from "axios";
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOCAL_CHECK,
} from "../types";
import { returnErrors } from "./errorActions";

//Check Token and load user
export const loadUser = () => (dispatch) => {
    //UserLoading
    dispatch({ type: USER_LOADING });
    axios
        .get(`/api/auth/user`)
        .then((res) => {
            dispatch({
                type: USER_LOADED,
                payload: res.data,
            });
        })
        .catch((err) => {
            console.error(err.response);
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: AUTH_ERROR });
        });
};

export const checkLocal = () => (dispatch) => {
    axios({ method: "get", url: "/api/auth/local" })
        .then((res) => {
            dispatch({ type: LOCAL_CHECK, payload: res.data });
        })
        .catch((err) => {
            console.error(err);
        });
};

//Register User
export const register = (data) => (dispatch) => {
    const config = jsonHeader();

    //Request Body
    const body = JSON.stringify(data);

    axios
        .post(`/api/users`, body, config)
        .then((res) => {
            dispatch({ type: REGISTER_SUCCESS, payload: res.data });
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data["errors"], err.response.status, REGISTER_FAIL));
            dispatch({ type: REGISTER_FAIL });
        });
};
//Login User

export const login = (data) => (dispatch) => {
    const config = jsonHeader();

    const body = JSON.stringify(data);

    axios
        .post(`/api/auth`, body, config)
        .then((res) => {
            dispatch({ type: LOGIN_SUCCESS, payload: res.data });
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data["errors"], err.response.status, LOGIN_FAIL));
            dispatch({ type: LOGIN_FAIL });
        });
};

export const logout = () => (dispatch) => {
    axios.get("/logout").then((res) => {
        dispatch({ type: LOGOUT_SUCCESS });
    });
};

export const jsonHeader = () => {
    return {
        headers: {
            "Content-type": "application/json",
        },
    };
};

export const tokenConfig = (getState) => {
    //Get token
    const token = getState().auth.token;

    const config = jsonHeader();

    //If token add to headers
    if (token) config.headers["x-auth-token"] = token;

    return config;
};
