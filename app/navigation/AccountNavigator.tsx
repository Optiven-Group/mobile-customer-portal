import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screens/AccountScreen";
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
      {/* <Stack.Screen
        name="LoyaltyInfo"
        component={LoyaltyInfoScreen}
        options={{ title: "Loyalty Info" }}
      /> */}
    </Stack.Navigator>
  );
};

export default AccountNavigator;
