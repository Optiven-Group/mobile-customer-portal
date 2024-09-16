import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://192.168.0.153:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
