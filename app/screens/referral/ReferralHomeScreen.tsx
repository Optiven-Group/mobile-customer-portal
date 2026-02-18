import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
  ImageBackground,
} from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { useAuth } from "../../context/AuthContext";
import { NavigationProp } from "@react-navigation/native";
import { ReferralStackParamList } from "../../navigation/types";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ReferralHomeScreen = ({
  navigation,
}: {
  navigation: NavigationProp<ReferralStackParamList, "ReferralHome">;
}) => {
  const { user } = useAuth();

  const referralCode = user?.customerNumber || "OPT-REF-2024";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join Optiven Real Estate! Use my referral code: ${referralCode}. Invest in your future today! https://www.optiven.co.ke/referral?code=${referralCode}`,
      });
    } catch (e) {
      console.log("Share error", e);
    }
  };

  return (
    <Screen style={styles.container}>
      <ImageBackground
        source={require("../../../assets/app-images/wallet.jpg")}
        style={styles.background}
        imageStyle={{ opacity: 0.5 }}
        resizeMode="cover"
      >
        {/* Hero Content */}
        <VStack flex={1} justifyContent="center" px="$6" space="lg">
          {/* Title */}
          <VStack space="xs">
            <Heading size="2xl" color={colors.primary}>
              Refer & Earn
            </Heading>
            <Text size="md" color="$coolGray600" lineHeight="$lg">
              Share Optiven properties with friends and family.{"\n"}
              Earn commission on every successful referral!
            </Text>
          </VStack>

          {/* Action Buttons */}
          <VStack space="md" mt="$4">
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("FeaturedProjects")}
            >
              <Box bg={colors.primary + "15"} p="$3" borderRadius="$full">
                <MaterialCommunityIcons
                  name="account-plus"
                  size={24}
                  color={colors.primary}
                />
              </Box>
              <VStack flex={1} ml="$3">
                <Text bold size="md">
                  Refer Someone
                </Text>
                <Text size="xs" color="$coolGray500">
                  Share a project with a friend
                </Text>
              </VStack>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={colors.coolGray}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("ReferralProgress")}
            >
              <Box bg={colors.secondary + "15"} p="$3" borderRadius="$full">
                <MaterialCommunityIcons
                  name="clipboard-list"
                  size={24}
                  color={colors.secondary}
                />
              </Box>
              <VStack flex={1} ml="$3">
                <Text bold size="md">
                  View My Referrals
                </Text>
                <Text size="xs" color="$coolGray500">
                  Track your referral progress
                </Text>
              </VStack>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={colors.coolGray}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("HowItWorks")}
            >
              <Box bg="#2196F315" p="$3" borderRadius="$full">
                <MaterialCommunityIcons
                  name="information"
                  size={24}
                  color="#2196F3"
                />
              </Box>
              <VStack flex={1} ml="$3">
                <Text bold size="md">
                  See How It Works
                </Text>
                <Text size="xs" color="$coolGray500">
                  Step-by-step guide & FAQs
                </Text>
              </VStack>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={colors.coolGray}
              />
            </TouchableOpacity>
          </VStack>

          {/* Dashboard Button */}
          <Button
            size="lg"
            bg={colors.primary}
            borderRadius={14}
            mt="$3"
            onPress={() => navigation.navigate("ReferralDashboard" as any)}
          >
            <HStack space="sm" alignItems="center">
              <MaterialCommunityIcons
                name="view-dashboard"
                size={20}
                color="white"
              />
              <ButtonText size="md">My Referral Dashboard</ButtonText>
            </HStack>
          </Button>

          {/* Quick Share */}
          <TouchableOpacity style={styles.shareBar} onPress={handleShare}>
            <MaterialCommunityIcons
              name="share-variant"
              size={18}
              color={colors.primary}
            />
            <Text size="xs" bold color={colors.primary} ml="$2">
              Quick Share: {referralCode}
            </Text>
          </TouchableOpacity>
        </VStack>
      </ImageBackground>
    </Screen>
  );
};

export default ReferralHomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  background: { flex: 1, backgroundColor: "#F5F7FA" },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  shareBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.primary + "10",
    alignSelf: "center",
  },
});
