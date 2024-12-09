import AsyncStorage from "@react-native-async-storage/async-storage";

export const logout = async () => {
  // Clear local storage.
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("userData");
};
