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

type ForgotPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "ForgotPassword"
>;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  route,
  navigation,
}) => {
  const [email, setEmail] = useState<string>("");

  const handleSendOTP = async () => {
    try {
      const response = await api.post("/forgot-password", {
        email,
      });
      Alert.alert(
        "Success",
        "An OTP has sent to your email. Use it to reset your password"
      );
      navigation.navigate("ResetPassword");
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
              <FormControlLabelText size="md">Email</FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="text"
                keyboardType="email-address"
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
              />
            </Input>
          </FormControl>
          <Button
            variant="solid"
            action="positive"
            mt="$4"
            size="lg"
            onPress={handleSendOTP}
          >
            <ButtonText size="md">Request Password Change</ButtonText>
          </Button>
        </Box>
      </Center>
    </Screen>
  );
};

export default ForgotPasswordScreen;

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