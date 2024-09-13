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

type VerifyUserScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "VerifyUser"
>;

const VerifyUserScreen: React.FC<VerifyUserScreenProps> = ({ navigation }) => {
  const [customerNumber, setCustomerNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleVerifyUser = async () => {
    if (!customerNumber || !email) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      const response = await api.post("/verify-user", {
        customer_number: customerNumber,
        email_or_phone: email,
      });
      Alert.alert("Success", "OTP sent to your contact");
      navigation.navigate("VerifyOTP", { customerNumber, email });
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
              <FormControlLabelText size="md">
                Customer Number
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="text"
                placeholder="Enter your customer number"
                value={customerNumber}
                onChangeText={setCustomerNumber}
              />
            </Input>
          </FormControl>
          <FormControl isRequired mt="$4">
            <FormControlLabel mb="$1">
              <FormControlLabelText size="md">Email</FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="text"
                placeholder="Enter your email"
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
            onPress={handleVerifyUser}
          >
            <ButtonText size="md">Submit</ButtonText>
          </Button>
        </Box>
      </Center>
    </Screen>
  );
};

export default VerifyUserScreen;

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
