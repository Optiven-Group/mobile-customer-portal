import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Linking,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../utils/colors";
import { useAuth } from "../../context/AuthContext";
import { useMembership } from "../../context/MembershipContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountStackParamList } from "../../navigation/types";
import Screen from "../../app-components/Screen";
import api from "../../utils/api";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Avatar,
  AvatarFallbackText,
  Badge,
  BadgeText,
  Divider,
} from "@gluestack-ui/themed";

const { width } = Dimensions.get("window");

type AccountScreenProps = NativeStackScreenProps<AccountStackParamList, "Account">;

const AccountScreen: React.FC<AccountScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { setMembershipTier, membershipTier } = useMembership();
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const getInitials = (name?: string): string => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length <= 1) return (parts[0]?.[0] || "U").toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getMembershipTier = (spent: number): string => {
    if (spent >= 20000000) return "Platinum";
    if (spent >= 10000000) return "Gold";
    if (spent >= 5000000) return "Silver";
    if (spent >= 1000000) return "Bronze";
    return "Sapphire";
  };

  const tierConfig: Record<string, { color: string; icon: string; gradient: string[] }> = {
    Platinum: { color: "#E5E4E2", icon: "diamond-stone", gradient: ["#A8A8A8", "#E5E4E2"] },
    Gold: { color: "#FFD700", icon: "star-circle", gradient: ["#B8860B", "#FFD700"] },
    Silver: { color: "#C0C0C0", icon: "medal", gradient: ["#808080", "#C0C0C0"] },
    Bronze: { color: "#CD7F32", icon: "shield-star", gradient: ["#8B4513", "#CD7F32"] },
    Sapphire: { color: "#0F52BA", icon: "gem", gradient: ["#0A3480", "#0F52BA"] },
  };

  useEffect(() => {
    const fetchTotalSpent = async () => {
      try {
        const response = await api.get("/user/total-spent");
        const fetched = response.data.total_spent;
        setTotalSpent(fetched);
        setMembershipTier(getMembershipTier(fetched));
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchTotalSpent();
  }, [setMembershipTier]);

  const tier = tierConfig[membershipTier] || tierConfig.Sapphire;

  // ── Quick Action Button ──
  const QuickAction = ({ icon, label, bg, onPress }: { icon: string; label: string; bg: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.quickAction} activeOpacity={0.7} onPress={onPress}>
      <HStack alignItems="center" space="sm">
        <Box bg={bg} p="$2" borderRadius={10}>
          <MaterialCommunityIcons name={icon as any} size={18} color="#FFF" />
        </Box>
        <Text size="sm" bold color="#374151">{label}</Text>
      </HStack>
    </TouchableOpacity>
  );

  // ── Menu Row ──
  const MenuRow = ({ icon, label, subtitle, onPress, badge, danger }: { icon: string; label: string; subtitle?: string; onPress: () => void; badge?: string; danger?: boolean }) => (
    <TouchableOpacity style={styles.menuRow} activeOpacity={0.6} onPress={onPress}>
      <Box bg={danger ? "#FBE9E7" : "#E8F5E9"} p="$2.5" borderRadius={12} mr="$3">
        <MaterialCommunityIcons name={icon as any} size={20} color={danger ? "#800000" : "#2E7D32"} />
      </Box>
      <VStack flex={1}>
        <Text size="sm" bold color={danger ? "#800000" : "#1F2937"}>{label}</Text>
        {subtitle && <Text size="2xs" color="#6B7280">{subtitle}</Text>}
      </VStack>
      {badge && (
        <Box bg="#800000" px="$2" py="$0.5" borderRadius="$full" mr="$2">
          <Text size="2xs" bold color="$white">{badge}</Text>
        </Box>
      )}
      <MaterialCommunityIcons name="chevron-right" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ═══ Hero Header ═══ */}
        <View style={styles.header}>
          <HStack justifyContent="space-between" alignItems="flex-start">
            <VStack flex={1}>
              <Heading size="2xl" color="#1F2937" style={{ letterSpacing: -0.5 }}>
                {user?.name || "Customer"}
              </Heading>
              <HStack alignItems="center" space="xs" mt="$1">
                <MaterialCommunityIcons name="star" size={14} color="#CD7F32" />
                <Text size="sm" color="#5A0000">
                  {user?.customerNumber || "OPT-2024-0001"}
                </Text>
              </HStack>
            </VStack>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditDetails", { name: user?.name || "", email: user?.email || "", phone: "" })}
            >
              <Avatar bgColor={colors.primary} size="lg" borderRadius="$full">
                <AvatarFallbackText color="$white" fontSize={20}>
                  {getInitials(user?.name)}
                </AvatarFallbackText>
              </Avatar>
              <Box position="absolute" bottom={-2} right={-2} bg="$white" borderRadius="$full" p="$0.5">
                <MaterialCommunityIcons name="pencil-circle" size={18} color={colors.primary} />
              </Box>
            </TouchableOpacity>
          </HStack>
        </View>

        {/* ═══ Quick Actions 2×2 Grid ═══ */}
        <View style={styles.quickGrid}>
          <HStack space="sm">
            <QuickAction icon="help-circle" label="Help" bg="#388E3C" onPress={() => Linking.openURL("mailto:info@optiven.co.ke?subject=Support")} />
            <QuickAction icon="wallet" label="Wallet" bg="#2E7D32" onPress={() => navigation.getParent()?.navigate("Wallet")} />
          </HStack>
          <HStack space="sm" mt="$2">
            <QuickAction icon="home-city-outline" label="Properties" bg="#800000" onPress={() => navigation.getParent()?.navigate("PropertyNav")} />
            <QuickAction icon="bell-outline" label="Inbox" bg="#5A0000" onPress={() => {}} />
          </HStack>
        </View>

        {/* ═══ Loyalty Tier Card ═══ */}
        <TouchableOpacity
          style={styles.promoCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("LoyaltyProgramInfo")}
        >
          <LinearGradient
            colors={tier.gradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promoGradient}
          >
            <VStack flex={1}>
              <HStack alignItems="center" space="xs">
                <MaterialCommunityIcons name={tier.icon as any} size={18} color="#FFF" />
                <Text bold color="$white" size="sm">{membershipTier} Member</Text>
              </HStack>
              <Text color="$white" size="xs" mt="$1" opacity={0.85}>
                {loading ? "Calculating your tier..." : `KES ${totalSpent.toLocaleString()} total invested`}
              </Text>
            </VStack>
            <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.6)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* ═══ Referral Invite Card ═══ */}
        <TouchableOpacity
          style={styles.inviteCard}
          activeOpacity={0.85}
          onPress={() => {}}
        >
          <HStack alignItems="center" space="md" flex={1}>
            <Box bg="#E8F5E9" p="$3" borderRadius={14}>
              <MaterialCommunityIcons name="account-group" size={28} color={colors.primary} />
            </Box>
            <VStack flex={1}>
              <Text bold size="sm" color="#1F2937">Invite friends to Optiven</Text>
              <Text size="xs" color="#6B7280" mt="$0.5">
                Earn up to 3% commission on every referral
              </Text>
            </VStack>
          </HStack>
        </TouchableOpacity>

        {/* ═══ Menu Sections ═══ */}
        <View style={styles.menuSection}>
          <MenuRow
            icon="account-edit"
            label="Personal Details"
            subtitle="Name, email, phone"
            onPress={() => navigation.navigate("PersonalDetails")}
          />
          <MenuRow
            icon="shield-star"
            label="Loyalty Program"
            subtitle={`${membershipTier} tier • View benefits`}
            onPress={() => navigation.navigate("LoyaltyProgramInfo")}
          />
          <MenuRow
            icon="tag-multiple"
            label="Deals & Discounts"
            subtitle="Exclusive offers for you"
            badge="3"
            onPress={() => navigation.navigate("Deals")}
          />
        </View>

        <Divider mx="$4" />

        <View style={styles.menuSection}>
          <MenuRow
            icon="cog-outline"
            label="Settings"
            subtitle="Preferences, notifications"
            onPress={() => {}}
          />
          <MenuRow
            icon="lock-reset"
            label="Change Password"
            subtitle="Update your credentials"
            onPress={() => navigation.navigate("ChangePassword")}
          />
          <MenuRow
            icon="help-circle-outline"
            label="Support"
            subtitle="Get help, FAQs"
            onPress={() => Linking.openURL("mailto:info@optiven.co.ke?subject=Support")}
          />
          <MenuRow
            icon="information-outline"
            label="About Optiven"
            subtitle="Learn more about us"
            onPress={() => Linking.openURL("https://www.optiven.co.ke")}
          />
        </View>

        <Divider mx="$4" />

        {/* ═══ Logout ═══ */}
        <View style={styles.menuSection}>
          <MenuRow
            icon="logout"
            label="Log out"
            danger
            onPress={() => logout()}
          />
        </View>

        {/* ═══ Version Footer ═══ */}
        <Box alignItems="center" py="$4">
          <Text size="2xs" color="#D1D5DB">Optiven Customer Portal v2.0.31</Text>
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // ── Header ──
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },

  // ── Quick Action Grid ──
  quickGrid: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: "#F9FFF9",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },

  // ── Promo / Tier Card ──
  promoCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  promoGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },

  // ── Invite Card ──
  inviteCard: {
    marginHorizontal: 20,
    backgroundColor: "#FBE9E7",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFCCBC",
    marginBottom: 12,
  },

  // ── Menu ──
  menuSection: {
    paddingVertical: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});
