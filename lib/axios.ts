import axios from "axios";
import { VITE_API_URL, TOKEN_API } from "@env"
//Este token va a venir del login del qr
const token = TOKEN_API;

const Axios = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

Axios.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.error("Token no disponible");
    }
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
