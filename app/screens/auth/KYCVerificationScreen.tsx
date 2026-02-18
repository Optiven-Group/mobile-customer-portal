import React, { useState } from "react";
import { StyleSheet, Alert, ScrollView } from "react-native";
import {
  Box,
  Center,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  Icon,
  ChevronDownIcon,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import Screen from "../../app-components/Screen";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import AppCard from "../../components/common/AppCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

// Note: Add KYC to AuthStackParamList if navigating from Auth flow, 
// or RootStackParamList if accessed from Settings.
// For now assuming it's part of onboarding or settings, but avoiding type errors 
// by using any for navigation props temporarily or assuming generic usage.

const KYCVerificationScreen = ({ navigation }: any) => {
  const [documentType, setDocumentType] = useState("id_card");
  const [documentNumber, setDocumentNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!documentNumber) {
      Alert.alert("Error", "Please enter document number");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert("Success", "KYC documents submitted successfully for verification", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    }, 1500);
  };

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Box p="$4">
          <Text size="2xl" bold mb="$2">Verify Identify</Text>
          <Text color="$gray500" mb="$6">Please submit your documents to verify your identity.</Text>
          
          <AppCard>
            <VStack space="md">
              <FormControl>
                <FormControlLabel mb="$1">
                  <FormControlLabelText>Document Type</FormControlLabelText>
                </FormControlLabel>
                <Select
                  selectedValue={documentType}
                  onValueChange={setDocumentType}
                >
                  <SelectTrigger variant="outline" size="md">
                    <SelectInput placeholder="Select option" />
                    <SelectIcon as={ChevronDownIcon} mr="$3" />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="National ID" value="id_card" />
                      <SelectItem label="Passport" value="passport" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </FormControl>

              <AppInput
                label="Document Number"
                placeholder="Enter document number"
                value={documentNumber}
                onChangeText={setDocumentNumber}
              />

              <Box mt="$4" p="$4" borderWidth={1} borderColor="$gray300" borderRadius="$md" borderStyle="dashed" alignItems="center">
                <Icon as={ChevronDownIcon} size="xl" color="$gray400" /> 
                {/* Placeholder for Upload Icon */}
                <Text mt="$2" color="$gray500">Upload Front Side</Text>
              </Box>

              <Box mt="$2" p="$4" borderWidth={1} borderColor="$gray300" borderRadius="$md" borderStyle="dashed" alignItems="center">
                 <Icon as={ChevronDownIcon} size="xl" color="$gray400" />
                 {/* Placeholder for Upload Icon */}
                <Text mt="$2" color="$gray500">Upload Back Side</Text>
              </Box>
              
              <AppButton
                title="Submit Verification"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                mt="$4"
              />
            </VStack>
          </AppCard>
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default KYCVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
