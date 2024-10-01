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
  Heading,
  VStack,
  ChevronRightIcon,
  Icon,
  Badge,
  BadgeText,
} from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../utils/colors";
import { useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";


type AccountScreenProps = NativeStackScreenProps<AuthStackParamList, "Account">;

const AccountScreen: React.FC = () => {
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);
  const handleClose = () => setShowAlertDialog(false);

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <Box style={styles.container}>
        <VStack pt={20} px={20}>
          {/* User Info Section */}
          <Box style={styles.userInfoContainer}>
            <Avatar bgColor="$green700" size="lg" borderRadius="$full">
              <AvatarFallbackText>{user?.name || "User"}</AvatarFallbackText>
            </Avatar>
            <Box ml={16} style={styles.userInfo}>
              <Box style={styles.nameContainer}>
                <Text style={styles.userName}>{user?.name || "User"}</Text>
                {/* <TouchableOpacity onPress={() => setShowAlertDialog(true)}>
                  <Badge
                    size="md"
                    variant="solid"
                    action="muted"
                    bgColor={tierColors[dummyUser.membershipTier]}
                    ml={4}
                  >
                    <BadgeText color="white" bold>
                      {dummyUser.membershipTier}
                    </BadgeText>
                  </Badge>
                </TouchableOpacity> */}
              </Box>
              <Text style={styles.userEmail}>{user?.email || ""}</Text>
            </Box>
          </Box>

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
      </Box>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader style={{ marginBottom: 4 }}>
            {/* <Heading size="md">
              You're a {dummyUser.membershipTier.toLocaleLowerCase()} member!
            </Heading> */}
          </AlertDialogHeader>
          <AlertDialogBody style={{ marginTop: -20, marginBottom: 4 }}>
            <Text size="md">
              This means you're entitled to some 5% off of all meals at GMC!
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter style={{ marginTop: -20, marginBottom: 4 }}>
            <Button size="sm" onPress={handleClose} bgColor="black">
              <ButtonText>Close</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
