import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OverviewStackParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import PaymentScheduleScreen from "../screens/payment-schedule/PaymentScheduleScreen";
import ViewReceiptsScreen from "../screens/ViewReceiptsScreen";
import SalesAgreementScreen from "../screens/SalesAgreementScreen";
import ViewStatementsScreen from "../screens/statements/ViewStatementsScreen";
import SelectPropertyScreen from "../screens/payment-schedule/SelectPropertyScreen";
import SelectPropertyForStatementsScreen from "../screens/statements/SelectProperty";

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
      <Stack.Screen name="Properties" component={SelectPropertyScreen} />
      <Stack.Screen name="Payment Schedule" component={PaymentScheduleScreen} />
      <Stack.Screen name="View Receipts" component={ViewReceiptsScreen} />
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
