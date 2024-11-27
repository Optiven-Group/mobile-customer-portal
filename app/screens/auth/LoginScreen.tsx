import React, { useState } from "react";
import { StyleSheet, Alert, TouchableOpacity } from "react-native";
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
  Text,
} from "@gluestack-ui/themed";
import Screen from "../../app-components/Screen";
import api from "../../utils/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { useAuth } from "../../context/AuthContext";

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", { email, password });
      const { access_token, refresh_token, user: userData } = response.data;

      if (!access_token || !refresh_token || !userData) {
        throw new Error("Invalid login response");
      }

      await login(access_token, refresh_token, userData);
      // Navigation will happen automatically due to isLoggedIn change
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || error.message || "Something went wrong"
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
          <FormControl isRequired mt="$2">
            <FormControlLabel mb="$1">
              <FormControlLabelText size="md">Password</FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="password"
                placeholder="Enter your password"
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
            onPress={handleLogin}
          >
            <ButtonText size="md">Login</ButtonText>
          </Button>
          <Box style={styles.optionsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.optionText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("VerifyUser")}>
              <Text style={styles.optionText}>Register</Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </Center>
    </Screen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  logo: {
    alignSelf: "center",
    width: "100%",
  },
  forgotPasswordBtn: {
    alignSelf: "flex-start",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  optionText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
