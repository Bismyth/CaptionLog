import { GET_ERRORS, CLEAR_ERRORS } from "../types";

const initialState = {
	errors: [],
	status: null,
	id: null,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_ERRORS:
			return {
				errors: action.payload.errors,
				status: action.payload.status,
				id: action.payload.id,
			};
		case CLEAR_ERRORS:
			return initialState;
		default:
			return state;
	}
};