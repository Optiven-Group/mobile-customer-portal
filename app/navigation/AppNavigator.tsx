import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OverviewNavigator from "./OverviewNavigator";
import AccountNavigator from "./AccountNavigator";
import ReferScreen from "../screens/ReferScreen";
import NotificationsScreen from "../screens/NotificationsScreen";

const Tab = createBottomTabNavigator();

const tabScreenOptions = {
  tabBarStyle: { borderTopWidth: 0 },
  tabBarActiveTintColor: "green",
  headerShown: false,
};

const AppNavigator = () => {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions} initialRouteName="Overview">
      {/* Overview Tab */}
      <Tab.Screen
        name="Overview"
        component={OverviewNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />

      {/* Refer Tab */}
      <Tab.Screen
        name="Refer & Earn"
        component={ReferScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-multiple-plus"
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* Notifications Tab */}
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
