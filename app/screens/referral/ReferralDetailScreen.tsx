import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  Divider,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TIMELINE_STEPS = [
  { key: "submitted", label: "Submitted", icon: "send" },
  { key: "contacted", label: "Contacted", icon: "phone-check" },
  { key: "site_visit", label: "Site Visit", icon: "map-marker-check" },
  { key: "negotiation", label: "Negotiation", icon: "handshake" },
  { key: "converted", label: "Sale Closed", icon: "check-decagram" },
  { key: "commission_approved", label: "Commission Approved", icon: "cash-check" },
  { key: "paid", label: "Paid", icon: "wallet-plus" },
];

const getActiveIndex = (status: string) => {
  const map: Record<string, number> = {
    pending: 0,
    contacted: 1,
    site_visit: 2,
    negotiation: 3,
    converted: 4,
    commission_approved: 5,
    paid: 6,
    rejected: -1,
  };
  return map[status] ?? 0;
};

const ReferralDetailScreen = () => {
  const route = useRoute<any>();
  const referral = route.params?.referral;
  const activeIndex = getActiveIndex(referral?.status || "pending");
  const isRejected = referral?.status === "rejected";

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header Card */}
        <Box bg={colors.primary} px="$5" pt="$5" pb="$8">
          <HStack alignItems="center" space="md">
            <Box bg="$white" p="$3" borderRadius="$full">
              <MaterialCommunityIcons name="account" size={28} color={colors.primary} />
            </Box>
            <VStack flex={1}>
              <Heading size="lg" color="$white">{referral?.name || "Referee"}</Heading>
              <Text color="$white" size="sm" opacity={0.8}>{referral?.phone || "0700***000"}</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Info Card */}
        <Box px="$4" mt={-20}>
          <Card variant="elevated" p="$4" borderRadius={14}>
            <HStack justifyContent="space-between">
              <VStack alignItems="center" flex={1}>
                <Text size="2xs" color="$coolGray500">Date</Text>
                <Text bold size="sm">{new Date(referral?.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</Text>
              </VStack>
              <VStack alignItems="center" flex={1}>
                <Text size="2xs" color="$coolGray500">Commission</Text>
                <Text bold size="sm" color={colors.primary}>KES {(referral?.commission || 0).toLocaleString()}</Text>
              </VStack>
              <VStack alignItems="center" flex={1}>
                <Text size="2xs" color="$coolGray500">Project</Text>
                <Text bold size="sm">{referral?.project || "N/A"}</Text>
              </VStack>
            </HStack>
          </Card>
        </Box>

        {/* Status */}
        <Box px="$4" mt="$5">
          <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg" mb="$3">Current Status</Heading>
          <Card variant="elevated" p="$4" borderRadius={14}>
            {isRejected ? (
              <HStack alignItems="center" space="md">
                <Box bg={colors.danger + "18"} p="$3" borderRadius="$full">
                  <MaterialCommunityIcons name="close-circle" size={24} color={colors.danger} />
                </Box>
                <VStack flex={1}>
                  <Text bold color={colors.danger}>Rejected</Text>
                  <Text size="xs" color="$coolGray500">This referral was not successful. Contact support for details.</Text>
                </VStack>
              </HStack>
            ) : (
              <HStack alignItems="center" space="md">
                <Box bg={colors.primary + "18"} p="$3" borderRadius="$full">
                  <MaterialCommunityIcons name="progress-check" size={24} color={colors.primary} />
                </Box>
                <VStack flex={1}>
                  <Text bold>{TIMELINE_STEPS[activeIndex]?.label || "Submitted"}</Text>
                  <Text size="xs" color="$coolGray500">Your referral is being processed.</Text>
                </VStack>
              </HStack>
            )}
          </Card>
        </Box>

        {/* Timeline */}
        {!isRejected && (
          <Box px="$4" mt="$5">
            <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg" mb="$3">Progress Timeline</Heading>
            <Card variant="elevated" p="$4" borderRadius={14}>
              {TIMELINE_STEPS.map((step, index) => {
                const isCompleted = index <= activeIndex;
                const isCurrent = index === activeIndex;
                return (
                  <HStack key={step.key} space="md" mb={index < TIMELINE_STEPS.length - 1 ? "$3" : "$0"}>
                    <VStack alignItems="center" w={30}>
                      <Box
                        bg={isCompleted ? colors.primary : "$coolGray200"}
                        w={28}
                        h={28}
                        borderRadius="$full"
                        alignItems="center"
                        justifyContent="center"
                        borderWidth={isCurrent ? 2 : 0}
                        borderColor={isCurrent ? colors.secondary : undefined}
                      >
                        <MaterialCommunityIcons
                          name={isCompleted ? "check" : (step.icon as any)}
                          size={14}
                          color={isCompleted ? "white" : colors.coolGray}
                        />
                      </Box>
                      {index < TIMELINE_STEPS.length - 1 && (
                        <Box w={2} h={20} bg={isCompleted ? colors.primary : "$coolGray200"} mt="$0.5" />
                      )}
                    </VStack>
                    <VStack flex={1} pt="$0.5">
                      <Text bold size="sm" color={isCompleted ? "$textDark" : "$coolGray400"}>{step.label}</Text>
                    </VStack>
                  </HStack>
                );
              })}
            </Card>
          </Box>
        )}

        {/* Contact Support */}
        <Box px="$4" mt="$5">
          <TouchableOpacity>
            <Card variant="elevated" p="$4" borderRadius={14}>
              <HStack alignItems="center" space="md">
                <Box bg={colors.primary + "15"} p="$2.5" borderRadius="$full">
                  <MaterialCommunityIcons name="headset" size={20} color={colors.primary} />
                </Box>
                <Text flex={1} bold size="sm">Need Help? Contact Support</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.coolGray} />
              </HStack>
            </Card>
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default ReferralDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
});
