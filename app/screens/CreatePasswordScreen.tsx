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

type CreatePasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "CreatePassword"
>;

const CreatePasswordScreen: React.FC<CreatePasswordScreenProps> = ({
  route,
  navigation,
}) => {
  const [newPassword, setNewPassword] = useState<string>("");
  const { email, otp } = route.params;

  const handleCreatePassword = async () => {
    try {
      await api.post("/reset-password", { email, otp, newPassword });
      Alert.alert("Success", "Password has been set. Please log in.");
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
              <FormControlLabelText size="md">
                New Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </Input>
          </FormControl>
          <Button
            variant="solid"
            action="positive"
            mt="$4"
            size="lg"
            onPress={handleCreatePassword}
          >
            <ButtonText size="md">Set Password</ButtonText>
          </Button>
        </Box>
      </Center>
    </Screen>
  );
};

export default CreatePasswordScreen;

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
