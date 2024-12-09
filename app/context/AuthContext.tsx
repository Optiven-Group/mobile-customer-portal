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
import { logout as logoutUtil } from "../utils/authUtils";

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
  login: (accessToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      const userDataString = await AsyncStorage.getItem("userData");

      if (storedAccessToken && userDataString) {
        const userData: User = JSON.parse(userDataString);
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (accessToken: string, userData: User) => {
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);

    const pushToken = await registerForPushNotificationsAsync();
    if (pushToken) {
      await api
        .post("/save-push-token", { push_token: pushToken })
        .catch((err) => {
          console.error("Failed to save push token:", err);
        });
    }
  };

  const logout = async () => {
    // Just do local cleanup
    await logoutUtil();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }
  return token;
}
