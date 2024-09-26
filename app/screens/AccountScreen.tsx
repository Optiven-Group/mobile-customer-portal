import React from "react";
import {
  Avatar,
  AvatarFallbackText,
  Box,
  Divider,
  VStack,
  ChevronRightIcon,
  Icon,
} from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../utils/colors";
import { useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { MembershipTier, tierColors } from "../utils/membershipTiers";

type AccountScreenProps = NativeStackScreenProps<AuthStackParamList, "Account">;

const AccountScreen: React.FC<AccountScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth(); // Destructure user and logout from useAuth

  const handleLogout = async () => {
    await logout();
  };

  // Dummy User Data (Replace with actual user data from context or API)
  const dummyUser = {
    name: "Kasili Wachiye",
    email: "wachiye25@gmail.com",
    membershipTier: "Gold" as MembershipTier,
  };

  return (
    <Box style={styles.container}>
      <VStack pt={20} px={20} space={6}>
        {/* User Info Section */}
        <Box style={styles.userInfoContainer}>
          <Avatar bgColor="$green700" size="lg" borderRadius="$full">
            <AvatarFallbackText>{dummyUser.name.charAt(0)}</AvatarFallbackText>
          </Avatar>
          <Box ml={16} style={styles.userInfo}>
            <Box style={styles.nameContainer}>
              <Text style={styles.userName}>{dummyUser.name}</Text>
              {/* Membership Tier Label */}
              <Box
                style={[
                  styles.tierBadge,
                  { backgroundColor: tierColors[dummyUser.membershipTier] },
                ]}
              >
                <Text style={styles.tierText}>{dummyUser.membershipTier}</Text>
              </Box>
            </Box>
            <Text style={styles.userEmail}>{dummyUser.email}</Text>
          </Box>
        </Box>

        <Divider />

        {/* Logout Section */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutTouchable}>
          <Box style={styles.logoutContainer}>
            <Box style={styles.iconContainer}>
              <Avatar bgColor="$red600" size="lg" borderRadius="$full">
                <MaterialCommunityIcons name="logout" color="white" size={24} />
              </Avatar>
              <Text ml={4} style={styles.logoutText}>
                Logout
              </Text>
            </Box>
            <Icon as={ChevronRightIcon} size="lg" color={colors.medium} />
          </Box>
        </TouchableOpacity>
      </VStack>
    </Box>
  );
};

export default AccountScreen;

// Styles
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
  tierBadge: {
    marginLeft: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  tierText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 14,
    color: colors.medium,
    marginTop: 4,
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
