import React from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity, Dimensions } from "react-native";
import { Box, Text, VStack, HStack, Heading } from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMembership } from "../../context/MembershipContext";
import Screen from "../../app-components/Screen";

const { width } = Dimensions.get("window");

const TIERS = [
  {
    name: "Sapphire",
    color: "#0F52BA",
    icon: "gem",
    threshold: "Starting Tier",
    discount: "Welcome benefits",
    description: "Welcome aboard! You're on your way to unlocking amazing benefits.",
    benefits: ["Access to property listings", "Customer support", "News & updates"],
  },
  {
    name: "Bronze",
    color: "#CD7F32",
    icon: "trophy",
    threshold: "KES 1M+",
    discount: "3% discount",
    description: "Great start! Keep investing for more rewards.",
    benefits: ["3% discount on purchases", "Basic referral rewards", "Payment flexibility"],
  },
  {
    name: "Silver",
    color: "#A0A0A0",
    icon: "medal",
    threshold: "KES 5M+",
    discount: "5% discount",
    description: "You're climbing the ladder! Silver suits you well.",
    benefits: ["5% discount on purchases", "Priority site visits", "Exclusive previews", "Dedicated support"],
  },
  {
    name: "Gold",
    color: "#FFD700",
    icon: "star-circle",
    threshold: "KES 10M+",
    discount: "7% discount",
    description: "Shining bright! Enjoy premium benefits.",
    benefits: ["7% discount on purchases", "VIP events access", "Free valuations", "Priority processing", "Early project access"],
  },
  {
    name: "Platinum",
    color: "#8B8B8B",
    icon: "diamond-stone",
    threshold: "KES 20M+",
    discount: "10% discount",
    description: "You're a property mogul! Enjoy the finest perks.",
    benefits: ["10% discount on purchases", "Personal account manager", "Complimentary title processing", "Platinum events", "Investment advisory", "First-class transport"],
  },
];

const LoyaltyInfoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { membershipTier } = useMembership();

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name="shield-star" size={32} color="#388E3C" />
          </View>
          <Heading size="xl" color="#1B5E20" textAlign="center" mt="$3">
            Loyalty Program
          </Heading>
          <Text size="sm" color="#66BB6A" textAlign="center" mt="$1">
            Invest more, unlock exclusive rewards
          </Text>

          <TouchableOpacity
            style={styles.viewTierBtn}
            onPress={() => navigation.getParent()?.navigate("LoyaltyNav")}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="chart-bar" size={16} color="#FFF" />
            <Text size="xs" bold color="$white" ml="$1.5">View Full Dashboard</Text>
          </TouchableOpacity>
        </View>

        {/* Current Tier Highlight */}
        <View style={styles.currentTierCard}>
          <Text size="2xs" color="#9CA3AF" mb="$1">Your Current Tier</Text>
          <HStack alignItems="center" space="sm">
            <View style={[styles.currentTierIcon, { backgroundColor: (TIERS.find(t => t.name === membershipTier)?.color || "#0F52BA") + "20" }]}>
              <MaterialCommunityIcons
                name={(TIERS.find(t => t.name === membershipTier)?.icon || "gem") as any}
                size={22}
                color={TIERS.find(t => t.name === membershipTier)?.color || "#0F52BA"}
              />
            </View>
            <Heading size="lg" color="#1F2937">{membershipTier}</Heading>
          </HStack>
        </View>

        {/* Tier Cards */}
        {TIERS.map((tier, index) => {
          const isCurrent = tier.name === membershipTier;

          return (
            <View key={tier.name} style={[styles.tierCard, isCurrent && { borderColor: tier.color, borderWidth: 2 }]}>
              {/* Tier header */}
              <HStack alignItems="center" space="md" mb="$3">
                <View style={[styles.tierIcon, { backgroundColor: tier.color + "15" }]}>
                  <MaterialCommunityIcons name={tier.icon as any} size={26} color={tier.color} />
                </View>
                <VStack flex={1}>
                  <HStack alignItems="center" space="sm">
                    <Heading size="md" color={tier.color}>{tier.name}</Heading>
                    {isCurrent && (
                      <View style={[styles.currentBadge, { backgroundColor: tier.color }]}>
                        <Text size="2xs" bold color="#FFF">Current</Text>
                      </View>
                    )}
                  </HStack>
                  <Text size="xs" color="#6B7280">{tier.threshold}</Text>
                </VStack>
                <View style={[styles.discountPill, { backgroundColor: tier.color + "15" }]}>
                  <Text size="2xs" bold color={tier.color}>{tier.discount}</Text>
                </View>
              </HStack>

              {/* Description */}
              <Text size="xs" color="#6B7280" mb="$3" lineHeight={18}>{tier.description}</Text>

              {/* Benefits */}
              <VStack space="xs">
                {tier.benefits.map((benefit, i) => (
                  <HStack key={i} alignItems="center" space="sm">
                    <MaterialCommunityIcons name="check-circle" size={14} color={tier.color} />
                    <Text size="xs" color="#374151">{benefit}</Text>
                  </HStack>
                ))}
              </VStack>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
};

export default LoyaltyInfoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FBF6" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  viewTierBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#388E3C",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 18,
  },
  currentTierCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  currentTierIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tierCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  tierIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
