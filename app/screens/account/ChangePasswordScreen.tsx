import React, { useState } from "react";
import { StyleSheet, Alert, ScrollView } from "react-native";
import { Box, VStack } from "@gluestack-ui/themed";
import Screen from "../../app-components/Screen";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountStackParamList } from "../../navigation/types";

type ChangePasswordScreenProps = NativeStackScreenProps<AccountStackParamList, "ChangePassword">;

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Password changed successfully", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    }, 1500);
  };

  return (
    <Screen style={styles.container}>
      <ScrollView>
        <Box p="$4">
          <VStack space="md">
            <AppInput
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              type="password"
            />
            <AppInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              type="password"
            />
            <AppInput
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              type="password"
            />
            
            <AppButton
              title="Change Password"
              onPress={handleChangePassword}
              isLoading={isLoading}
              mt="$6"
            />
          </VStack>
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
