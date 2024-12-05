import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Linking,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Button, ButtonText, Heading, Text } from "@gluestack-ui/themed";
import { NavigationProp } from "@react-navigation/native";
import { ReferralStackParamList } from "../../navigation/types";
import colors from "../../utils/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface ReferralHomeScreenProps {
  navigation: NavigationProp<ReferralStackParamList, "ReferralHome">;
}

const ReferralHomeScreen: React.FC<ReferralHomeScreenProps> = ({
  navigation,
}) => {
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  const handleHowItWorks = () => {
    const url = "https://ors.optiven.co.ke/";
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const handleReferSomeone = () => {
    navigation.navigate("FeaturedProjects");
  };

  const handleViewProgress = () => {
    navigation.navigate("ReferralProgress");
  };

  return (
    <View style={styles.container}>
      {isImageLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      <ImageBackground
        source={require("../../../assets/app-images/wallet.jpg")} // Replace with a more suitable image if needed
        style={styles.background}
        resizeMode="cover"
        onLoadEnd={() => setIsImageLoading(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <Heading size="3xl" color={colors.white} mb="$2" textAlign="center">
              Refer & Earn
            </Heading>
            <Text color={colors.white} textAlign="center" mb="$6" size="lg">
              Share the opportunity and get rewarded for every successful
              referral!
            </Text>

            <Button
              onPress={handleReferSomeone}
              mt="$4"
              width={width * 0.8}
              bgColor={colors.primary}
              size="md"
            >
              <MaterialCommunityIcons
                name="account-plus"
                size={20}
                color={colors.white}
                style={styles.buttonIcon}
              />
              <ButtonText>Refer Someone</ButtonText>
            </Button>

            <Button
              onPress={handleViewProgress}
              mt="$4"
              width={width * 0.8}
              bgColor={colors.white}
              size="md"
            >
              <MaterialCommunityIcons
                name="clipboard-check"
                size={20}
                color={colors.primary}
                style={styles.buttonIcon}
              />
              <ButtonText color={colors.primary}>View My Referrals</ButtonText>
            </Button>

            <Button
              onPress={handleHowItWorks}
              variant="link"
              mt="$8"
              style={styles.linkButton}
            >
              <ButtonText color={colors.white} underline>
                See How It Works
              </ButtonText>
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default ReferralHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black, // Fallback background color
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
    zIndex: 1,
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay for better text readability
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  contentContainer: {
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 10,
  },
  linkButton: {
    paddingVertical: 10,
  },
});
