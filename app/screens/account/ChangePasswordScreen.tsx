import React, { useState } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Box, Text, VStack, HStack } from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../../app-components/Screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountStackParamList } from "../../navigation/types";

type ChangePasswordScreenProps = NativeStackScreenProps<AccountStackParamList, "ChangePassword">;

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Password changed successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }, 1500);
  };

  const PasswordField = ({ icon, label, value, onChangeText, showPassword, onToggle }: any) => (
    <Box mb="$4">
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.modernInput}>
        <MaterialCommunityIcons name={icon} size={20} color="#388E3C" />
        <TextInput
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          style={styles.textInput}
          placeholderTextColor="#C4C4C4"
        />
        {onToggle && (
          <TouchableOpacity onPress={onToggle}>
            <MaterialCommunityIcons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
    </Box>
  );

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!newPassword) return { level: 0, label: "", color: "#D1D5DB" };
    if (newPassword.length < 6) return { level: 1, label: "Weak", color: "#EF4444" };
    if (newPassword.length < 10) return { level: 2, label: "Medium", color: "#F59E0B" };
    return { level: 3, label: "Strong", color: "#2E7D32" };
  };

  const strength = getPasswordStrength();

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name="shield-lock-outline" size={32} color="#388E3C" />
          </View>
          <Text style={styles.headerTitle}>Change Password</Text>
          <Text style={styles.headerSubtitle}>Keep your account secure with a strong password</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <PasswordField
            icon="lock-outline"
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            showPassword={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)}
          />
          <PasswordField
            icon="lock-plus-outline"
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            showPassword={showNew}
            onToggle={() => setShowNew(!showNew)}
          />

          {/* Password strength */}
          {newPassword.length > 0 && (
            <View style={styles.strengthSection}>
              <HStack space="xs" mb="$1">
                {[1, 2, 3].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.strengthBar,
                      { backgroundColor: level <= strength.level ? strength.color : "#E5E7EB" },
                    ]}
                  />
                ))}
              </HStack>
              <Text size="2xs" color={strength.color} bold>{strength.label}</Text>
            </View>
          )}

          <PasswordField
            icon="lock-check-outline"
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            showPassword={showNew}
          />

          {/* Tips */}
          <View style={styles.tipsCard}>
            <HStack alignItems="center" space="xs" mb="$2">
              <MaterialCommunityIcons name="lightbulb-outline" size={14} color="#F59E0B" />
              <Text size="2xs" bold color="#92400E">Password tips</Text>
            </HStack>
            <VStack space="xs">
              {["At least 8 characters", "Mix of uppercase & lowercase", "Include numbers & symbols"].map((tip, i) => (
                <HStack key={i} alignItems="center" space="xs">
                  <MaterialCommunityIcons name="check" size={12} color="#9CA3AF" />
                  <Text size="2xs" color="#6B7280">{tip}</Text>
                </HStack>
              ))}
            </VStack>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Updating..." : "Update Password"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FBF6" },
  header: {
    alignItems: "center",
    paddingVertical: 28,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B5E20",
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#66BB6A",
    marginTop: 4,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 20,
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
  strengthSection: { marginBottom: 16, marginTop: -8 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  tipsCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FEF3C7",
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
  buttonDisabled: { opacity: 0.7 },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
