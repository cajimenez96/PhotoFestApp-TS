import axios from "axios";
import { VITE_API_URL } from "@env"
//Este token va a venir del login del qr
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmI1NDgyMzlkODdhODcyYzZiMTQxY2EiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwicm9sZSI6eyJfaWQiOiI2NmI1NDRkZDYzY2MzODVjNmNkZDU5ODUiLCJOYW1lIjoiU3VwZXJBZG1pbiIsImNyZWF0ZWRBdCI6IjIwMjQtMDgtMDhUMjI6MjE6MTcuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDgtMDhUMjI6MjE6MTcuMDU2WiIsIl9fdiI6MH0sImlhdCI6MTcyMzc3OTU4MywiZXhwIjoxNzIzODE1NTgzfQ.8tR7FlFY04bFLQXf3ZZIN7Cf_qaKhOa_HAYrXMduojE';

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
