import React, { useEffect, useRef } from "react";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./app/navigation/RootNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
import {
  NotificationProvider,
  useNotifications,
} from "./app/context/NotificationContext";
import { MembershipProvider } from "./app/context/MembershipContext";
import api from "./app/utils/api";
import { AppNotification } from "./app/navigation/types";

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
            <AuthConsumer />
          </GluestackUIProvider>
        </NotificationProvider>
      </MembershipProvider>
    </AuthProvider>
  );
}

// Memoized MainNavigator to prevent unnecessary re-renders
const MainNavigator = React.memo(() => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <RootNavigator /> : <AuthNavigator />;
});

// Conditional rendering of NotificationHandler based on authentication
const AuthConsumer = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <NotificationHandler /> : null;
};

const NotificationHandler = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const notificationListener = useRef<any>(null);

  useEffect(() => {
    // Only proceed if user is logged in
    if (!user) return;

    // Register for push notifications
    registerForPushNotificationsAsync().then(async (expoPushToken) => {
      if (expoPushToken) {
        try {
          await api.post("/save-push-token", { push_token: expoPushToken });
          console.log("Push token saved successfully");
        } catch (error) {
          console.error("Failed to save push token:", error);
        }
      }
    });

    // Listener for incoming notifications
    if (notificationListener.current === null) {
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("Notification received:", notification);

          // Create a notification object conforming to AppNotification
          const appNotification: AppNotification = {
            id: Date.now(), // Generate a unique ID
            user_id: user.id,
            title: notification.request.content.title || "No Title",
            body: notification.request.content.body || "No Body",
            data: JSON.stringify(notification.request.content.data || {}),
            created_at: new Date().toISOString(),
          };

          // Add notification to context
          addNotification(appNotification);
        });
    }

    // Clean up the notification listener when component unmounts
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        notificationListener.current = null;
      }
    };
  }, [user]); // Depend only on 'user'

  return null;
};

async function registerForPushNotificationsAsync() {
  let expoPushToken: string | undefined;

  try {
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      console.log("Existing notification permission status:", existingStatus);
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log("Requested notification permission status:", status);
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert("Failed to get push token for notifications!");
        return;
      }
      const tokenData = await Notifications.getExpoPushTokenAsync();
      expoPushToken = tokenData.data;
      console.log("Expo Push Token:", expoPushToken);
    } else {
      Alert.alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return expoPushToken;
  } catch (error) {
    console.error("Error in registerForPushNotificationsAsync:", error);
    return undefined;
  }
}
