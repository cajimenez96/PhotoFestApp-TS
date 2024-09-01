import axios from "axios";
import { VITE_API_URL } from "@env";
import { getAsyncStorage } from "../helpers/helper";
import { TOKEN } from "../common/constants";

const Axios = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

Axios.interceptors.request.use(
  async (config) => {
    const token = await getAsyncStorage(TOKEN);
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default Axios;
