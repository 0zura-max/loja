import axios from "axios";
import Cookies from "js-cookie"; 

const getToken = () => Cookies.get("token");

const api = axios.create({
  baseURL: "https://localhost:7203/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
