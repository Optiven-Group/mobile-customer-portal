import React from "react";
import { StyleSheet } from "react-native";
import {
  Box,
  Button,
  ButtonText,
  Center,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Image,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import Screen from "../components/Screen";

const VerifyOTPScreen = () => {
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
          <FormControl
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            isRequired={true}
          >
            <FormControlLabel mb="$1">
              <FormControlLabelText size="md">Enter OTP</FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="text"
                keyboardType="number-pad"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
              />
            </Input>
          </FormControl>
          <Button
            variant="solid"
            action="positive"
            mt="$4"
            size="lg"
            onPress={() => console.log("OTP verified")}
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
