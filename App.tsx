import React, { useEffect, useRef } from "react";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import RootNavigator from "./app/navigation/RootNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
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

export const navigationRef = createNavigationContainerRef();

export default function App() {
  return (
    <AuthProvider>
      <MembershipProvider>
        <NotificationProvider>
          <GluestackUIProvider config={config}>
            <NavigationContainer ref={navigationRef}>
              <MainNavigator />
            </NavigationContainer>
            <AuthConsumer />
          </GluestackUIProvider>
        </NotificationProvider>
      </MembershipProvider>
    </AuthProvider>
  );
}

const MainNavigator = React.memo(() => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <RootNavigator /> : <AuthNavigator />;
});

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
      } else {
        console.log(
          "No push token obtained (not a physical device or permissions not granted)."
        );
      }
    });

    // Listener for incoming notifications
    if (notificationListener.current === null) {
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("Notification received:", notification);
          const appNotification: AppNotification = {
            id: Date.now(),
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

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        notificationListener.current = null;
      }
    };
  }, [user]);

  return null;
};

async function registerForPushNotificationsAsync() {
  let expoPushToken: string | undefined;

  try {
    // Check if we are on a physical device
    if (!Constants.isDevice) {
      // On emulators or simulators, just skip requesting push tokens.
      console.log("Not a physical device, skipping push token request.");
      return undefined;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Notification permissions not granted.");
      return;
    }
    const tokenData = await Notifications.getExpoPushTokenAsync();
    expoPushToken = tokenData.data;
    console.log("Expo Push Token:", expoPushToken);

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
