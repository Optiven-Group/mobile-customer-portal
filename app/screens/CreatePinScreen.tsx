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
  Image,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import Screen from "../components/Screen";

const CreatePinScreen = () => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleCreatePin = () => {
    // handle PIN Creation here
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
          <FormControl
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            isRequired={true}
          >
            <FormControlLabel mb="$1">
              <FormControlLabelText size="md">Create PIN</FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="password"
                keyboardType="number-pad"
                maxLength={4}
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChangeText={setPin}
              />
            </Input>
          </FormControl>
          <FormControl
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            isRequired={true}
            mt="$2"
          >
            <FormControlLabel mb="$1">
              <FormControlLabelText size="md">Confirm PIN</FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="password"
                keyboardType="number-pad"
                maxLength={4}
                placeholder="Re-enter 4-digit PIN"
                value={confirmPin}
                onChangeText={setConfirmPin}
              />
            </Input>
          </FormControl>
          <Button
            variant="solid"
            action="positive"
            mt="$4"
            size="lg"
            onPress={handleCreatePin}
          >
            <ButtonText size="md">Create PIN</ButtonText>
          </Button>
        </Box>
      </Center>
    </Screen>
  );
};

export default CreatePinScreen;

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
