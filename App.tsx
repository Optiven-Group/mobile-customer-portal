import React, { useEffect } from "react";
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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppNotification } from "./app/navigation/types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync().then(async (expoPushToken) => {
      if (expoPushToken) {
        const authToken = await AsyncStorage.getItem("authToken");
        try {
          await axios.post(
            "/save-push-token",
            {
              push_token: expoPushToken,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          console.log("Push token saved successfully");
        } catch (error) {
          console.error("Failed to save push token:", error);
        }
      }
    });
  }, []);

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
  const { user } = useAuth(); // Ensure you have access to the current user

  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      async (notification) => {
        console.log("Notification received:", notification);

        // Retrieve user ID from context or another source
        const authToken = await AsyncStorage.getItem("authToken");
        let userId = 0;
        if (authToken) {
          // Decode JWT to get user ID or fetch from a secure store/context
          // This is a placeholder. Implement your own method to get the user ID.
          // For example, if you're using JWT:
          /*
          const decoded: any = jwtDecode(authToken);
          userId = decoded.user_id;
          */
          // For now, assume `user` is available from context:
          userId = user?.id || 0;
        }

        if (userId === 0) {
          console.error("User ID not found. Cannot associate notification.");
          return;
        }

        // Create a notification object conforming to AppNotification
        const appNotification: AppNotification = {
          id: Date.now(), // Generate a unique ID. Alternatively, have the backend assign IDs.
          user_id: userId,
          title: notification.request.content.title || "No Title",
          body: notification.request.content.body || "No Body",
          data: JSON.stringify(notification.request.content.data || {}),
          created_at: new Date().toISOString(), // Use server time ideally
        };

        // Optionally, you can send this notification to the backend to save it
        try {
          await axios.post(
            "/send-notification",
            {
              user_id: userId,
              title: appNotification.title,
              body: appNotification.body,
              data: notification.request.content.data || {},
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          console.log("Notification sent to backend and saved.");
        } catch (error) {
          console.error("Failed to send notification to backend:", error);
        }

        addNotification(appNotification);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, [addNotification, user]);

  return null;
};

export async function registerForPushNotificationsAsync() {
  let expoPushToken: string | undefined;
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
    const tokenData = await Notifications.getExpoPushTokenAsync();
    expoPushToken = tokenData.data;
    console.log("Expo Push Token:", expoPushToken);
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  if (Constants.manifest?.platform?.ios) {
    Notifications.setNotificationCategoryAsync("default", []);
  }

  return expoPushToken;
}
