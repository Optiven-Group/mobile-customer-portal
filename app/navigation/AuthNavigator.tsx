import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VerifyUserScreen from "../screens/VerifyUserScreen";
import VerifyOTPScreen from "../screens/VerifyOTPScreen";
import CreatePasswordScreen from "../screens/CreatePasswordScreen";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
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
    </Stack.Navigator>
  );
};

export default AuthNavigator;
