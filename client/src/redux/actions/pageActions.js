import { SET_PAGE } from "../types";

//RETURN ERRORS
export const setPage = (page) => {
	return {
		type: SET_PAGE,
		payload: { page },
	};
};
