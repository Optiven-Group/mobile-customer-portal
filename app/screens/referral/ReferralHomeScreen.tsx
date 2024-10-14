import React from "react";
import { StyleSheet, View, Linking } from "react-native";
import { Button, ButtonText, Text } from "@gluestack-ui/themed";
import { NavigationProp } from "@react-navigation/native";
import { ReferralStackParamList } from "../../navigation/types";

interface ReferralHomeScreenProps {
  navigation: NavigationProp<ReferralStackParamList, "ReferralHome">;
}

const ReferralHomeScreen: React.FC<ReferralHomeScreenProps> = ({
  navigation,
}) => {
  const handleHowItWorks = () => {
    const url = "https://yourwebsite.com/how-it-works"; // Replace with your URL
    Linking.openURL(url);
  };

  const handleReferSomeone = () => {
    navigation.navigate("FeaturedProjects");
  };

  const handleViewProgress = () => {
    navigation.navigate("ReferralProgress");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Refer & Earn</Text>
      <Button onPress={handleHowItWorks} variant="link">
        <ButtonText>See How It Works</ButtonText>
      </Button>
      <Button onPress={handleReferSomeone} style={styles.button}>
        <ButtonText>Refer Someone</ButtonText>
      </Button>
      <Button onPress={handleViewProgress} style={styles.button}>
        <ButtonText>View My Referrals</ButtonText>
      </Button>
    </View>
  );
};

export default ReferralHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    width: "80%",
  },
});
