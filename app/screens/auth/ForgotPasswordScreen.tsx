import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  TextInput,
  Animated,
  Easing,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import {
  Box,
  Center,
  Image,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../../app-components/Screen";
import api from "../../utils/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/request-otp", { email });
      Alert.alert("Success", "An OTP has been sent to your email. Use it to reset your password.");
      navigation.navigate("VerifyOTP", { email, forResetPassword: true });
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

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
            <Center mt={screenHeight * 0.1}>
              <Box style={styles.iconCircle}>
                <MaterialCommunityIcons name="lock-reset" size={40} color="#388E3C" />
              </Box>
              <Text style={styles.brandTitle}>Reset Password</Text>
              <Text style={styles.brandSubtitle}>
                Enter your email and we'll send you a verification code
              </Text>
            </Center>

            <Box style={styles.formCard}>
              <Box mb="$5">
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.modernInput}>
                  <MaterialCommunityIcons name="email-outline" size={20} color="#388E3C" />
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

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Text>
              </TouchableOpacity>
            </Box>

            <VStack mt="$6" alignItems="center" pb="$8">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backLink}>← Back to Login</Text>
              </TouchableOpacity>
            </VStack>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default ForgotPasswordScreen;

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
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
    marginTop: 6,
    letterSpacing: 0.3,
    textAlign: "center",
    paddingHorizontal: 20,
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
  submitButton: {
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
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  backLink: {
    fontSize: 14,
    color: "#388E3C",
    fontWeight: "600",
  },
});
