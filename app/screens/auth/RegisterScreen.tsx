import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  TextInput,
  Animated,
  Easing,
  KeyboardAvoidingView,
} from "react-native";
import {
  Box,
  Center,
  Image,
  Text,
  VStack,
  HStack,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
  CheckIcon,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../../app-components/Screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, "Register">;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

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
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Account created successfully. Please verify your phone/email.", [
        { text: "OK", onPress: () => navigation.navigate("VerifyOTP", { email, phone, name: fullName, userId: 123 }) },
      ]);
    }, 1500);
  };

  const InputField = ({ icon, label, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize, rightIcon }: any) => (
    <Box mb="$4">
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.modernInput}>
        <MaterialCommunityIcons name={icon} size={20} color="#388E3C" />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || "none"}
          style={styles.textInput}
          placeholderTextColor="#9CA3AF"
        />
        {rightIcon}
      </View>
    </Box>
  );

  return (
    <Screen style={styles.container}>
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              width: isTablet ? "60%" : "100%",
              alignSelf: "center",
              paddingHorizontal: 24,
            }}
          >
            {/* Header */}
            <Center mt={screenHeight * 0.04}>
              <Image alt="Optiven Logo" style={styles.logo} source={require("../../../assets/logo.png")} />
              <Text style={styles.brandTitle}>Create Account</Text>
              <Text style={styles.brandSubtitle}>Sign up to get started with Optiven</Text>
            </Center>

            {/* Form Card */}
            <Box style={styles.formCard}>
              <InputField
                icon="account-outline"
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
              <InputField
                icon="phone-outline"
                label="Phone Number"
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <InputField
                icon="email-outline"
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <InputField
                icon="lock-outline"
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                }
              />
              <InputField
                icon="lock-check-outline"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />

              {/* Terms */}
              <Checkbox
                size="md"
                isInvalid={false}
                isDisabled={false}
                value="terms"
                isChecked={agreeTerms}
                onChange={setAgreeTerms}
                mb="$5"
              >
                <CheckboxIndicator mr="$2" borderColor="#388E3C">
                  <CheckboxIcon as={CheckIcon} color="#388E3C" />
                </CheckboxIndicator>
                <CheckboxLabel style={{ fontSize: 13, color: "#6B7280" }}>
                  I agree to the Terms & Conditions
                </CheckboxLabel>
              </Checkbox>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Text>
              </TouchableOpacity>
            </Box>

            {/* Bottom Link */}
            <VStack mt="$5" space="sm" alignItems="center" pb="$8">
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <HStack space="xs">
                  <Text style={styles.bottomLink}>Already have an account?</Text>
                  <Text style={styles.bottomLinkBold}>Login</Text>
                </HStack>
              </TouchableOpacity>
            </VStack>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FBF6",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.08,
  },
  circle1: {
    width: screenWidth * 1.0,
    height: screenWidth * 1.0,
    backgroundColor: "#4CAF50",
    top: -screenWidth * 0.5,
    right: -screenWidth * 0.3,
  },
  circle2: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    backgroundColor: "#81C784",
    bottom: -screenWidth * 0.15,
    left: -screenWidth * 0.2,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1B5E20",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: "#66BB6A",
    marginTop: 4,
    letterSpacing: 0.3,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  modernInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7F1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    borderWidth: 1.5,
    borderColor: "#E8F5E9",
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1B5E20",
    paddingVertical: Platform.OS === "ios" ? 2 : 0,
  },
  signUpButton: {
    backgroundColor: "#388E3C",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bottomLink: {
    fontSize: 14,
    color: "#6B7280",
  },
  bottomLinkBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#388E3C",
  },
});
