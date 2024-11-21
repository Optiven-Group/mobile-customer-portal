import Constants from "expo-constants";

const ENV = Constants.expoConfig?.extra?.env || "development";

const getBaseUrl = () => {
  if (ENV === "production" || ENV === "staging") {
    // Use the deployed server IP address for production and staging
    return "http://159.65.25.67:8080";
  } else if (Constants.expoConfig?.hostUri) {
    // Continue to use the Expo-hosted local IP for development on LAN
    return `http://${Constants.expoConfig.hostUri.split(":").shift()}:8080`;
  } else {
    return "http://192.168.0.152:8080"; // Default fallback for development (this changes all the time btw, check expo startup details)
  }
};

export const BASE_URL = getBaseUrl();
