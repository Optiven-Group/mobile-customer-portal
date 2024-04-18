import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OverviewNavigator from "./OverviewNavigator";
import ActionButton from "./ActionButton";
import AccountScreen from "../screens/AccountScreen";
import { View, Text } from "react-native";
import AccountNavigator from "./AccountNavigator";

const PlaceholderComponent = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>No content here. This tab is for actions.</Text>
  </View>
);
const Tab = createBottomTabNavigator();

const tabScreenOptions = {
  tabBarStyle: { borderTopWidth: 0 },
  tabBarActiveTintColor: "green",
  headerShown: false,
};

const AppNavigator = () => {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions} initialRouteName="Overview">
      <Tab.Screen
        name="Overview"
        component={OverviewNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Action Center"
        component={PlaceholderComponent}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <ActionButton
              onPress={() => {
                console.log("Action Center button pressed");
              }}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              color={color}
              size={size}
            />
          ),
        })}
      />
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
