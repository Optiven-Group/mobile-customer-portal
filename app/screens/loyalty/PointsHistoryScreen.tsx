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

type FilterKey = "All" | "Earned" | "Redeemed" | "Expired";

interface PointsEntry {
  id: number;
  description: string;
  points: number;
  type: "earned" | "redeemed" | "expired";
  source: string;
  date: string;
  balanceAfter: number;
}

const MOCK_HISTORY: PointsEntry[] = [
  { id: 1, description: "Property Purchase — Amani Ridge", points: 1500, type: "earned", source: "purchase", date: "2024-04-15", balanceAfter: 2450 },
  { id: 2, description: "Successful Referral — John M.", points: 500, type: "earned", source: "referral", date: "2024-04-10", balanceAfter: 950 },
  { id: 3, description: "Redeemed: Discount Voucher", points: -300, type: "redeemed", source: "redemption", date: "2024-04-05", balanceAfter: 450 },
  { id: 4, description: "Profile Completion Bonus", points: 250, type: "earned", source: "profile", date: "2024-03-28", balanceAfter: 750 },
  { id: 5, description: "Referral — Grace W.", points: 500, type: "earned", source: "referral", date: "2024-03-15", balanceAfter: 500 },
  { id: 6, description: "Expired Points", points: -100, type: "expired", source: "expiry", date: "2024-02-28", balanceAfter: 0 },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "earned": return colors.success;
    case "redeemed": return colors.warning;
    case "expired": return colors.danger;
    default: return colors.medium;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "earned": return "plus-circle";
    case "redeemed": return "minus-circle";
    case "expired": return "close-circle";
    default: return "circle";
  }
};

const PointsHistoryScreen = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");

  const filteredHistory = MOCK_HISTORY.filter((entry) => {
    if (activeFilter === "All") return true;
    return entry.type === activeFilter.toLowerCase();
  });

  const FilterChip = ({ label }: { label: FilterKey }) => (
    <TouchableOpacity
      onPress={() => setActiveFilter(label)}
      style={[styles.chip, activeFilter === label && styles.chipActive]}
    >
      <Text size="xs" bold color={activeFilter === label ? "$white" : "$coolGray600"}>{label}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: PointsEntry }) => (
    <Card variant="elevated" p="$0" mb="$2" borderRadius={12} overflow="hidden">
      <HStack px="$4" py="$3" alignItems="center">
        <Box bg={getTypeColor(item.type) + "18"} p="$2" borderRadius="$full" mr="$3">
          <MaterialCommunityIcons name={getTypeIcon(item.type) as any} size={18} color={getTypeColor(item.type)} />
        </Box>
        <VStack flex={1}>
          <Text bold size="xs">{item.description}</Text>
          <Text size="2xs" color="$coolGray400">{new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Text>
        </VStack>
        <VStack alignItems="flex-end">
          <Text bold size="sm" color={getTypeColor(item.type)}>
            {item.points > 0 ? "+" : ""}{item.points}
          </Text>
          <Text size="2xs" color="$coolGray400">Bal: {item.balanceAfter}</Text>
        </VStack>
      </HStack>
    </Card>
  );

  return (
    <Screen style={styles.container}>
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListHeaderComponent={
          <Box mb="$3">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={(["All", "Earned", "Redeemed", "Expired"] as FilterKey[])}
              keyExtractor={(item) => item}
              renderItem={({ item }) => <FilterChip label={item} />}
              contentContainerStyle={{ gap: 8, marginBottom: 8 }}
            />
          </Box>
        }
        ListEmptyComponent={
          <Box py="$10" alignItems="center">
            <MaterialCommunityIcons name="history" size={48} color={colors.coolGray} />
            <Text mt="$2" color="$coolGray500">No points activity.</Text>
          </Box>
        }
      />
    </Screen>
  );
};

export default PointsHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  chip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: "#E5E7EB" },
  chipActive: { backgroundColor: colors.primary },
});
