import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  Avatar,
  AvatarFallbackText,
  Button,
  ButtonText,
  Box,
  VStack,
  ChevronRightIcon,
  Icon,
  Badge,
  BadgeText,
} from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import { StyleSheet, TouchableOpacity, Share } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../utils/colors";
import { useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountStackParamList } from "../navigation/types";
import { ShareIcon } from "@gluestack-ui/themed";
import Screen from "../components/Screen";

type AccountScreenProps = NativeStackScreenProps<
  AccountStackParamList,
  "Account"
>;

const AccountScreen: React.FC<AccountScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

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

  const totalSpent = user?.totalSpent ?? 0; // Use nullish coalescing
  // const membershipTier = getMembershipTier(totalSpent);
  // remove this later
  const membershipTier = getMembershipTier(1000000);

  const handleLogout = async () => {
    await logout();
  };

  const handleInvite = () => {
    const message = `Join this amazing real estate app using my referral code: ${
      user?.referralCode ?? "r45dAsdeK8"
    }`;
    Share.share({
      message,
    });
  };

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
                <TouchableOpacity
                  onPress={() => navigation.navigate("LoyaltyInfo")}
                >
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
                </TouchableOpacity>
              </Box>
              <Text style={styles.userEmail}>{user?.email || ""}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("LoyaltyInfo")}
              >
                <Text style={styles.learnMoreText} size="sm" bold>
                  Learn More
                </Text>
              </TouchableOpacity>
            </Box>
          </Box>

          {/* Refer to Earn Section */}
          <Box style={styles.referContainer}>
            <Box style={styles.referContent}>
              <Box style={styles.referImageContainer}>
                <Icon as={ShareIcon} style={styles.referImage} />
              </Box>
              <VStack>
                <Text style={styles.referTitle}>Refer & get rewards</Text>
                <Text style={styles.referCode}>
                  Your code {user?.referralCode || "r45dAsdeK8"}
                </Text>
              </VStack>
            </Box>
            <Button onPress={handleInvite} style={styles.inviteButton}>
              <ButtonText style={styles.inviteButtonText}>Invite</ButtonText>
            </Button>
          </Box>

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

      {/* AlertDialog can be removed if not needed */}
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
  learnMoreText: {
    color: colors.primary,
    marginTop: 4,
  },
  referContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderColor: colors.light,
    borderWidth: 1,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  referContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  referImageContainer: {
    height: 40,
    width: 40,
    marginRight: 12,
  },
  referImage: {
    height: "100%",
    width: "100%",
  },
  referTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.dark,
  },
  referCode: {
    fontSize: 14,
    color: colors.medium,
  },
  inviteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
  },
  inviteButtonText: {
    color: colors.white,
    fontSize: 14,
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
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.dark,
    fontWeight: "600",
  },
});
