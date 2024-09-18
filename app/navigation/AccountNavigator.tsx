import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screens/AccountScreen";
import { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

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
    </Stack.Navigator>
  );
};

export default AccountNavigator;
