import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  Alert,
} from "react-native";
import * as Progress from "react-native-progress";
import { Text, Button, ButtonText } from "@gluestack-ui/themed";
import colors from "../../utils/colors";

interface Referral {
  id: string;
  personName: string; // Referrer's name
  status: string;
  property: string;
  progress: number; // Progress as a decimal
}

const dummyReferrals: Referral[] = [
  {
    id: "1",
    personName: "Wambui Kimani",
    status: "Processing",
    property: "Ocean View Ridge - Vipingo",
    progress: 0.0,
  },
  {
    id: "2",
    personName: "Achieng' Otieno",
    status: "In Progress",
    property: "Ocean View Ridge - Vipingo",
    progress: 0.34,
  },
  {
    id: "3",
    personName: "Kibet Kipchirchir",
    status: "Completed",
    property: "Ushindi Gardens",
    progress: 1,
  },
];

const ReferralProgressScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleRedeemReward = () => {
    Alert.alert("Reward Processing", "Your reward is being processed.");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={dummyReferrals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.referralItem}>
          {/* Person's Name */}
          <Text style={styles.personName}>{item.personName}</Text>
          {/* Property Name */}
          <Text style={styles.propertyName}>{item.property}</Text>
          {/* Status */}
          <Text style={styles.status}>
            <Text
              style={{
                fontWeight: "bold",
                color:
                  item.status === "Completed"
                    ? "#4CAF50"
                    : item.status === "In Progress"
                    ? "#FF9800"
                    : "#F44336",
              }}
            >
              {item.status}
            </Text>
          </Text>
          {/* Progress Chart */}
          <View style={styles.progressContainer}>
            <Progress.Circle
              progress={item.progress}
              size={120}
              thickness={12}
              color={
                item.status === "Completed"
                  ? colors.success
                  : item.status === "In Progress"
                  ? colors.warning
                  : colors.danger
              }
              showsText
              formatText={() => `${Math.floor(item.progress * 100)}%`}
              strokeCap="round"
              textStyle={styles.progressText}
            />
          </View>

          {/* Redeem Reward Button for Completed referrals */}
          {item.status === "Completed" && (
            <Button style={styles.redeemButton} onPress={handleRedeemReward}>
              <ButtonText>Redeem Reward</ButtonText>
            </Button>
          )}
        </View>
      )}
    />
  );
};

export default ReferralProgressScreen;

const styles = StyleSheet.create({
  referralItem: {
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  personName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495E",
    marginBottom: 5,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 15,
  },
  status: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 10,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  redeemButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
