import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";
import SettingsScreen from "../screens/settings/SettingsScreen";
import SupportScreen from "../screens/support/SupportScreen";
import { RootStackParamList } from "./types";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import MpesaPaymentScreen from "../screens/make-payment/MpesaPaymentScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      {/* Hide the header for the DrawerNavigator which contains AppNavigator */}
      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
        options={{ headerShown: false }}
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
