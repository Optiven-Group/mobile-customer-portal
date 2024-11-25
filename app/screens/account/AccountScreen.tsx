import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallbackText,
  Box,
  VStack,
  ChevronRightIcon,
  Icon,
  Badge,
  BadgeText,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  ActivityIndicator,
  View,
  Linking,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../utils/colors";
import { useAuth } from "../../context/AuthContext";
import { useMembership } from "../../context/MembershipContext"; // Import the hook
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountStackParamList } from "../../navigation/types";
import Screen from "../../app-components/Screen";
import api from "../../utils/api";

type AccountScreenProps = NativeStackScreenProps<
  AccountStackParamList,
  "Account"
>;

type SettingOption = {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  type: "toggle" | "call";
};

const AccountScreen: React.FC<AccountScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { setMembershipTier, membershipTier } = useMembership();
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const getInitials = (name: string | undefined): string => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length === 0) return "U";
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0).toUpperCase() +
      names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  const getMembershipTier = (totalSpent: number): string => {
    if (totalSpent >= 20000000) return "Platinum";
    if (totalSpent >= 10000000) return "Gold";
    if (totalSpent >= 5000000) return "Silver";
    if (totalSpent >= 1000000) return "Bronze";
    return "Sapphire";
  };

  const tierColors: { [key: string]: string } = {
    Platinum: "#E5E4E2",
    Gold: "#FFD700",
    Silver: "#C0C0C0",
    Bronze: "#CD7F32",
    Sapphire: "#0F52BA",
  };

  useEffect(() => {
    const fetchTotalSpent = async () => {
      try {
        const response = await api.get("/user/total-spent");
        const fetchedTotal = response.data.total_spent;
        setTotalSpent(fetchedTotal);
        const tier = getMembershipTier(fetchedTotal);
        setMembershipTier(tier); // Set the tier in context
      } catch (error) {
        console.error("Failed to fetch total spent:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalSpent();
  }, [setMembershipTier]);

  const handleLogout = async () => {
    await logout();
  };

  const handleCallSupport = async () => {
    const phoneNumber = "tel:+254790300300";
    const supported = await Linking.canOpenURL(phoneNumber);
    if (supported) {
      Linking.openURL(phoneNumber);
    } else {
      Alert.alert("Error", "Unable to place a call.");
    }
  };

  const settingsOptions: SettingOption[] = [
    {
      id: "support",
      title: "Support",
      icon: "help-circle",
      type: "call",
    },
  ];

  return (
    <Screen style={styles.container}>
      <VStack pt={20} px={20}>
        {/* User Info Section */}
        <UserInfo
          user={user}
          loading={loading}
          membershipTier={membershipTier}
          tierColors={tierColors}
          initials={getInitials(user?.name)}
        />

        {/* Loyalty Section */}
        <LoyaltySection
          membershipTier={membershipTier}
          navigation={navigation}
        />

        {/* Settings Options */}
        <SettingsOptions
          settingsOptions={settingsOptions}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          handleCallSupport={handleCallSupport}
        />

        {/* Logout Button */}
        <LogoutButton handleLogout={handleLogout} />
      </VStack>
    </Screen>
  );
};

// Reusable UserInfo Component
type UserInfoProps = {
  user: any;
  loading: boolean;
  membershipTier: string;
  tierColors: { [key: string]: string };
  initials: string;
};

const UserInfo: React.FC<UserInfoProps> = ({
  user,
  loading,
  membershipTier,
  tierColors,
  initials,
}) => (
  <Box style={styles.userInfoContainer}>
    <Avatar bgColor="$green700" size="lg" borderRadius="$full">
      <AvatarFallbackText>{initials}</AvatarFallbackText>
    </Avatar>
    <Box ml={16} style={styles.userInfo}>
      <View style={styles.nameContainer}>
        <Text style={styles.userName}>{user?.name || "User"}</Text>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.activityIndicator}
          />
        ) : (
          <Badge
            size="md"
            variant="solid"
            action="muted"
            bgColor={tierColors[membershipTier]}
            style={styles.membershipBadge}
          >
            <BadgeText color="white" bold>
              {membershipTier}
            </BadgeText>
          </Badge>
        )}
      </View>
      <Text style={styles.userEmail}>{user?.email || ""}</Text>
    </Box>
  </Box>
);

// Reusable LoyaltySection Component
type LoyaltySectionProps = {
  membershipTier: string;
  navigation: NativeStackScreenProps<
    AccountStackParamList,
    "Account"
  >["navigation"];
};

const LoyaltySection: React.FC<LoyaltySectionProps> = ({
  membershipTier,
  navigation,
}) => (
  <Box style={styles.loyaltyContainer}>
    <View style={styles.loyaltyHeader}>
      <Text style={styles.loyaltyText}>Loyalty Program</Text>
    </View>
    <Text style={styles.tierText}>You are a {membershipTier} member!</Text>
    <Button
      onPress={() => navigation.navigate("LoyaltyProgramInfo")}
      bgColor={colors.secondary}
      my="$1"
      style={styles.loyaltyButton}
    >
      <ButtonText>View Benefits</ButtonText>
    </Button>
    <Button
      onPress={() => navigation.navigate("Deals")}
      bgColor={colors.primary}
      style={styles.loyaltyButton}
    >
      <ButtonText>View Deals and Discounts</ButtonText>
    </Button>
  </Box>
);

// Reusable SettingsOptions Component
type SettingsOptionsProps = {
  settingsOptions: SettingOption[];
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleCallSupport: () => void;
};

const SettingsOptions: React.FC<SettingsOptionsProps> = ({
  settingsOptions,
  isDarkMode,
  setIsDarkMode,
  handleCallSupport,
}) => (
  <FlatList
    data={settingsOptions}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity
        onPress={() => {
          if (item.type === "toggle") {
            setIsDarkMode(!isDarkMode);
          } else if (item.id === "support") {
            handleCallSupport();
          }
        }}
        style={styles.settingItem}
      >
        <Box style={styles.settingContainer}>
          <Box style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={colors.dark}
            />
            <Text ml={4} style={styles.settingText}>
              {item.title}
            </Text>
          </Box>
          {item.type === "toggle" ? (
            <Switch
              value={isDarkMode}
              onValueChange={(value) => setIsDarkMode(value)}
            />
          ) : (
            <Icon as={ChevronRightIcon} size="lg" color={colors.medium} />
          )}
        </Box>
      </TouchableOpacity>
    )}
    contentContainerStyle={styles.settingsList}
  />
);

// Reusable LogoutButton Component
type LogoutButtonProps = {
  handleLogout: () => void;
};

const LogoutButton: React.FC<LogoutButtonProps> = ({ handleLogout }) => (
  <TouchableOpacity onPress={handleLogout}>
    <Box style={styles.logoutContainer}>
      <Box style={styles.iconContainer}>
        <Avatar bgColor="$red600" size="md" borderRadius="$full">
          <MaterialCommunityIcons name="logout" color="white" size={24} />
        </Avatar>
        <Text ml={4} style={styles.logoutText}>
          Logout
        </Text>
      </Box>
      <Icon as={ChevronRightIcon} size="lg" color={colors.medium} />
    </Box>
  </TouchableOpacity>
);

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.dark,
  },
  activityIndicator: {
    marginTop: 4,
  },
  membershipBadge: {
    marginTop: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.medium,
    marginTop: 4,
  },
  loyaltyContainer: {
    marginTop: 20,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  loyaltyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loyaltyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
  },
  tierText: {
    fontSize: 14,
    color: colors.medium,
    marginTop: 4,
  },
  loyaltyButton: {
    marginTop: 8,
  },
  settingItem: {
    marginTop: 20,
  },
  settingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.dark,
    fontWeight: "600",
  },
  settingsList: {
    paddingBottom: 20,
  },
  logoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.dark,
    fontWeight: "600",
  },
});
