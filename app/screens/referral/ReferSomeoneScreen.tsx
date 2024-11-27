import React from "react";
import { StyleSheet, View, Share } from "react-native";
import { Text, Button, ButtonText } from "@gluestack-ui/themed";
import QRCode from "react-native-qrcode-svg";
import { useAuth } from "../../context/AuthContext";
import { RouteProp } from "@react-navigation/native";
import { ReferralStackParamList } from "../../navigation/types";

interface ReferSomeoneScreenProps {
  route: RouteProp<ReferralStackParamList, "ReferSomeone">;
}

const ReferSomeoneScreen: React.FC<ReferSomeoneScreenProps> = ({ route }) => {
  const { project } = route.params;
  const { user } = useAuth();

  const referralCode = `${user?.customerNumber}-${project.project_id}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me in the ${project.name} project! Use my referral code ${referralCode} and get 1% off!`,
      });
    } catch (error) {
      console.error("Error sharing referral code:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Referral Code</Text>
      <Text style={styles.code}>{referralCode}</Text>
      <QRCode value={referralCode} size={200} />
      <Button onPress={handleShare} style={styles.button}>
        <ButtonText>Share Referral Code</ButtonText>
      </Button>
    </View>
  );
};

export default ReferSomeoneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  code: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});
