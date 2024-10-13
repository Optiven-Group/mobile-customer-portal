import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { useNotifications } from "../context/NotificationContext";

const NotificationsScreen = () => {
  const { notifications } = useNotifications();

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => item.request.identifier + index}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.title}>{item.request.content.title}</Text>
            <Text style={styles.body}>{item.request.content.body}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontWeight: "bold",
  },
  body: {
    marginTop: 4,
  },
});
