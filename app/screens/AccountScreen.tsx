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
} from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../utils/colors";
import { useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountStackParamList } from "../navigation/types";
import Screen from "../app-components/Screen";
import api from "../utils/api";

type AccountScreenProps = NativeStackScreenProps<
  AccountStackParamList,
  "Account"
>;

const AccountScreen: React.FC<AccountScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to determine membership tier
  const getMembershipTier = (totalSpent: number): string => {
    if (totalSpent >= 20000000) return "Platinum";
    if (totalSpent >= 10000000) return "Gold";
    if (totalSpent >= 5000000) return "Silver";
    if (totalSpent >= 1000000) return "Bronze";
    return "Sapphire";
  };

  // Define colors for each tier
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
        setTotalSpent(response.data.total_spent);
      } catch (error) {
        console.error("Failed to fetch total spent:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalSpent();
  }, []);

  const membershipTier = getMembershipTier(totalSpent);

  console.log(totalSpent);

  const handleLogout = async () => {
    await logout();
  };

  const settingsOptions = [
    {
      id: "darkMode",
      title: "Dark Mode",
      icon: "brightness-6",
      type: "toggle",
    },
    {
      id: "support",
      title: "Support",
      icon: "help-circle",
      type: "navigate",
      targetScreen: "Support",
    },
  ];

  return (
    <>
      <Screen style={styles.container}>
        <VStack pt={20} px={20}>
          {/* User Info Section */}
          <Box style={styles.userInfoContainer}>
            <Avatar bgColor="$green700" size="lg" borderRadius="$full">
              <AvatarFallbackText>{user?.name || "User"}</AvatarFallbackText>
            </Avatar>
            <Box ml={16} style={styles.userInfo}>
              <Box style={styles.nameContainer}>
                <Text style={styles.userName}>{user?.name || "User"}</Text>
                {loading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Badge
                    size="md"
                    variant="solid"
                    action="muted"
                    bgColor={tierColors[membershipTier]}
                    ml={4}
                  >
                    <BadgeText color="white" bold>
                      {membershipTier}
                    </BadgeText>
                  </Badge>
                )}
              </Box>
              <Text style={styles.userEmail}>{user?.email || ""}</Text>
            </Box>
          </Box>

          {/* Settings Options */}
          <FlatList
            data={settingsOptions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (item.type === "navigate") {
                    navigation.navigate(item.targetScreen);
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
                      onValueChange={(value) => {
                        setIsDarkMode(value);
                        // Implement theme switching here
                      }}
                    />
                  ) : (
                    <Icon
                      as={ChevronRightIcon}
                      size="lg"
                      color={colors.medium}
                    />
                  )}
                </Box>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.settingsList}
          />

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutTouchable}
          >
            <Box style={styles.logoutContainer}>
              <Box style={styles.iconContainer}>
                <Avatar bgColor="$red600" size="lg" borderRadius="$full">
                  <MaterialCommunityIcons
                    name="logout"
                    color="white"
                    size={24}
                  />
                </Avatar>
                <Text ml={4} style={styles.logoutText}>
                  Logout
                </Text>
              </Box>
              <Icon as={ChevronRightIcon} size="lg" color={colors.medium} />
            </Box>
          </TouchableOpacity>
        </VStack>
      </Screen>
    </>
  );
};

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
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.dark,
  },
  userEmail: {
    fontSize: 14,
    color: colors.medium,
    marginTop: 4,
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
  logoutTouchable: {
    marginTop: 20,
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
