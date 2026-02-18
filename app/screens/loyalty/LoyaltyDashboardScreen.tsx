import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { useNavigation } from "@react-navigation/native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const TIER_COLORS: Record<string, string> = {
  Bronze: "#CD7F32",
  Silver: "#A0A0A0",
  Gold: "#FFD700",
  Platinum: "#6B7280",
};

const MOCK_LOYALTY = {
  currentTier: "Silver",
  points: 2450,
  pointsToNextTier: 5000,
  recentActivity: [
    { id: 1, description: "Property Purchase — Amani Ridge", points: 1500, type: "earned", date: "2024-04-15" },
    { id: 2, description: "Successful Referral — John M.", points: 500, type: "earned", date: "2024-04-10" },
    { id: 3, description: "Redeemed: Discount Voucher", points: -300, type: "redeemed", date: "2024-04-05" },
    { id: 4, description: "Profile Completion Bonus", points: 250, type: "earned", date: "2024-03-28" },
  ],
};

const LoyaltyDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const tierColor = TIER_COLORS[MOCK_LOYALTY.currentTier] || colors.primary;
  const progress = (MOCK_LOYALTY.points / MOCK_LOYALTY.pointsToNextTier) * 100;

  if (loading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Tier & Points Hero */}
        <Box bg={colors.primary} px="$5" pt="$5" pb="$10">
          <HStack alignItems="center" space="md">
            <Box bg={tierColor + "30"} p="$3" borderRadius="$full" borderWidth={2} borderColor={tierColor}>
              <MaterialCommunityIcons name="shield-star" size={28} color={tierColor} />
            </Box>
            <VStack flex={1}>
              <Text color="$white" size="xs" opacity={0.8}>{MOCK_LOYALTY.currentTier} Member</Text>
              <Heading size="2xl" color="$white">{MOCK_LOYALTY.points.toLocaleString()}</Heading>
              <Text color="$white" size="xs" opacity={0.7}>points available</Text>
            </VStack>
          </HStack>

          {/* Progress to next tier */}
          <Box mt="$4">
            <HStack justifyContent="space-between" mb="$1">
              <Text color="$white" size="2xs" opacity={0.7}>{MOCK_LOYALTY.currentTier}</Text>
              <Text color="$white" size="2xs" opacity={0.7}>Next Tier</Text>
            </HStack>
            <Box bg="$white" h={8} borderRadius="$full" overflow="hidden" opacity={0.3}>
              <Box bg="$white" h="$full" borderRadius="$full" w={`${progress}%`} opacity={1} />
            </Box>
            <Text color="$white" size="2xs" mt="$1" opacity={0.7} textAlign="center">
              {MOCK_LOYALTY.pointsToNextTier - MOCK_LOYALTY.points} points to next tier
            </Text>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box px="$4" mt={-24}>
          <Card variant="elevated" p="$0" borderRadius={16} overflow="hidden">
            <HStack>
              <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate("RewardsCatalog")}>
                <MaterialCommunityIcons name="gift" size={22} color={colors.primary} />
                <Text size="2xs" bold mt="$1">Redeem</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickAction, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#F3F4F6" }]} onPress={() => navigation.navigate("RewardsCatalog")}>
                <MaterialCommunityIcons name="shopping" size={22} color={colors.primary} />
                <Text size="2xs" bold mt="$1">Rewards</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate("PointsHistory")}>
                <MaterialCommunityIcons name="history" size={22} color={colors.primary} />
                <Text size="2xs" bold mt="$1">History</Text>
              </TouchableOpacity>
            </HStack>
          </Card>
        </Box>

        {/* Tier Info */}
        <Box px="$4" mt="$5">
          <TouchableOpacity onPress={() => navigation.navigate("TierSystem")}>
            <Card variant="elevated" p="$4" borderRadius={14}>
              <HStack alignItems="center" space="md">
                <Box bg={tierColor + "18"} p="$2.5" borderRadius="$full">
                  <MaterialCommunityIcons name="trophy" size={20} color={tierColor} />
                </Box>
                <VStack flex={1}>
                  <Text bold size="sm">Your Tier Benefits</Text>
                  <Text size="xs" color="$coolGray500">View all {MOCK_LOYALTY.currentTier} perks</Text>
                </VStack>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.coolGray} />
              </HStack>
            </Card>
          </TouchableOpacity>
        </Box>

        {/* How to Earn */}
        <Box px="$4" mt="$4">
          <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg" mb="$3">Earn More Points</Heading>
          <HStack space="sm">
            {[
              { icon: "home-city", label: "Buy Property", pts: "1500+" },
              { icon: "account-plus", label: "Refer Friend", pts: "500" },
              { icon: "account-check", label: "Complete Profile", pts: "250" },
              { icon: "newspaper", label: "Engage", pts: "50" },
            ].map((item, i) => (
              <Card key={i} variant="elevated" flex={1} p="$2" borderRadius={12} alignItems="center">
                <MaterialCommunityIcons name={item.icon as any} size={20} color={colors.primary} />
                <Text size="2xs" bold mt="$1" textAlign="center">{item.label}</Text>
                <Text size="2xs" color={colors.primary} bold>+{item.pts}</Text>
              </Card>
            ))}
          </HStack>
        </Box>

        {/* Recent Points Activity */}
        <Box px="$4" mt="$5">
          <HStack justifyContent="space-between" alignItems="center" mb="$3">
            <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg">Recent Activity</Heading>
            <TouchableOpacity onPress={() => navigation.navigate("PointsHistory")}>
              <Text size="xs" color={colors.primary} bold>View All</Text>
            </TouchableOpacity>
          </HStack>
          <Card variant="elevated" p="$0" borderRadius={14} overflow="hidden">
            {MOCK_LOYALTY.recentActivity.map((item, index) => (
              <HStack key={item.id} px="$4" py="$3" alignItems="center" borderBottomWidth={index < MOCK_LOYALTY.recentActivity.length - 1 ? 1 : 0} borderColor="$borderLight200">
                <Box bg={item.type === "earned" ? colors.success + "18" : colors.warning + "18"} p="$2" borderRadius="$full" mr="$3">
                  <MaterialCommunityIcons name={item.type === "earned" ? "plus-circle" : "minus-circle"} size={16} color={item.type === "earned" ? colors.success : colors.warning} />
                </Box>
                <VStack flex={1}>
                  <Text bold size="xs">{item.description}</Text>
                  <Text size="2xs" color="$coolGray400">{new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Text>
                </VStack>
                <Text bold size="sm" color={item.type === "earned" ? colors.success : colors.warning}>
                  {item.type === "earned" ? "+" : ""}{item.points}
                </Text>
              </HStack>
            ))}
          </Card>
        </Box>

        {/* Leaderboard Card */}
        <Box px="$4" mt="$5">
          <TouchableOpacity onPress={() => navigation.navigate("Leaderboard")}>
            <Card variant="elevated" p="$4" borderRadius={14}>
              <HStack alignItems="center" space="md">
                <Box bg="#FFD70020" p="$2.5" borderRadius="$full">
                  <MaterialCommunityIcons name="podium-gold" size={20} color="#FFD700" />
                </Box>
                <VStack flex={1}>
                  <Text bold size="sm">Leaderboard</Text>
                  <Text size="xs" color="$coolGray500">See where you rank</Text>
                </VStack>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.coolGray} />
              </HStack>
            </Card>
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default LoyaltyDashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  quickAction: { flex: 1, alignItems: "center", paddingVertical: 16 },
});
