import React from "react";
import { StyleSheet, View, Linking, ImageBackground } from "react-native";
import { Button, ButtonText, Heading, Text } from "@gluestack-ui/themed";
import { NavigationProp } from "@react-navigation/native";
import { ReferralStackParamList } from "../../navigation/types";
import colors from "../../utils/colors";

interface ReferralHomeScreenProps {
  navigation: NavigationProp<ReferralStackParamList, "ReferralHome">;
}

const ReferralHomeScreen: React.FC<ReferralHomeScreenProps> = ({
  navigation,
}) => {
  const handleHowItWorks = () => {
    const url = "https://ors.optiven.co.ke/";
    Linking.openURL(url);
  };

  const handleReferSomeone = () => {
    navigation.navigate("FeaturedProjects");
  };

  const handleViewProgress = () => {
    navigation.navigate("ReferralProgress");
  };

  return (
    <ImageBackground
      source={require("../../../assets/app-images/wallet.jpg")} // Replace this with a more suitable image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Heading size="3xl" color={colors.white} mb="$2">
          Refer & Earn
        </Heading>
        <Text color={colors.white} textAlign="center" mb="$4">
          Share the opportunity, and get rewarded for every successful referral!
        </Text>

        <Button
          onPress={handleReferSomeone}
          mt="$4"
          width="$full"
          bgColor={colors.primary}
          size="md"
        >
          <ButtonText>Refer Someone</ButtonText>
        </Button>
        <Button
          onPress={handleViewProgress}
          mt="$4"
          width="$full"
          bgColor={colors.white}
          size="md"
        >
          <ButtonText color={colors.black}>View My Referrals</ButtonText>
        </Button>
        <Button onPress={handleHowItWorks} variant="link" mt="$32">
          <ButtonText color={colors.white}>See How It Works</ButtonText>
        </Button>
      </View>
    </ImageBackground>
  );
};

export default ReferralHomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
});
