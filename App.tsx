import React from "react";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./app/navigation/RootNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert } from "react-native";
import {
  NotificationProvider,
  useNotifications,
} from "./app/context/NotificationContext";
import { MembershipProvider } from "./app/context/MembershipContext";

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <AuthProvider>
      <MembershipProvider>
        <NotificationProvider>
          <GluestackUIProvider config={config}>
            <NavigationContainer>
              <MainNavigator />
            </NavigationContainer>
            <NotificationHandler />
          </GluestackUIProvider>
        </NotificationProvider>
      </MembershipProvider>
    </AuthProvider>
  );
}

const MainNavigator = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <RootNavigator /> : <AuthNavigator />;
};

const NotificationHandler = () => {
  const { addNotification } = useNotifications();

  React.useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
        addNotification(notification);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  return null;
};

export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for notifications!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }
  return token;
}
