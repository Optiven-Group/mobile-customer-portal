import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert } from "react-native";
import { LeadFile } from "../navigation/types";
import axios from "axios";
import { BASE_URL } from "../config";

// Define the User interface
interface User {
  id: number;
  email: string;
  name: string;
  customerNumber: string;
  leadFiles: LeadFile[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (accessToken: string, refreshToken: string, userData: User) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
      const userDataString = await AsyncStorage.getItem("userData");

      if (storedAccessToken && storedRefreshToken && userDataString) {
        const userData: User = JSON.parse(userDataString);
        setUser(userData);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (
    accessToken: string,
    refreshToken: string,
    userData: User
  ) => {
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIsLoggedIn(true);

    const pushToken = await registerForPushNotificationsAsync();
    if (pushToken) {
      await api.post("/save-push-token", { pushToken });
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("userData");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);

    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/refresh-token`, {
        refresh_token: refreshToken,
      });
      const { access_token, refresh_token } = response.data;
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      await AsyncStorage.setItem("accessToken", access_token);
      await AsyncStorage.setItem("refreshToken", refresh_token);
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for notifications!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }
  return token;
}
