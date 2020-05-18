import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import pageReducer from "./pageReducer";

export default combineReducers({
	auth: authReducer,
	error: errorReducer,
	page: pageReducer,
});
