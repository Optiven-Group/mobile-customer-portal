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

type Period = "Weekly" | "Monthly" | "All-Time";
type Category = "Top Earners" | "Top Referrers" | "Most Engaged";

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Alice K.", points: 12500, tier: "Platinum", isCurrentUser: false },
  { rank: 2, name: "Brian M.", points: 9800, tier: "Gold", isCurrentUser: false },
  { rank: 3, name: "Caroline W.", points: 7200, tier: "Gold", isCurrentUser: false },
  { rank: 4, name: "Dennis O.", points: 5400, tier: "Silver", isCurrentUser: false },
  { rank: 5, name: "You", points: 2450, tier: "Silver", isCurrentUser: true },
  { rank: 6, name: "Faith N.", points: 2100, tier: "Silver", isCurrentUser: false },
  { rank: 7, name: "George K.", points: 1800, tier: "Bronze", isCurrentUser: false },
  { rank: 8, name: "Hannah M.", points: 1500, tier: "Bronze", isCurrentUser: false },
  { rank: 9, name: "Ivan O.", points: 1200, tier: "Bronze", isCurrentUser: false },
  { rank: 10, name: "Janet W.", points: 900, tier: "Bronze", isCurrentUser: false },
];

const TIER_COLORS: Record<string, string> = {
  Bronze: "#CD7F32",
  Silver: "#A0A0A0",
  Gold: "#FFD700",
  Platinum: "#6B7280",
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return { name: "trophy", color: "#FFD700" };
  if (rank === 2) return { name: "medal", color: "#A0A0A0" };
  if (rank === 3) return { name: "medal", color: "#CD7F32" };
  return null;
};

const LeaderboardScreen = () => {
  const [period, setPeriod] = useState<Period>("Monthly");

  const currentUser = MOCK_LEADERBOARD.find((u) => u.isCurrentUser);

  const renderItem = ({ item }: { item: typeof MOCK_LEADERBOARD[0] }) => {
    const rankIcon = getRankIcon(item.rank);
    const tierColor = TIER_COLORS[item.tier] || colors.medium;

    return (
      <Card
        variant={item.isCurrentUser ? "filled" : "elevated"}
        p="$0"
        mb="$2"
        borderRadius={12}
        overflow="hidden"
        borderWidth={item.isCurrentUser ? 2 : 0}
        borderColor={item.isCurrentUser ? colors.primary : undefined}
        bg={item.isCurrentUser ? colors.primary + "08" : "$white"}
      >
        <HStack px="$4" py="$3" alignItems="center">
          {/* Rank */}
          <Box w={36} alignItems="center" mr="$2">
            {rankIcon ? (
              <MaterialCommunityIcons name={rankIcon.name as any} size={22} color={rankIcon.color} />
            ) : (
              <Text bold size="md" color="$coolGray400">#{item.rank}</Text>
            )}
          </Box>
          {/* User */}
          <Box bg={tierColor + "20"} p="$2" borderRadius="$full" mr="$3">
            <MaterialCommunityIcons name="account" size={18} color={tierColor} />
          </Box>
          <VStack flex={1}>
            <Text bold size="sm" color={item.isCurrentUser ? colors.primary : "$textDark"}>{item.name}</Text>
            <Text size="2xs" color="$coolGray500">{item.tier}</Text>
          </VStack>
          <Text bold size="sm" color={colors.primary}>{item.points.toLocaleString()} pts</Text>
        </HStack>
      </Card>
    );
  };

  return (
    <Screen style={styles.container}>
      {/* Period Toggle */}
      <Box px="$4" py="$3" bg="$white" borderBottomWidth={1} borderColor="$borderLight200">
        <HStack bg="$coolGray100" borderRadius={12} p="$1">
          {(["Weekly", "Monthly", "All-Time"] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.toggleBtn, period === p && styles.toggleActive]}
              onPress={() => setPeriod(p)}
            >
              <Text size="xs" bold color={period === p ? "$white" : "$coolGray600"}>{p}</Text>
            </TouchableOpacity>
          ))}
        </HStack>
      </Box>

      {/* My Rank Card */}
      {currentUser && (
        <Box px="$4" pt="$3">
          <Card variant="elevated" p="$3" borderRadius={14} bg={colors.primary}>
            <HStack alignItems="center" space="md">
              <Box bg="$white" px="$3" py="$1.5" borderRadius="$full">
                <Text bold size="md" color={colors.primary}>#{currentUser.rank}</Text>
              </Box>
              <VStack flex={1}>
                <Text color="$white" bold size="sm">Your Ranking</Text>
                <Text color="$white" size="xs" opacity={0.8}>{currentUser.points.toLocaleString()} points</Text>
              </VStack>
              <Box bg="$white" px="$2" py="$1" borderRadius="$sm">
                <Text size="xs" bold color={colors.primary}>{currentUser.tier}</Text>
              </Box>
            </HStack>
          </Card>
        </Box>
      )}

      <FlatList
        data={MOCK_LEADERBOARD}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListHeaderComponent={
          <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg" mb="$3">
            Top {MOCK_LEADERBOARD.length} — {period}
          </Heading>
        }
      />
    </Screen>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  toggleBtn: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 10 },
  toggleActive: { backgroundColor: colors.primary },
});
