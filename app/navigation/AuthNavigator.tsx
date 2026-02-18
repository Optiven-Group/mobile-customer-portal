import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VerifyUserScreen from "../screens/auth/VerifyUserScreen";
import VerifyOTPScreen from "../screens/auth/VerifyOTPScreen";
import CreatePasswordScreen from "../screens/auth/CreatePasswordScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import SplashScreen from "../screens/auth/SplashScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import KYCVerificationScreen from "../screens/auth/KYCVerificationScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="VerifyUser"
        component={VerifyUserScreen}
        options={{ title: "Register", headerShown: false }}
      />
      <Stack.Screen
        name="VerifyOTP"
        component={VerifyOTPScreen}
        options={{ title: "Verify OTP", headerShown: false }}
      />
      <Stack.Screen
        name="CreatePassword"
        component={CreatePasswordScreen}
        options={{ title: "Create Password", headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Forgot Password", headerShown: false }}
      />
      <Stack.Screen
        name="KYCVerification"
        component={KYCVerificationScreen}
        options={{ title: "KYC Verification", headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Register", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
