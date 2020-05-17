import { GET_ERRORS, CLEAR_ERRORS } from "../types";

//RETURN ERRORS
export const returnErrors = (errors, status, id = null) => {
	return {
		type: GET_ERRORS,
		payload: { errors, status, id },
	};
};

export const clearErrors = () => {
	return {
		type: CLEAR_ERRORS,
	};
};
