import { useSelector } from "react-redux";

export function setupAxios(axios) {
  axios.defaults.headers.Accept = "application/json";
  axios.interceptors.request.use(
    (config) => {
      const selector = useSelector((state) => state.auth);
      const token = selector.token;
      if (selector.token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    async (err) => await Promise.reject(err)
  );
}
