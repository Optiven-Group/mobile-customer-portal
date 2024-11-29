import Constants from "expo-constants";

// const ENV = Constants.expoConfig?.extra?.env || "development";
const ENV = "production";

const getBaseUrl = () => {
  if (ENV === "production" || ENV === "staging") {
    // Use the deployed server IP address for production and staging
    return "http://167.99.80.202";
  } else if (Constants.expoConfig?.hostUri) {
    // Continue to use the Expo-hosted local IP for development on LAN
    return `http://${Constants.expoConfig.hostUri.split(":").shift()}:8080`;
  } else {
    return "http://192.168.0.152:8080"; // Default fallback for development
  }
};

export const BASE_URL = getBaseUrl();
