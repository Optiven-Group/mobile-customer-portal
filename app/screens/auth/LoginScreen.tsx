import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  Easing,
  View,
  TextInput,
} from "react-native";
import {
  Box,
  Center,
  Image,
  Text,
  VStack,
  HStack,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../../app-components/Screen";
import api from "../../utils/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { useAuth } from "../../context/AuthContext";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginAsGuest } = useAuth();

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Error", "Email and password cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/login", {
        email: trimmedEmail,
        password: trimmedPassword,
      });
      const { access_token, user: userData } = response.data;

      if (!access_token || !userData) {
        throw new Error("Invalid login response");
      }

      await login(access_token, userData);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || error.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen style={styles.container}>
      {/* Background decoration */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              width: isTablet ? "60%" : "100%",
              alignSelf: "center",
              paddingHorizontal: 24,
            }}
          >
            {/* Logo & Header */}
            <Center mt={screenHeight * 0.08}>
              <Image
                alt="Optiven Logo"
                style={styles.logo}
                source={require("../../../assets/logo.png")}
              />
              <Text style={styles.brandTitle}>Welcome Back</Text>
              <Text style={styles.brandSubtitle}>
                Sign in to your Optiven account
              </Text>
            </Center>

            {/* Form Card */}
            <Box style={styles.formCard}>
              {/* Email Field */}
              <Box mb="$5">
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.modernInput}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color="#388E3C"
                  />
                  <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textInput}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </Box>

              {/* Password Field */}
              <Box mb="$4">
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.modernInput}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={20}
                    color="#388E3C"
                  />
                  <TextInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={styles.textInput}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </Box>

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
                style={styles.forgotRow}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Text>
              </TouchableOpacity>
            </Box>

            {/* Bottom Links */}
            <VStack mt="$6" space="md" alignItems="center" pb="$8">
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <HStack space="xs">
                  <Text style={styles.bottomLink}>Don't have an account?</Text>
                  <Text style={styles.bottomLinkBold}>Sign Up</Text>
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("VerifyUser")}>
                <Text style={styles.activateLink}>
                  Already a customer? Activate Account
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={loginAsGuest}>
                <Text style={styles.guestLink}>Continue as Guest →</Text>
              </TouchableOpacity>
            </VStack>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default LoginScreen;

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
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 16,
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
    marginTop: 28,
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
  forgotRow: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    color: "#388E3C",
    fontWeight: "600",
  },
  loginButton: {
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
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
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
  activateLink: {
    fontSize: 13,
    color: "#5A0000",
    fontWeight: "600",
  },
  guestLink: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 4,
  },
});
