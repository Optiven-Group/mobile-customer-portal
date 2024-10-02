import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./AppNavigator"; // The Tab Navigator
import MakePaymentScreen from "../screens/make-payment/MakePaymentScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import SupportScreen from "../screens/support/SupportScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={AppNavigator} />
      <Stack.Screen name="MakePayment" component={MakePaymentScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
