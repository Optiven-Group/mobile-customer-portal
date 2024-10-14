import React, { useState } from "react";
import { ScrollView, StyleSheet, Alert } from "react-native";
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

  const [amount, setAmount] = useState(payment.installment_amount || "");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePayment = async () => {
    if (!amount) {
      Alert.alert("Error", "Please enter an amount.");
      return;
    }

    if (!phoneNumber) {
      Alert.alert("Error", "Please enter your phone number.");
      return;
    }

    try {
      // Send request to initiate M-Pesa payment
      const response = await api.post("/initiate-mpesa-payment", {
        amount: amount.replace(/,/g, ""),
        phone_number: phoneNumber,
        installment_schedule_id: payment.is_id.toString(),
        customer_number: user?.customerNumber,
      });

      Alert.alert(
        "Payment Initiated",
        "Please check your phone to complete the payment."
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
        <Input
          variant="outline"
          size="md"
          isDisabled={true}
          isInvalid={false}
          isReadOnly={true}
        >
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

      <Button onPress={handlePayment} bgColor={colors.black} mt="$4">
        <ButtonText>Pay with M-Pesa</ButtonText>
      </Button>
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
});
