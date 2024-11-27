import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor to attach the access token
api.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to token expiration
    if (
      error.response?.status === 401 &&
      error.response.data.error === "Access token expired" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If token refresh is already in progress, queue the request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) {
          // No refresh token, redirect to login or handle accordingly
          isRefreshing = false;
          return Promise.reject(error);
        }

        // Request new tokens from the server
        const response = await axios.post(`${BASE_URL}/refresh-token`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;

        // Save new tokens
        await AsyncStorage.setItem("accessToken", access_token);
        await AsyncStorage.setItem("refreshToken", refresh_token);

        // Update authorization header
        api.defaults.headers.common["Authorization"] = "Bearer " + access_token;
        originalRequest.headers["Authorization"] = "Bearer " + access_token;

        processQueue(null, access_token);

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        // Optionally, navigate to login screen
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
