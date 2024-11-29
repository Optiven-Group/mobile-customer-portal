import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Text } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import api from "../../utils/api";
import colors from "../../utils/colors";
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

  const [phoneNumber, setPhoneNumber] = useState<string>(
    __DEV__ ? "254708374149" : ""
  );
  const [customerNumber] = useState<string>(user?.customerNumber || "");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentInitiated, setPaymentInitiated] = useState<boolean>(false);

  const MaxTransactionAmount = 150000; // M-PESA maximum per transaction
  const MinTransactionAmount = 1; // M-PESA minimum per transaction

  const handleInitiatePayment = async () => {
    const phoneRegex = /^2547\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert(
        "Error",
        "Please enter a valid phone number starting with 2547 and 12 digits long"
      );
      return;
    }

    // Remove commas and parse the amount
    const parsedAmount = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (parsedAmount < MinTransactionAmount) {
      Alert.alert(
        "Error",
        `Amount must be at least KES ${MinTransactionAmount}`
      );
      return;
    }

    if (parsedAmount > MaxTransactionAmount) {
      Alert.alert(
        "Error",
        `Amount exceeds M-PESA maximum transaction limit of KES ${MaxTransactionAmount}`
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/initiate-mpesa-payment", {
        amount: parsedAmount.toString(),
        phone_number: phoneNumber,
        installment_schedule_id: payment.is_id.toString(),
        customer_number: customerNumber,
        plot_number: property.plot_number,
      });

      Alert.alert("Payment Initiated", response.data.CustomerMessage);
      setPaymentInitiated(true);
    } catch (error: any) {
      console.error("Failed to initiate M-PESA payment", error);
      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data?.error || "Failed to initiate payment"
        );
      } else {
        Alert.alert(
          "Error",
          "Network error. Please check your internet connection and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>M-PESA Payment</Text>

      <Text style={styles.label}>Plot Number:</Text>
      <Text style={styles.value}>{property.plot_number}</Text>

      <Text style={styles.label}>Amount to Pay:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount to pay"
      />

      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter your phone number"
      />

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleInitiatePayment}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      )}

      {paymentInitiated && (
        <Text style={styles.infoText}>
          Please check your phone to complete the M-PESA payment.
        </Text>
      )}
    </ScrollView>
  );
};

export default MpesaPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.white,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: colors.dark,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.dark,
  },
  value: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.medium,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    color: colors.dark,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
  },
});
