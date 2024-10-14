import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, FlatList, Alert } from "react-native";
import { View, Text, Button } from "@gluestack-ui/themed";
import api from "../../utils/api";
import colors from "../../utils/colors";

interface Referral {
  id: string;
  name: string;
  status: string;
  amountPaid: number;
}

const ReferralProgressScreen: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await api.get("/referrals");
        setReferrals(response.data.referrals);
      } catch (error) {
        console.error("Failed to fetch referrals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const handleRedeem = async (referralId: string) => {
    try {
      await api.post(`/referrals/${referralId}/redeem`);
      Alert.alert("Success", "Your reward has been redeemed.");
    } catch (error) {
      console.error("Failed to redeem reward:", error);
      Alert.alert("Error", "Failed to redeem reward.");
    }
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
      data={referrals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.referralItem}>
          <Text>Name: {item.name}</Text>
          <Text>Status: {item.status}</Text>
          <Text>Amount Paid: KES {item.amountPaid}</Text>
          {item.status === "Completed" && (
            <Button
              onPress={() => handleRedeem(item.id)}
              style={styles.redeemButton}
            >
              Redeem Reward
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
    borderBottomWidth: 1,
    borderBottomColor: colors.medium,
  },
  redeemButton: {
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
