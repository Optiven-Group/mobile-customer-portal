import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Screen from "../app-components/Screen";
import moment from "moment";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import colors from "../utils/colors";
import { AppNotification } from "../navigation/types";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

const PAGE_SIZE = 20;

const NotificationsScreen = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [noMoreData, setNoMoreData] = useState<boolean>(false);

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

  const fetchNotifications = async (pageNumber = 1) => {
    if (!user) return;

    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await api.get(
        `/notifications?page=${pageNumber}&limit=${PAGE_SIZE}`
      );
      const fetched: AppNotification[] = response.data.notifications;

      if (fetched.length < PAGE_SIZE) {
        // Means there's no more data after this
        setNoMoreData(true);
      }

      if (pageNumber === 1) {
        setNotifications(fetched);
      } else {
        setNotifications((prev) => [...prev, ...fetched]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, [user]);

  const loadMore = () => {
    if (!loadingMore && !noMoreData) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
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

  if (loading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications received yet.</Text>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={{ margin: 20 }}
            />
          ) : null
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
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
