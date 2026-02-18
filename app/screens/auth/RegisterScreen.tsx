import React, { useState } from "react";
import { StyleSheet, Alert, ScrollView } from "react-native";
import { Box, Center, Image, Text, Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel, CheckIcon } from "@gluestack-ui/themed";
import Screen from "../../app-components/Screen";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, "Register">;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      Alert.alert("Error", "Please agree to the Terms & Conditions");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Account created successfully. Please verify your phone/email.", [
        { text: "OK", onPress: () => navigation.navigate("VerifyOTP", { email, phone, name: fullName, userId: 123 }) }
      ]);
    }, 1500);
  };

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Center>
          <Box width={isTablet ? "60%" : "85%"} py="$8">
            <Image
              alt="logo"
              style={styles.logo}
              source={require("../../../assets/logo.png")}
              mb="$6"
            />
            <Text size="2xl" bold mb="$1" textAlign="center">Create Account</Text>
            <Text color="$gray500" mb="$6" textAlign="center">Sign up to get started</Text>

            <AppInput
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              mb="$4"
            />
            <AppInput
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              mb="$4"
            />
            <AppInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              mb="$4"
            />
            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              type="password"
              mb="$4"
            />
            <AppInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              type="password"
              mb="$4"
            />

            <Checkbox
              size="md"
              isInvalid={false}
              isDisabled={false}
              value="terms"
              isChecked={agreeTerms}
              onChange={setAgreeTerms}
              mb="$6"
            >
              <CheckboxIndicator mr="$2">
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
              <CheckboxLabel>I agree to the Terms & Conditions</CheckboxLabel>
            </Checkbox>

            <AppButton
              title="Sign Up"
              onPress={handleRegister}
              isLoading={isLoading}
            />

            <Box mt="$4" alignItems="center">
              <Text>Already have an account? <Text color="$blue600" onPress={() => navigation.navigate("Login")}>Login</Text></Text>
            </Box>
          </Box>
        </Center>
      </ScrollView>
    </Screen>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  logo: {
    alignSelf: "center",
    width: 150,
    height: 60,
    resizeMode: "contain",
  },
});
