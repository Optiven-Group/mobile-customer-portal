import React from "react";
import { StyleSheet, FlatList } from "react-native";
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

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedDate: string | null;
  progress: number; // 0-100
}

const MOCK_BADGES: Badge[] = [
  { id: 1, name: "First Property", description: "Purchase your first property", icon: "home", color: "#4CAF50", earned: true, earnedDate: "2024-03-01", progress: 100 },
  { id: 2, name: "Referral Star", description: "Make your first referral", icon: "account-plus", color: "#2196F3", earned: true, earnedDate: "2024-03-15", progress: 100 },
  { id: 3, name: "Investor", description: "Own 3+ properties", icon: "office-building", color: "#FF9800", earned: false, earnedDate: null, progress: 33 },
  { id: 4, name: "Networker", description: "Refer 10 people", icon: "account-group", color: "#9C27B0", earned: false, earnedDate: null, progress: 40 },
  { id: 5, name: "High Roller", description: "Earn KES 100,000 in commissions", icon: "cash-100", color: "#F44336", earned: false, earnedDate: null, progress: 75 },
  { id: 6, name: "Early Bird", description: "Be among the first 100 referrers", icon: "bird", color: "#00BCD4", earned: true, earnedDate: "2024-02-10", progress: 100 },
  { id: 7, name: "Consistent", description: "Log in for 30 consecutive days", icon: "calendar-check", color: "#607D8B", earned: false, earnedDate: null, progress: 60 },
  { id: 8, name: "Ambassador", description: "Reach Platinum tier", icon: "shield-crown", color: "#795548", earned: false, earnedDate: null, progress: 15 },
];

const BadgesScreen = () => {
  const earnedCount = MOCK_BADGES.filter((b) => b.earned).length;

  const renderItem = ({ item }: { item: Badge }) => (
    <Card variant="elevated" p="$3" mb="$3" borderRadius={14} opacity={item.earned ? 1 : 0.65}>
      <HStack alignItems="center" space="md">
        <Box bg={item.color + (item.earned ? "25" : "10")} p="$3" borderRadius="$full">
          <MaterialCommunityIcons name={item.icon as any} size={24} color={item.earned ? item.color : colors.coolGray} />
        </Box>
        <VStack flex={1}>
          <HStack alignItems="center" space="sm">
            <Text bold size="sm">{item.name}</Text>
            {item.earned && <MaterialCommunityIcons name="check-decagram" size={14} color={colors.success} />}
          </HStack>
          <Text size="xs" color="$coolGray500">{item.description}</Text>
          {item.earned && item.earnedDate && (
            <Text size="2xs" color={colors.success}>Earned {new Date(item.earnedDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</Text>
          )}
          {!item.earned && (
            <Box mt="$1.5">
              <Box bg="$coolGray200" h={4} borderRadius="$full" overflow="hidden">
                <Box bg={item.color} h="$full" borderRadius="$full" w={`${item.progress}%`} />
              </Box>
              <Text size="2xs" color="$coolGray400" mt="$0.5">{item.progress}% complete</Text>
            </Box>
          )}
        </VStack>
      </HStack>
    </Card>
  );

  return (
    <Screen style={styles.container}>
      <FlatList
        data={MOCK_BADGES}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListHeaderComponent={
          <Card variant="elevated" p="$4" borderRadius={14} mb="$4" bg={colors.primary}>
            <HStack alignItems="center" space="md">
              <MaterialCommunityIcons name="trophy" size={28} color="#FFD700" />
              <VStack flex={1}>
                <Text bold size="md" color="$white">{earnedCount} / {MOCK_BADGES.length} Badges Earned</Text>
                <Text size="xs" color="$white" opacity={0.8}>Keep going to unlock more achievements!</Text>
              </VStack>
            </HStack>
            <Box mt="$2" bg="$white" h={6} borderRadius="$full" overflow="hidden" opacity={0.3}>
              <Box bg="$white" h="$full" borderRadius="$full" w={`${(earnedCount / MOCK_BADGES.length) * 100}%`} opacity={1} />
            </Box>
          </Card>
        }
      />
    </Screen>
  );
};

export default BadgesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
});
