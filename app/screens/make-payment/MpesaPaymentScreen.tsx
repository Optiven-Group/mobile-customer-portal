import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import {
  Box,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Text,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import colors from "../../utils/colors";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

type MpesaPaymentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "MpesaPayment"
>;

const MpesaPaymentScreen: React.FC<MpesaPaymentScreenProps> = ({
  route,
  navigation,
}) => {
  const { payment, property } = route.params;
  const { user } = useAuth();

  const [amount, setAmount] = useState("150000");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mpesaPin, setMpesaPin] = useState("");
  const [isPromptVisible, setPromptVisible] = useState(false);

  const handleOpenPinPrompt = () => {
    if (!amount || !phoneNumber) {
      Alert.alert("Error", "Please fill all the required fields.");
      return;
    }
    setPromptVisible(true);
  };

  const handleConfirmPayment = async () => {
    setPromptVisible(false);
    Alert.alert("Processing", "Your payment is being processed...");

    try {
      const response = await api.post("/initiate-mpesa-payment", {
        amount: amount.replace(/,/g, ""),
        phone_number: phoneNumber,
        installment_schedule_id: payment.is_id.toString(),
        customer_number: user?.customerNumber,
        mpesa_pin: mpesaPin,
      });

      Alert.alert(
        "Payment Successful",
        "Thank you! Your payment has been completed."
      );
      navigation.goBack();
    } catch (err: any) {
      console.error(err);
      Alert.alert("Payment Error", "An error occurred during payment.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>M-Pesa Payment</Text>

      <Box>
        <FormControlLabel mb="$1">
          <FormControlLabelText>Plot Number</FormControlLabelText>
        </FormControlLabel>
        <Input variant="outline" size="md" isDisabled={true} isReadOnly={true}>
          <InputField value={property.plot_number} />
        </Input>
      </Box>

      <Box mt="$4">
        <FormControlLabel mb="$1">
          <FormControlLabelText>Amount (KES)</FormControlLabelText>
        </FormControlLabel>
        <Input variant="outline" size="md">
          <InputField
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </Input>
      </Box>

      <Box mt="$4">
        <FormControlLabel mb="$1">
          <FormControlLabelText>Phone Number</FormControlLabelText>
        </FormControlLabel>
        <Input variant="outline" size="md">
          <InputField
            placeholder="2547XXXXXXXX"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </Input>
      </Box>

      <Button onPress={handleOpenPinPrompt} bgColor={colors.black} mt="$4">
        <ButtonText>Lipa na M-PESA</ButtonText>
      </Button>

      {/* M-Pesa PIN Prompt Modal */}
      <Modal
        transparent={true}
        visible={isPromptVisible}
        animationType="slide"
        onRequestClose={() => setPromptVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Do you want to pay Ksh {amount} for {property.plot_number} to
              Optiven Limited?
            </Text>
            <Text style={styles.modalSubtitle}>Enter M-Pesa PIN:</Text>
            <TextInput
              style={styles.pinInput}
              placeholder="****"
              keyboardType="numeric"
              secureTextEntry={true}
              value={mpesaPin}
              onChangeText={setMpesaPin}
            />
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => setPromptVisible(false)}
                bgColor={colors.light}
                mr="$2"
              >
                <ButtonText style={styles.cancelText}>Cancel</ButtonText>
              </Button>
              <Button
                onPress={handleConfirmPayment}
                bgColor={colors.black}
                disabled={!mpesaPin || mpesaPin.length !== 4}
              >
                <ButtonText>Confirm</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default MpesaPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: colors.dark,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.dark,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.medium,
    marginBottom: 15,
  },
  pinInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelText: {
    color: colors.dark,
  },
});
