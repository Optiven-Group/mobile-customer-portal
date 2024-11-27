import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OverviewStackParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import PaymentScheduleScreen from "../screens/payment-schedule/PaymentScheduleScreen";
import PaymentProgressScreen from "../screens/PaymentProgressScreen";
import ViewStatementsScreen from "../screens/statements/ViewStatementsScreen";
import ProjectSelectionScreen from "../screens/ProjectSelectionScreen";
import PropertySelectionForPaymentScreen from "../screens/payment-schedule/PropertySelectionScreen";
import PropertySelectionForReceiptsScreen from "../screens/receipts/PropertySelectionScreen";
import ViewReceiptsScreen from "../screens/receipts/ViewReceiptsScreen";
import PropertySelectionForStatementsScreen from "../screens/statements/PropertySelectionScreen";
import TitleStatusScreen from "../screens/TitleStatusScreen";

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
      {/* Home Screen */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Overview" }}
      />
      {/* Payment Schedule Flow */}
      <Stack.Screen
        name="Project Selection for Payment"
        component={ProjectSelectionScreen}
        options={{ title: "Project" }}
      />
      <Stack.Screen
        name="Property Selection for Payment"
        component={PropertySelectionForPaymentScreen}
        options={{ title: "Property" }}
      />
      <Stack.Screen name="Payment Schedule" component={PaymentScheduleScreen} />
      {/* Receipts Flow */}
      <Stack.Screen
        name="Project Selection"
        component={ProjectSelectionScreen}
        options={{ title: "Project" }}
      />
      <Stack.Screen
        name="Property Selection"
        component={PropertySelectionForReceiptsScreen}
        options={{ title: "Property" }}
      />
      <Stack.Screen
        name="View Receipts"
        component={ViewReceiptsScreen}
        options={{ title: "Receipts" }}
      />
      {/* Statements Flow */}
      <Stack.Screen
        name="Project Selection for Statements"
        component={ProjectSelectionScreen}
        options={{ title: "Project" }}
      />
      <Stack.Screen
        name="Property Selection for Statements"
        component={PropertySelectionForStatementsScreen}
        options={{ title: "Property" }}
      />
      <Stack.Screen name="View Statements" component={ViewStatementsScreen} />
      {/* Payment Progress */}
      <Stack.Screen name="Payment Progress" component={PaymentProgressScreen} />
      {/* Title Status */}
      <Stack.Screen
        name="Title Status"
        component={TitleStatusScreen}
        options={{ title: "Title Status" }}
      />
    </Stack.Navigator>
  );
};

export default OverviewNavigator;
