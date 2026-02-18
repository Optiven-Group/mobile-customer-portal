import React, { useState } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Payout {
  id: number;
  amount: number;
  date: string;
  method: string;
  reference: string;
  status: "completed" | "processing" | "failed";
  referrals: string[];
}

const MOCK_PAYOUTS: Payout[] = [
  { id: 1, amount: 25000, date: "2024-04-18", method: "M-Pesa", reference: "TXN-MP-001234", status: "completed", referrals: ["John M."] },
  { id: 2, amount: 15000, date: "2024-03-28", method: "Bank Transfer", reference: "TXN-BK-005678", status: "completed", referrals: ["Lucy W."] },
  { id: 3, amount: 22000, date: "2024-03-01", method: "M-Pesa", reference: "TXN-MP-009012", status: "processing", referrals: ["James M."] },
  { id: 4, amount: 28000, date: "2024-02-15", method: "Wallet", reference: "TXN-WL-003456", status: "completed", referrals: ["Lucy W.", "Peter K."] },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return colors.success;
    case "processing": return colors.warning;
    case "failed": return colors.danger;
    default: return colors.medium;
  }
};

const getMethodIcon = (method: string) => {
  switch (method) {
    case "M-Pesa": return "cellphone";
    case "Bank Transfer": return "bank";
    case "Wallet": return "wallet";
    default: return "cash";
  }
};

const PayoutHistoryScreen = () => {
  const renderItem = ({ item }: { item: Payout }) => (
    <Card variant="elevated" p="$0" mb="$3" borderRadius={14} overflow="hidden">
      <HStack px="$4" py="$3" alignItems="center">
        <Box bg={getStatusColor(item.status) + "18"} p="$2.5" borderRadius="$full" mr="$3">
          <MaterialCommunityIcons name={getMethodIcon(item.method)} size={20} color={getStatusColor(item.status)} />
        </Box>
        <VStack flex={1}>
          <Text bold size="sm">KES {item.amount.toLocaleString()}</Text>
          <Text size="2xs" color="$coolGray500">{item.method} • {item.reference}</Text>
          <Text size="2xs" color="$coolGray400">{new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</Text>
        </VStack>
        <VStack alignItems="flex-end">
          <Box bg={getStatusColor(item.status) + "18"} px="$2" py="$0.5" borderRadius="$sm">
            <Text size="2xs" bold color={getStatusColor(item.status)}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </Box>
          {item.status === "completed" && (
            <TouchableOpacity style={{ marginTop: 4 }}>
              <Text size="2xs" color={colors.primary} bold>Receipt ↓</Text>
            </TouchableOpacity>
          )}
        </VStack>
      </HStack>
    </Card>
  );

  return (
    <Screen style={styles.container}>
      {/* Summary at top */}
      <Box bg={colors.primary} px="$5" py="$4">
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Text color="$white" size="xs" opacity={0.8}>Total Payouts</Text>
            <Heading size="xl" color="$white">
              KES {MOCK_PAYOUTS.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </Heading>
          </VStack>
          <Box bg="$white" px="$3" py="$1" borderRadius="$full">
            <Text size="xs" bold color={colors.primary}>{MOCK_PAYOUTS.length} payouts</Text>
          </Box>
        </HStack>
      </Box>

      <FlatList
        data={MOCK_PAYOUTS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListEmptyComponent={
          <Box py="$10" alignItems="center">
            <MaterialCommunityIcons name="cash-remove" size={48} color={colors.coolGray} />
            <Text mt="$2" color="$coolGray500">No payouts yet.</Text>
          </Box>
        }
      />
    </Screen>
  );
};

export default PayoutHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
});
