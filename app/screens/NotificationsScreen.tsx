import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { Feather } from "@expo/vector-icons"; // For unique icons
import Screen from "../app-components/Screen";
import moment from "moment"; // For calculating relative time

// Hardcoded notifications data with timestamps
const referralNotifications = [
  {
    id: "1",
    title: "Referral In Progress",
    body: "Your referral for Ocean View Ridge - Vipingo is now in progress.",
    icon: "clock", // Feather icon name
    timestamp: "2024-10-16 09:35 AM", // Timestamp for notification
  },
  {
    id: "2",
    title: "Referral Completed",
    body: "Your referral for Ushindi Gardens has been successfully completed!",
    icon: "check-circle", // Feather icon name
    timestamp: "2024-10-15 04:20 PM", // Timestamp for notification
  },
  {
    id: "3",
    title: "Referral Processing",
    body: "Your referral for Ocean View Ridge - Vipingo is being processed.",
    icon: "refresh-cw", // Feather icon name
    timestamp: "2024-10-14 12:10 PM", // Timestamp for notification
  },
  {
    id: "4",
    title: "Payment Reminder",
    body: "Your next instalment for Ocean View Ridge - Vipingo is due in two days.",
    icon: "calendar", // Feather icon name for payment reminder
    timestamp: "2024-10-16 11:00 AM", // Timestamp for notification
  },
  {
    id: "5",
    title: "Optiven at 25!",
    body: "Optiven is celebrating 25 years of transforming lives. Join us in the celebration!",
    icon: "star", // Feather icon name for announcement
    timestamp: "2024-10-14 08:00 AM", // Timestamp for announcement
  },
];

// Function to convert timestamp to relative time (e.g., "2 hours ago")
const getTimeAgo = (timestamp:any) => {
  return moment(timestamp, "YYYY-MM-DD hh:mm A").fromNow();
};

const NotificationsScreen = () => {
  return (
    <Screen style={styles.container}>
      <FlatList
        data={referralNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Feather
              name={item.icon}
              size={24}
              color="#4CAF50"
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.timestamp}>{getTimeAgo(item.timestamp)}</Text>
            </View>
          </View>
        )}
      />
    </Screen>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  body: {
    marginTop: 4,
    fontSize: 14,
    color: "#7F8C8D",
  },
  timestamp: {
    marginTop: 4,
    fontSize: 12,
    color: "#B0B0B0", // Lighter color for timestamp
  },
});
