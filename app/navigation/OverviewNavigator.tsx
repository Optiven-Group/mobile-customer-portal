import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OverviewStackParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import PaymentScheduleScreen from "../screens/payment-schedule/PaymentScheduleScreen";
import SalesAgreementScreen from "../screens/SalesAgreementScreen";
import ViewStatementsScreen from "../screens/statements/ViewStatementsScreen";
import ProjectSelectionScreen from "../screens/ProjectSelectionScreen"; // Adjusted import
import PropertySelectionForPaymentScreen from "../screens/payment-schedule/PropertySelectionScreen"; // New import
import SelectPropertyForStatementsScreen from "../screens/statements/SelectProperty";
import ViewReceiptsScreen from "../screens/receipts/ViewReceiptsScreen";
import ProjectSelectionForReceiptsScreen from "../screens/ProjectSelectionScreen";
import PropertySelectionForReceiptsScreen from "../screens/receipts/PropertySelectionScreen";

const Stack = createNativeStackNavigator<OverviewStackParamList>();

const OverviewNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Overview" }}
      />
      {/* Payment Schedule Flow */}
      <Stack.Screen
        name="Project Selection for Payment"
        component={ProjectSelectionScreen}
        options={{ title: "Select Project" }}
      />
      <Stack.Screen
        name="Property Selection for Payment"
        component={PropertySelectionForPaymentScreen}
        options={{ title: "Select Property" }}
      />
      <Stack.Screen name="Payment Schedule" component={PaymentScheduleScreen} />
      {/* Receipts Flow */}
      <Stack.Screen
        name="Project Selection"
        component={ProjectSelectionForReceiptsScreen}
        options={{ title: "Select Project" }}
      />
      <Stack.Screen
        name="Property Selection"
        component={PropertySelectionForReceiptsScreen}
        options={{ title: "Select Property" }}
      />
      <Stack.Screen
        name="View Receipts"
        component={ViewReceiptsScreen}
        options={{ title: "Receipts" }}
      />
      <Stack.Screen name="Sales Agreement" component={SalesAgreementScreen} />
      <Stack.Screen
        name="Select Property for Statements"
        component={SelectPropertyForStatementsScreen}
        options={{ title: "Select Property" }}
      />
      <Stack.Screen name="View Statements" component={ViewStatementsScreen} />
    </Stack.Navigator>
  );
};

export default OverviewNavigator;
