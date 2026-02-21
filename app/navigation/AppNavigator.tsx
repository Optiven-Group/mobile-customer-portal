import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View, Platform } from "react-native";
import OverviewNavigator from "./OverviewNavigator";
import AccountNavigator from "./AccountNavigator";
import PropertyNavigator from "./PropertyNavigator";
import ReferralNavigator from "./ReferralNavigator";
import colors from "../utils/colors";

const Tab = createMaterialTopTabNavigator();

const AppNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Overview"
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarShowIcon: true,
        tabBarShowLabel: true,
        tabBarStyle: {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 6,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 8),
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          textTransform: "none",
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
          height: 3,
          borderRadius: 2,
          position: "absolute",
          top: 0,
        },
        tabBarPressColor: "rgba(0,128,0,0.08)",
      }}
    >
      {/* Overview Tab */}
      <Tab.Screen
        name="Overview"
        component={OverviewNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={22} />
          ),
        }}
      />

      {/* Refer Tab */}
      <Tab.Screen
        name="Refer & Earn"
        component={ReferralNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cash-plus" color={color} size={22} />
          ),
        }}
      />

      {/* My Properties Tab */}
      <Tab.Screen
        name="My Properties"
        component={PropertyNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-city" color={color} size={22} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
