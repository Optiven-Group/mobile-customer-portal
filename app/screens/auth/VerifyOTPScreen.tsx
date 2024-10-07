import React, { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import {
  Box,
  Button,
  ButtonText,
  Center,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Image,
} from "@gluestack-ui/themed";
import Screen from "../../app-components/Screen";
import api from "../../utils/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

type VerifyOTPScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "VerifyOTP"
>;

const VerifyOTPScreen: React.FC<VerifyOTPScreenProps> = ({
  route,
  navigation,
}) => {
  const [otp, setOtp] = useState<string>("");
  const { customerNumber, email, forResetPassword } = route.params;

  const handleVerifyOTP = async () => {
    try {
      if (forResetPassword) {
        // Password Reset Flow
        await api.post("/verify-otp-reset", {
          email,
          otp,
        });
        Alert.alert("Success", "OTP verified");
        navigation.navigate("CreatePassword", {
          email,
          otp,
          forResetPassword: true,
        });
      } else {
        // Registration Flow
        await api.post("/verify-otp", {
          customer_number: customerNumber,
          email,
          otp,
        });
        Alert.alert("Success", "OTP verified");
        navigation.navigate("CreatePassword", {
          customerNumber,
          email,
          otp,
          forResetPassword: false,
        });
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Something went wrong"
      );
    }
  };

  return (
    <Screen style={styles.container}>
      <Center>
        <Box width="$4/5">
          <Image
            alt="logo"
            style={styles.logo}
            source={require("../../../assets/logo.png")}
            mb="$8"
          />
          <FormControl isRequired>
            <FormControlLabel mb="$1">
              <FormControlLabelText size="md">Enter OTP</FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="text"
                keyboardType="number-pad"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChangeText={setOtp}
              />
            </Input>
          </FormControl>
          <Button
            variant="solid"
            action="positive"
            mt="$4"
            size="lg"
            onPress={handleVerifyOTP}
          >
            <ButtonText size="md">Verify OTP</ButtonText>
          </Button>
        </Box>
      </Center>
    </Screen>
  );
};

export default VerifyOTPScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  logo: {
    alignSelf: "center",
    width: "100%",
  },
});
