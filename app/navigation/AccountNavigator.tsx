import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screens/AccountScreen";
import DealsScreen from "../screens/DealsScreen"; // Import the new DealsScreen
import { AccountStackParamList } from "./types";
import LoyaltyInfoScreen from "../screens/loyalty/LoyaltyInfoScreen";

const Stack = createNativeStackNavigator<AccountStackParamList>();

const AccountNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: "My Account" }}
      />
      <Stack.Screen
        name="Deals"
        component={DealsScreen}
        options={{ title: "Property Deals" }}
      />
      <Stack.Screen
        name="LoyaltyProgramInfo"
        component={LoyaltyInfoScreen}
        options={{ title: "Loyalty Program Info" }}
      />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
