import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import Screen from "../app-components/Screen";
import moment from "moment";
import { useNotifications } from "../context/NotificationContext";
import { AppNotification } from "../navigation/types";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

const NotificationsScreen = () => {
  const { notifications } = useNotifications();

  const getTimeAgo = (dateString?: string) => {
    return dateString ? moment(dateString).fromNow() : "";
  };

  const getIconName = (notification: AppNotification): FeatherIconName => {
    const title = notification.title || "";
    if (title.includes("Referral")) {
      if (title.includes("In Progress")) return "clock";
      if (title.includes("Completed")) return "check-circle";
      if (title.includes("Processing")) return "refresh-cw";
    }
    if (title.includes("Payment Reminder")) return "calendar";
    if (title.includes("Communication")) return "star";
    return "bell";
  };

  const renderItem = ({ item }: { item: AppNotification }) => {
    const { title, body, created_at } = item;
    const timestamp = getTimeAgo(created_at);
    const iconName = getIconName(item);

    return (
      <View style={styles.notificationItem}>
        <Feather
          name={iconName}
          size={24}
          color="#4CAF50"
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title || "No Title"}</Text>
          <Text style={styles.body}>{body || "No Body"}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <Screen style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications received yet.</Text>
        }
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
    color: "#B0B0B0",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
});
