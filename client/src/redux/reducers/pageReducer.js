import { SET_PAGE, CLEAR_PAGE } from "../types";

const initialState = {
    page: "/atoz/a",
    scrollPos: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PAGE:
            return {
                ...state,
                ...action.payload,
            };
        case CLEAR_PAGE:
            return {
                ...initialState,
            };
        default:
            return state;
    }
};
