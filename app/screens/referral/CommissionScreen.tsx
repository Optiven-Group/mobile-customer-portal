import React, { useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from "react-native";
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

const { width } = Dimensions.get("window");

const MOCK_COMMISSIONS = {
  totalEarned: 75000,
  pendingCommission: 35000,
  paidCommission: 40000,
  byProject: [
    { project: "Amani Ridge", earned: 45000, count: 3 },
    { project: "Love Gardens", earned: 15000, count: 2 },
    { project: "Success Gardens", earned: 15000, count: 1 },
  ],
  byMonth: [
    { month: "Apr 2024", earned: 25000 },
    { month: "Mar 2024", earned: 30000 },
    { month: "Feb 2024", earned: 20000 },
  ],
};

const CommissionScreen = () => {
  const [view, setView] = useState<"project" | "monthly">("project");

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Summary Header */}
        <Box bg={colors.primary} px="$5" pt="$5" pb="$8">
          <Text color="$white" size="sm" opacity={0.8}>Total Commission Earned</Text>
          <Heading size="3xl" color="$white">KES {MOCK_COMMISSIONS.totalEarned.toLocaleString()}</Heading>
        </Box>

        {/* Status Cards */}
        <Box px="$4" mt={-20}>
          <HStack space="sm">
            <Card variant="elevated" flex={1} p="$3" borderRadius={14}>
              <VStack alignItems="center">
                <Box bg={colors.warning + "18"} p="$2" borderRadius="$full" mb="$1">
                  <MaterialCommunityIcons name="clock-outline" size={18} color={colors.warning} />
                </Box>
                <Text size="2xs" color="$coolGray500">Pending</Text>
                <Text bold size="sm" color={colors.warning}>KES {MOCK_COMMISSIONS.pendingCommission.toLocaleString()}</Text>
              </VStack>
            </Card>
            <Card variant="elevated" flex={1} p="$3" borderRadius={14}>
              <VStack alignItems="center">
                <Box bg={colors.success + "18"} p="$2" borderRadius="$full" mb="$1">
                  <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.success} />
                </Box>
                <Text size="2xs" color="$coolGray500">Paid</Text>
                <Text bold size="sm" color={colors.success}>KES {MOCK_COMMISSIONS.paidCommission.toLocaleString()}</Text>
              </VStack>
            </Card>
          </HStack>
        </Box>

        {/* Toggle View */}
        <Box px="$4" mt="$5">
          <HStack bg="$coolGray100" borderRadius={12} p="$1">
            <TouchableOpacity
              style={[styles.toggleBtn, view === "project" && styles.toggleActive]}
              onPress={() => setView("project")}
            >
              <Text size="xs" bold color={view === "project" ? "$white" : "$coolGray600"}>By Project</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, view === "monthly" && styles.toggleActive]}
              onPress={() => setView("monthly")}
            >
              <Text size="xs" bold color={view === "monthly" ? "$white" : "$coolGray600"}>By Month</Text>
            </TouchableOpacity>
          </HStack>
        </Box>

        {/* Breakdown List */}
        <Box px="$4" mt="$4">
          {view === "project" ? (
            MOCK_COMMISSIONS.byProject.map((item, index) => (
              <Card key={index} variant="elevated" p="$4" borderRadius={14} mb="$3">
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack alignItems="center" space="md" flex={1}>
                    <Box bg={colors.primary + "18"} p="$2.5" borderRadius="$full">
                      <MaterialCommunityIcons name="home-city" size={18} color={colors.primary} />
                    </Box>
                    <VStack>
                      <Text bold size="sm">{item.project}</Text>
                      <Text size="2xs" color="$coolGray500">{item.count} referral{item.count !== 1 ? "s" : ""}</Text>
                    </VStack>
                  </HStack>
                  <Text bold color={colors.primary}>KES {item.earned.toLocaleString()}</Text>
                </HStack>
                {/* Simple bar chart */}
                <Box mt="$2" bg="$coolGray100" h={6} borderRadius="$full" overflow="hidden">
                  <Box bg={colors.primary} h="$full" borderRadius="$full" w={`${(item.earned / MOCK_COMMISSIONS.totalEarned) * 100}%`} />
                </Box>
              </Card>
            ))
          ) : (
            MOCK_COMMISSIONS.byMonth.map((item, index) => (
              <Card key={index} variant="elevated" p="$4" borderRadius={14} mb="$3">
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack alignItems="center" space="md" flex={1}>
                    <Box bg={colors.secondary + "18"} p="$2.5" borderRadius="$full">
                      <MaterialCommunityIcons name="calendar-month" size={18} color={colors.secondary} />
                    </Box>
                    <Text bold size="sm">{item.month}</Text>
                  </HStack>
                  <Text bold color={colors.primary}>KES {item.earned.toLocaleString()}</Text>
                </HStack>
                <Box mt="$2" bg="$coolGray100" h={6} borderRadius="$full" overflow="hidden">
                  <Box bg={colors.secondary} h="$full" borderRadius="$full" w={`${(item.earned / MOCK_COMMISSIONS.totalEarned) * 100}%`} />
                </Box>
              </Card>
            ))
          )}
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default CommissionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  toggleBtn: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 10 },
  toggleActive: { backgroundColor: colors.primary },
});
