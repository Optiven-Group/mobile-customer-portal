import React from "react";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./app/navigation/RootNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {
  return (
    <AuthProvider>
      <GluestackUIProvider config={config}>
        <StripeProvider publishableKey="pk_live_51IdvJgK5HXK2AlvIpE92GtBv8lqz6UDrnneZaOSSFsy4Kf7vI2DWodkpAevs3S8riKBgYYXAhMtgJhVDjjkRAkVP00H6c6gwd1">
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </StripeProvider>
      </GluestackUIProvider>
    </AuthProvider>
  );
}

const MainNavigator = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <RootNavigator /> : <AuthNavigator />;
};
