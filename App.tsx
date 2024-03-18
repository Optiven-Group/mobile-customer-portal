import { config } from "@gluestack-ui/config";
import { GluestackUIProvider, useColorMode } from "@gluestack-ui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OverviewNavigator from "./app/navigation/OverviewNavigator";
import ActionButton from "./app/navigation/ActionButton";
import AccountScreen from "./app/screens/AccountScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={() => ({
            tabBarStyle: {
              borderTopWidth: 0,
            },
            tabBarActiveTintColor: "green",
            // tabBarShowLabel: false,
          })}
          initialRouteName="Overview"
        >
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
            component={AccountScreen}
            options={({ navigation }) => ({
              tabBarButton: () => (
                <ActionButton onPress={() => navigation.navigate("Account")} />
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
            component={AccountScreen}
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
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

