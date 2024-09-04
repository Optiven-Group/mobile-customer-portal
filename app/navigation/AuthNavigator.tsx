import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VerifyUserScreen from "../screens/VerifyUserScreen";
import VerifyOTPScreen from "../screens/VerifyOTPScreen";
import CreatePinScreen from "../screens/CreatePinScreen";
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator();

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
        name="Verify User"
        component={VerifyUserScreen}
        options={{ title: "Verify User", headerShown: false }}
      />
      <Stack.Screen
        name="Verify OTP"
        component={VerifyOTPScreen}
        options={{ title: "Verify OTP", headerShown: false }}
      />
      <Stack.Screen
        name="Create PIN"
        component={CreatePinScreen}
        options={{ title: "Create PIN", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
