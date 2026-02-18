import React, { useState } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Avatar,
  AvatarFallbackText,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../../app-components/Screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountStackParamList } from "../../navigation/types";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");

type EditDetailsScreenProps = NativeStackScreenProps<AccountStackParamList, "EditDetails">;

const EditDetailsScreen: React.FC<EditDetailsScreenProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || route.params?.name || "");
  const [phone, setPhone] = useState(route.params?.phone || "");
  const [email, setEmail] = useState(user?.email || route.params?.email || "");
  const [isLoading, setIsLoading] = useState(false);

  const getInitials = (n?: string): string => {
    if (!n) return "U";
    const parts = n.trim().split(" ");
    if (parts.length <= 1) return (parts[0]?.[0] || "U").toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSave = () => {
    if (!name || !email) {
      Alert.alert("Error", "Name and email are required");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }, 1500);
  };

  const InputField = ({ icon, label, value, onChangeText, placeholder, disabled, keyboardType }: any) => (
    <Box mb="$4">
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.modernInput, disabled && styles.inputDisabled]}>
        <MaterialCommunityIcons name={icon} size={20} color={disabled ? "#9CA3AF" : "#388E3C"} />
        <TextInput
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          keyboardType={keyboardType}
          style={[styles.textInput, disabled && { color: "#9CA3AF" }]}
          placeholderTextColor="#C4C4C4"
        />
        {disabled && <MaterialCommunityIcons name="lock-outline" size={14} color="#D1D5DB" />}
      </View>
    </Box>
  );

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Avatar Header */}
        <View style={styles.header}>
          <Avatar bgColor="#388E3C" size="xl" borderRadius="$full">
            <AvatarFallbackText color="$white" fontSize={28}>
              {getInitials(name)}
            </AvatarFallbackText>
          </Avatar>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <MaterialCommunityIcons name="camera-outline" size={16} color="#388E3C" />
            <Text size="xs" color="#388E3C" bold ml="$1">Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <InputField icon="account-outline" label="Full Name" value={name} onChangeText={setName} />
          <InputField icon="email-outline" label="Email Address" value={email} onChangeText={setEmail} disabled />
          <InputField icon="phone-outline" label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default EditDetailsScreen;

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
  changePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7F1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E8F5E9",
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
  inputDisabled: {
    backgroundColor: "#F9FAFB",
    borderColor: "#F0F0F0",
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1B5E20",
    paddingVertical: Platform.OS === "ios" ? 2 : 0,
  },
  saveButton: {
    backgroundColor: "#388E3C",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.7 },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
