// HowItWorksScreen.tsx

import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Text } from "@gluestack-ui/themed";

const HowItWorksScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>How It Works</Text>
      <Text style={styles.content}>
        {/* Replace with actual content */}
        Invite your friends to join us and earn rewards when they make a
        purchase. Share your unique referral code or QR code, and start earning
        today!
      </Text>
    </ScrollView>
  );
};

export default HowItWorksScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
  },
});
