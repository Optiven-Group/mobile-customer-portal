import React from "react";
import { StyleSheet, ScrollView, Dimensions } from "react-native";
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

const TIERS = [
  {
    name: "Bronze",
    color: "#CD7F32",
    pointsRequired: 0,
    benefits: ["1% referral commission", "Access to News Feed", "Basic customer support"],
    icon: "shield-star",
  },
  {
    name: "Silver",
    color: "#A0A0A0",
    pointsRequired: 1000,
    benefits: ["1.5% referral commission", "Priority site visits", "Exclusive project previews", "Dedicated support agent"],
    icon: "shield-star",
  },
  {
    name: "Gold",
    color: "#FFD700",
    pointsRequired: 5000,
    benefits: ["2% referral commission", "Early access to new projects", "VIP events invitations", "Free valuations", "Priority payment processing"],
    icon: "shield-star",
  },
  {
    name: "Platinum",
    color: "#6B7280",
    pointsRequired: 15000,
    benefits: ["2.5% referral commission", "Personal account manager", "Complimentary title processing", "Exclusive Platinum events", "Investment advisory", "First-class site visit transport"],
    icon: "shield-crown",
  },
];

const CURRENT_TIER = "Silver";
const CURRENT_POINTS = 2450;

const TierSystemScreen = () => {
  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <Box bg={colors.primary} px="$5" pt="$5" pb="$8">
          <Heading size="xl" color="$white">Tier System</Heading>
          <Text color="$white" size="sm" opacity={0.8} mt="$1">Earn points, unlock exclusive benefits</Text>
        </Box>

        <Box px="$4" mt={-16}>
          {TIERS.map((tier, index) => {
            const isCurrent = tier.name === CURRENT_TIER;
            const isUnlocked = CURRENT_POINTS >= tier.pointsRequired;

            return (
              <Card
                key={tier.name}
                variant="elevated"
                p="$4"
                mb="$3"
                borderRadius={14}
                borderWidth={isCurrent ? 2 : 0}
                borderColor={isCurrent ? tier.color : undefined}
              >
                <HStack alignItems="center" space="md" mb="$3">
                  <Box bg={tier.color + "20"} p="$2.5" borderRadius="$full">
                    <MaterialCommunityIcons name={tier.icon as any} size={24} color={tier.color} />
                  </Box>
                  <VStack flex={1}>
                    <HStack alignItems="center" space="sm">
                      <Heading size="md" color={tier.color}>{tier.name}</Heading>
                      {isCurrent && (
                        <Box bg={tier.color + "20"} px="$2" py="$0.5" borderRadius="$sm">
                          <Text size="2xs" bold color={tier.color}>Current</Text>
                        </Box>
                      )}
                    </HStack>
                    <Text size="xs" color="$coolGray500">
                      {tier.pointsRequired === 0 ? "Starting tier" : `${tier.pointsRequired.toLocaleString()} points required`}
                    </Text>
                  </VStack>
                  {isUnlocked ? (
                    <MaterialCommunityIcons name="check-circle" size={22} color={colors.success} />
                  ) : (
                    <MaterialCommunityIcons name="lock" size={22} color={colors.coolGray} />
                  )}
                </HStack>

                <VStack space="xs" pl="$2">
                  {tier.benefits.map((benefit, i) => (
                    <HStack key={i} alignItems="center" space="sm">
                      <MaterialCommunityIcons name="check" size={14} color={isUnlocked ? colors.success : colors.coolGray} />
                      <Text size="xs" color={isUnlocked ? "$textDark" : "$coolGray400"}>{benefit}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Card>
            );
          })}
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default TierSystemScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
});
