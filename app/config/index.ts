import Constants from "expo-constants";

const ENV = Constants.expoConfig?.extra?.env || "development";

const getBaseUrl = () => {
  if (ENV === "production") {
    return "https://production-url.com";
  } else if (ENV === "staging") {
    return "https://staging-url.com";
  } else if (Constants.expoConfig?.hostUri) {
    return `http://${Constants.expoConfig.hostUri.split(":").shift()}:8080`;
  } else {
    return "http://192.168.0.11:8080"; // Default fallback for development (this changes all the time btw, check expo startup details)
  }
};

export const BASE_URL = getBaseUrl();
