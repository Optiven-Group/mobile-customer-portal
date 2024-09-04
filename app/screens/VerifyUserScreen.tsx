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
  Input,
  InputField,
} from "@gluestack-ui/themed";
import Screen from "../components/Screen";
import { Image } from "@gluestack-ui/themed";

const VerifyUserScreen = () => {
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
              <FormControlLabelText size="md">
                Email or Phone Number
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField type="text" placeholder="Enter your email or phone" />
            </Input>
          </FormControl>
          <Button
            variant="solid"
            action="positive"
            mt="$4"
            size="lg"
            onPress={() => console.log("OTP sent")}
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
