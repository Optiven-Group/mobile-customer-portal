import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OverviewNavigator from "./OverviewNavigator";
import ActionButton from "./ActionButton";
import AccountNavigator from "./AccountNavigator";

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

      {/* Action Center Tab */}
      <Tab.Screen
        name="Action Center"
        options={{
          tabBarButton: () => <ActionButton />,
        }}
      >
        {() => null}
      </Tab.Screen>

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
