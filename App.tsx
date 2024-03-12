import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import HomeScreen from "./app/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PaymentScheduleScreen from "./app/screens/PaymentScheduleScreen";
import ViewReceiptsScreen from "./app/screens/ViewReceiptsScreen";
import SalesAgreementScreen from "./app/screens/SalesAgreementScreen";
import ViewStatementsScreen from "./app/screens/ViewStatementsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Overview" }}
          />
          <Stack.Screen
            name="Payment Schedule"
            component={PaymentScheduleScreen}
          />
          <Stack.Screen name="View Receipts" component={ViewReceiptsScreen} />
          <Stack.Screen
            name="Sales Agreement"
            component={SalesAgreementScreen}
          />
          <Stack.Screen
            name="View Statements"
            component={ViewStatementsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

