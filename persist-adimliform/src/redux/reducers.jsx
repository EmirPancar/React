import { combineReducers } from "redux";
import formReducer from "./formSlice";

const rootReducer = combineReducers({
  form: formReducer,
});

export default rootReducer;