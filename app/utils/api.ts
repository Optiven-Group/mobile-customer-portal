import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";
import { logout } from "./authUtils";

const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the request is to /logout and returns 401, just ignore and don't logout again
    if (
      error.config.url.includes("/logout") &&
      error.response &&
      error.response.status === 401
    ) {
      // The user might not have a valid token, so let's just ignore and proceed
      return Promise.reject(error);
    }

    // If 401 on other requests, logout once if needed
    if (error.response && error.response.status === 401) {
      await logout();
    }

    return Promise.reject(error);
  }
);

export default api;
