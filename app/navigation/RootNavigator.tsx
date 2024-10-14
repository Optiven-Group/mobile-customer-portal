import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./AppNavigator"; // The Tab Navigator
import SettingsScreen from "../screens/settings/SettingsScreen";
import SupportScreen from "../screens/support/SupportScreen";
import { RootStackParamList } from "./types";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import StripePaymentScreen from "../screens/make-payment/StripePaymentScreen";
import MpesaPaymentScreen from "../screens/make-payment/MpesaPaymentScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={AppNavigator} />
      <Stack.Screen name="StripePayment" component={StripePaymentScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="MpesaPayment" component={MpesaPaymentScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
