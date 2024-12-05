import React, { useState } from "react";
import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
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

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

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
        <Box
          style={[
            styles.boxContainer,
            { width: isTablet ? "60%" : "85%" },
          ]}
        >
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
    paddingHorizontal: isTablet ? 20 : 10,
  },
  logo: {
    alignSelf: "center",
    width: isTablet ? "80%" : "70%",
    height: isTablet ? 100 : 80,
    resizeMode: "contain",
  },
  boxContainer: {
    alignSelf: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  optionText: {
    color: "#007AFF",
    fontSize: Platform.OS === "ios" ? 16 : 14,
  },
});
