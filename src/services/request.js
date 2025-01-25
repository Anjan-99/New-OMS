/* EXTERNAL PACKAGES */
import axios from "axios";

/* REDUX IMPORTS */

/* API'S */
import { SERVER_URL } from "../config/config";
import { store } from "../store/index";

const request = axios.create({
  baseURL: SERVER_URL,
  timeout: 100000, // Adjust the timeout as needed
});

request.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
export const handleAddToken = (token) => {
  request.interceptors.request.use(
    (config) => {
      config.headers.Authorization = token;
      config.headers["host"] = token;
      return config;
    },
    (error) => {
      console.log(error);
      return error;
    },
  );
};
export default request;
