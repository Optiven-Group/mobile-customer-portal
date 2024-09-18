import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api: AxiosInstance = axios.create({
  baseURL: "http://192.168.0.205:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
