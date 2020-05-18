import { SET_PAGE } from "../types";

const initialState = {
	page: "Home",
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_PAGE:
			return {
				...state,
				page: action.payload.page,
			};
		default:
			return state;
	}
};
