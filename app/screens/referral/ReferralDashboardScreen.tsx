import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Share,
} from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { useAuth } from "../../context/AuthContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ReferralStackParamList } from "../../navigation/types";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Mock referral stats
const MOCK_STATS = {
  totalReferrals: 8,
  successful: 3,
  pending: 4,
  rejected: 1,
  totalEarned: 75000,
  pendingCommission: 35000,
  paidCommission: 40000,
};

const MOCK_RECENT_REFERRALS = [
  { id: 1, name: "John M.", status: "converted", date: "2024-04-15", commission: 25000 },
  { id: 2, name: "Grace W.", status: "pending", date: "2024-04-10", commission: 15000 },
  { id: 3, name: "Peter K.", status: "contacted", date: "2024-04-05", commission: 20000 },
];

const ReferralDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const referralCode = user?.customerNumber || "OPT-REF-2024";

  const handleQuickShare = async () => {
    try {
      await Share.share({
        message: `Join Optiven Real Estate! Use my referral code: ${referralCode}. Invest in your future today! https://www.optiven.co.ke/referral?code=${referralCode}`,
      });
    } catch (e) {
      console.log("Share error", e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "converted": return colors.success;
      case "pending": case "contacted": return colors.warning;
      case "rejected": return colors.danger;
      default: return colors.medium;
    }
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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Hero Section */}
        <Box bg={colors.primary} px="$5" pt="$5" pb="$10">
          <VStack space="xs">
            <Text color="$white" size="sm" opacity={0.8}>Your Referral Stats</Text>
            <Heading size="2xl" color="$white">{MOCK_STATS.totalReferrals} Referrals</Heading>
          </VStack>
          <HStack mt="$4" justifyContent="space-between">
            <VStack alignItems="center">
              <Text color="$white" bold size="xl">{MOCK_STATS.successful}</Text>
              <Text color="$white" size="2xs" opacity={0.7}>Successful</Text>
            </VStack>
            <VStack alignItems="center">
              <Text color="$white" bold size="xl">{MOCK_STATS.pending}</Text>
              <Text color="$white" size="2xs" opacity={0.7}>Pending</Text>
            </VStack>
            <VStack alignItems="center">
              <Text color="$white" bold size="xl">{MOCK_STATS.rejected}</Text>
              <Text color="$white" size="2xs" opacity={0.7}>Rejected</Text>
            </VStack>
            <VStack alignItems="center">
              <Text color="$white" bold size="xl">{((MOCK_STATS.successful / MOCK_STATS.totalReferrals) * 100).toFixed(0)}%</Text>
              <Text color="$white" size="2xs" opacity={0.7}>Conversion</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Commission Summary Cards */}
        <Box px="$4" mt={-24}>
          <Card variant="elevated" p="$0" borderRadius={16} overflow="hidden">
            <HStack>
              <VStack flex={1} alignItems="center" py="$3" bg="$white">
                <Text size="2xs" color="$coolGray500">Total Earned</Text>
                <Text bold size="sm" color={colors.primary}>KES {MOCK_STATS.totalEarned.toLocaleString()}</Text>
              </VStack>
              <VStack flex={1} alignItems="center" py="$3" bg="$white" borderLeftWidth={1} borderRightWidth={1} borderColor="$borderLight200">
                <Text size="2xs" color="$coolGray500">Pending</Text>
                <Text bold size="sm" color={colors.warning}>KES {MOCK_STATS.pendingCommission.toLocaleString()}</Text>
              </VStack>
              <VStack flex={1} alignItems="center" py="$3" bg="$white">
                <Text size="2xs" color="$coolGray500">Paid</Text>
                <Text bold size="sm" color={colors.success}>KES {MOCK_STATS.paidCommission.toLocaleString()}</Text>
              </VStack>
            </HStack>
          </Card>
        </Box>

        {/* CTA: Refer Now */}
        <Box px="$4" mt="$5">
          <Button size="lg" bg={colors.secondary} borderRadius={14} onPress={() => navigation.navigate("FeaturedProjects")}>
            <HStack space="sm" alignItems="center">
              <MaterialCommunityIcons name="account-plus" size={22} color="white" />
              <ButtonText size="md">Refer a Friend</ButtonText>
            </HStack>
          </Button>
        </Box>

        {/* Quick Share */}
        <Box px="$4" mt="$3">
          <Card variant="elevated" p="$4" borderRadius={14}>
            <HStack alignItems="center" justifyContent="space-between">
              <VStack flex={1}>
                <Text bold size="sm">Your Referral Code</Text>
                <Text size="lg" bold color={colors.primary}>{referralCode}</Text>
              </VStack>
              <HStack space="sm">
                <TouchableOpacity style={styles.shareIconBtn} onPress={handleQuickShare}>
                  <MaterialCommunityIcons name="share-variant" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareIconBtn} onPress={handleQuickShare}>
                  <MaterialCommunityIcons name="whatsapp" size={20} color="#25D366" />
                </TouchableOpacity>
              </HStack>
            </HStack>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Box px="$4" mt="$5">
          <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg" mb="$3">Quick Actions</Heading>
          <HStack space="sm">
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate("Commission")}>
              <MaterialCommunityIcons name="cash-multiple" size={22} color={colors.primary} />
              <Text size="2xs" bold mt="$1">Commission</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate("PayoutHistory")}>
              <MaterialCommunityIcons name="wallet" size={22} color={colors.primary} />
              <Text size="2xs" bold mt="$1">Payouts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate("ReferralProgress")}>
              <MaterialCommunityIcons name="clipboard-list" size={22} color={colors.primary} />
              <Text size="2xs" bold mt="$1">Tracking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate("HowItWorks")}>
              <MaterialCommunityIcons name="information" size={22} color={colors.primary} />
              <Text size="2xs" bold mt="$1">How It Works</Text>
            </TouchableOpacity>
          </HStack>
        </Box>

        {/* Recent Referrals */}
        <Box px="$4" mt="$5">
          <HStack justifyContent="space-between" alignItems="center" mb="$3">
            <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg">Recent Referrals</Heading>
            <TouchableOpacity onPress={() => navigation.navigate("ReferralProgress")}>
              <Text size="xs" color={colors.primary} bold>View All</Text>
            </TouchableOpacity>
          </HStack>
          <Card variant="elevated" p="$0" borderRadius={14} overflow="hidden">
            {MOCK_RECENT_REFERRALS.map((ref, index) => (
              <TouchableOpacity key={ref.id} onPress={() => navigation.navigate("ReferralDetail", { referral: ref })}>
                <HStack px="$4" py="$3" alignItems="center" borderBottomWidth={index < MOCK_RECENT_REFERRALS.length - 1 ? 1 : 0} borderColor="$borderLight200">
                  <Box bg={getStatusColor(ref.status) + "18"} p="$2" borderRadius="$full" mr="$3">
                    <MaterialCommunityIcons name="account" size={18} color={getStatusColor(ref.status)} />
                  </Box>
                  <VStack flex={1}>
                    <Text bold size="sm">{ref.name}</Text>
                    <Text size="2xs" color="$coolGray500">{new Date(ref.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Text>
                  </VStack>
                  <VStack alignItems="flex-end">
                    <Text size="xs" bold color={colors.primary}>KES {ref.commission.toLocaleString()}</Text>
                    <Box bg={getStatusColor(ref.status) + "18"} px="$2" borderRadius="$sm">
                      <Text size="2xs" bold color={getStatusColor(ref.status)}>{ref.status}</Text>
                    </Box>
                  </VStack>
                </HStack>
              </TouchableOpacity>
            ))}
          </Card>
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default ReferralDashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  shareIconBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  quickCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
});
