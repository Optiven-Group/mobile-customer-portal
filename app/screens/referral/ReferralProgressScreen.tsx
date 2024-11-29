import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Dimensions } from "react-native";
import { Text, VStack } from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../utils/colors";

const ReferralProgressScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate a network request or any async operation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading referrals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VStack alignItems="center" justifyContent="center" m="$4">
        <MaterialCommunityIcons
          name="information-outline"
          size={80}
          color={colors.primary}
        />
        <Text style={styles.messageText}>
          Once approved, your referrals will appear here.
        </Text>
      </VStack>
    </View>
  );
};

export default ReferralProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  messageText: {
    fontSize: 24,
    color: colors.primary,
    textAlign: "center",
    fontWeight: "700",
  },
});
