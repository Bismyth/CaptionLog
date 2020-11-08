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

const initialState = {
    isAuthenticated: null,
    isLoading: false,
    user: null,
    local: false,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true,
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case LOCAL_CHECK:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
