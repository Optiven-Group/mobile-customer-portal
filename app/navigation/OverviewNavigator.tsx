import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import PaymentScheduleScreen from "../screens/PaymentScheduleScreen";
import ViewReceiptsScreen from "../screens/ViewReceiptsScreen";
import SalesAgreementScreen from "../screens/SalesAgreementScreen";
import ViewStatementsScreen from "../screens/ViewStatementsScreen";

const Stack = createNativeStackNavigator();

const OverviewNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShadowVisible: false,
        headerTransparent: true,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Overview" }}
      />
      <Stack.Screen name="Payment Schedule" component={PaymentScheduleScreen} />
      <Stack.Screen name="View Receipts" component={ViewReceiptsScreen} />
      <Stack.Screen name="Sales Agreement" component={SalesAgreementScreen} />
      <Stack.Screen name="View Statements" component={ViewStatementsScreen} />
    </Stack.Navigator>
  );
};

export default OverviewNavigator;
