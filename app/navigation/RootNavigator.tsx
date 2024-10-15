import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./AppNavigator";
import SettingsScreen from "../screens/settings/SettingsScreen";
import SupportScreen from "../screens/support/SupportScreen";
import { RootStackParamList } from "./types";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import StripePaymentScreen from "../screens/make-payment/StripePaymentScreen";
import MpesaPaymentScreen from "../screens/make-payment/MpesaPaymentScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      {/* Hide the header for the AppNavigator */}
      <Stack.Screen
        name="Main"
        component={AppNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StripePayment"
        component={StripePaymentScreen}
        options={{ title: "Bank" }}
      />
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethodScreen}
        options={{ title: "Payment" }}
      />
      <Stack.Screen
        name="MpesaPayment"
        component={MpesaPaymentScreen}
        options={{ title: "Mpesa" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{ title: "Support" }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
