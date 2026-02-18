import React, { useState } from "react";
import { StyleSheet, Alert, ScrollView } from "react-native";
import { Box, Center, VStack } from "@gluestack-ui/themed";
import Screen from "../../app-components/Screen";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountStackParamList } from "../../navigation/types";
import { useAuth } from "../../context/AuthContext";

type EditDetailsScreenProps = NativeStackScreenProps<AccountStackParamList, "EditDetails">;

const EditDetailsScreen: React.FC<EditDetailsScreenProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || route.params?.name || "");
  const [phone, setPhone] = useState(route.params?.phone || "");
  const [email, setEmail] = useState(user?.email || route.params?.email || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!name || !email) {
      Alert.alert("Error", "Name and email are required");
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Profile updated successfully", [
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
              label="Full Name"
              value={name}
              onChangeText={setName}
            />
            <AppInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              isDisabled={true} // Usually email is not editable or requires verification
            />
            <AppInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
            />
            
            <AppButton
              title="Save Changes"
              onPress={handleSave}
              isLoading={isLoading}
              mt="$6"
            />
          </VStack>
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default EditDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
