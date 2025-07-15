import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";
import ticket from "./ticket";
import user from "./user"
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const authConfig = {
  key: "auth",
  storage,
};

const ticketConfig = {
  key: "ticket",
  storage,
};

const userConfig = {
  key: "user",
  storage,
};

const reducer = combineReducers({
  auth: persistReducer(authConfig, auth),
  user: persistReducer(userConfig, user),
  ticket: persistReducer(ticketConfig, ticket)
});

export default reducer;
