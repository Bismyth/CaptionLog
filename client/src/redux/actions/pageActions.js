import { SET_PAGE, CLEAR_PAGE } from "../types";

export const setPage = (payload) => {
    return {
        type: SET_PAGE,
        payload,
    };
};

export const clearPage = () => {
    return {
        type: CLEAR_PAGE,
    };
};
