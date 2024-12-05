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
    const originalRequest = error.config;

    // If the error is 401 Unauthorized and the request has not been retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Avoid infinite loop by marking the request as retried
      originalRequest._retry = true;

      // Check if the request is not to the refresh-token or logout endpoints
      if (
        !originalRequest.url.includes("/refresh-token") &&
        !originalRequest.url.includes("/logout")
      ) {
        try {
          const refreshToken = await AsyncStorage.getItem("refreshToken");
          if (refreshToken) {
            // Attempt to refresh the token
            const response = await axios.post(`${BASE_URL}/refresh-token`, {
              refresh_token: refreshToken,
            });
            const { access_token, refresh_token } = response.data;

            // Update tokens in AsyncStorage
            await AsyncStorage.setItem("accessToken", access_token);
            await AsyncStorage.setItem("refreshToken", refresh_token);

            // Update the access token in the Axios instance
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${access_token}`;

            // Retry the original request with the new access token
            originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
            return api(originalRequest);
          } else {
            // No refresh token available, log out the user
            await logout();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // If refreshing the token fails, log out the user
          await logout();
          return Promise.reject(refreshError);
        }
      } else {
        // If the request is to /refresh-token or /logout, do not attempt to refresh token
        return Promise.reject(error);
      }
    }

    // For other errors, reject the promise
    return Promise.reject(error);
  }
);

export default api;
