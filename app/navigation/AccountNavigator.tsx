import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screens/account/AccountScreen";
import DealsScreen from "../screens/account/DealsScreen";
import { AccountStackParamList } from "./types";
import LoyaltyInfoScreen from "../screens/account/LoyaltyInfoScreen";
import PersonalDetailsScreen from "../screens/PersonalDetailsScreen";
import EditDetailsScreen from "../screens/EditDetailsScreen";

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
        options={{ title: "Deals" }}
      />
      <Stack.Screen
        name="LoyaltyProgramInfo"
        component={LoyaltyInfoScreen}
        options={{ title: "Loyalty Program Info" }}
      />
      <Stack.Screen
        name="PersonalDetails"
        component={PersonalDetailsScreen}
        options={{ title: "Personal Details" }}
      />
      <Stack.Screen
        name="EditDetails"
        component={EditDetailsScreen}
        options={{ title: "Edit Details" }}
      />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
