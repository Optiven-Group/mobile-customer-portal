import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export const logout = async () => {
  try {
    // Attempt to call the backend to invalidate the token
    await api.post("/logout");
  } catch (error: any) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Token is invalid or expired; proceed with logout without logging an error
    } else {
      console.error("Failed to log out:", error);
    }
  }

  // Remove tokens and user data from AsyncStorage
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");
  await AsyncStorage.removeItem("userData");
};
