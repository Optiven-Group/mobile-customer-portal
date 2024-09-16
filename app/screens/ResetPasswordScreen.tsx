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
import Screen from "../components/Screen";
import api from "../utils/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";

type ResetPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "ResetPassword"
>;

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handlePasswordReset = async () => {
    try {
      const response = await api.post("/reset-password", {
        password,
      });
      Alert.alert(
        "Success",
        "Your password has been reset. You may now login."
      );
      navigation.navigate("Login");
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
            source={require("../../assets/logo.png")}
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
            <FormControlLabel mb="$1">
              <FormControlLabelText size="md">
                Enter New Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="text"
                keyboardType="visible-password"
                placeholder="******"
                value={password}
                onChangeText={setPassword}
              />
            </Input>
          </FormControl>
          <Button
            variant="solid"
            action="positive"
            mt="$4"
            size="lg"
            onPress={handlePasswordReset}
          >
            <ButtonText size="md">Reset Password</ButtonText>
          </Button>
        </Box>
      </Center>
    </Screen>
  );
};

export default ResetPasswordScreen;

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
