import React, { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import {
  Box,
  Input,
  InputField,
  Button,
  ButtonText,
  VStack,
  HStack,
  Checkbox,
  Text,
} from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountStackParamList } from "../navigation/types";
import colors from "../utils/colors";

type EditDetailsScreenProps = NativeStackScreenProps<
  AccountStackParamList,
  "EditDetails"
>;

const EditDetailsScreen: React.FC<EditDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { name, email, phone } = route.params;

  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [newPhone, setNewPhone] = useState(phone);

  const handleSave = () => {
    Alert.alert(
      "Submitted for Approval",
      "Your changes have been submitted for approval. Approval may take some time, and you will be notified once approved."
    );
    navigation.goBack();
  };

  return (
    <VStack style={styles.container}>
      <Box>
        <Input variant="outline">
          <InputField
            placeholder="Name"
            value={newName}
            onChangeText={setNewName}
          />
        </Input>
      </Box>

      <Box mt="$4">
        <Input variant="outline">
          <InputField
            placeholder="Email"
            value={newEmail}
            onChangeText={setNewEmail}
          />
        </Input>
      </Box>

      <Box mt="$4">
        <Input variant="outline">
          <InputField
            placeholder="Phone"
            value={newPhone}
            onChangeText={setNewPhone}
          />
        </Input>
      </Box>

      <Button onPress={handleSave} bgColor={colors.primary} mt="$4">
        <ButtonText>Save Changes</ButtonText>
      </Button>
    </VStack>
  );
};

export default EditDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  checkboxText: {
    fontSize: 16,
    color: colors.medium,
  },
});
