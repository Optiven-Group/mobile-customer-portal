import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import api from "../../utils/api";
import colors from "../../utils/colors";
import { useAuth } from "../../context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [customerNumber] = useState<string>(user?.customerNumber || "");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentInitiated, setPaymentInitiated] = useState<boolean>(false);

  const MaxTransactionAmount = 150000; // M-PESA maximum per transaction
  const MinTransactionAmount = 1; // M-PESA minimum per transaction

  const handleInitiatePayment = async () => {
    // Trim spaces and remove any non-digit characters
    const sanitizedPhoneNumber = phoneNumber.trim().replace(/\D/g, "");

    // Check if phone number starts with '07' and prompt to use '2547'
    if (sanitizedPhoneNumber.startsWith("07")) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter your phone number starting with '2547' instead of '07'. For example, use '254712345678'."
      );
      return;
    }

    const phoneRegex = /^2547\d{8}$/;
    if (!phoneRegex.test(sanitizedPhoneNumber)) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid phone number starting with '2547' and exactly 12 digits long. For example, '254712345678'."
      );
      return;
    }

    // Remove commas and parse the amount
    const parsedAmount = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    if (parsedAmount < MinTransactionAmount) {
      Alert.alert(
        "Amount Too Low",
        `The amount must be at least KES ${MinTransactionAmount}.`
      );
      return;
    }

    if (parsedAmount > MaxTransactionAmount) {
      Alert.alert(
        "Amount Exceeds Limit",
        `The amount exceeds the M-PESA maximum transaction limit of KES ${MaxTransactionAmount}.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/initiate-mpesa-payment", {
        amount: parsedAmount.toString(),
        phone_number: sanitizedPhoneNumber,
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
          "Payment Error",
          error.response.data?.error || "Failed to initiate payment."
        );
      } else {
        Alert.alert(
          "Network Error",
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
    >
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
          placeholder="e.g., 150000"
          placeholderTextColor={colors.medium}
          maxLength={10} // Assuming max amount is less than 10 digits
        />

        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="e.g., 254712345678"
          placeholderTextColor={colors.medium}
          maxLength={12} // Ensures the phone number does not exceed 12 digits
        />

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleInitiatePayment}
          >
            <MaterialCommunityIcons
              name="cash-multiple"
              size={24}
              color={colors.white}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Pay Now</Text>
          </TouchableOpacity>
        )}

        {paymentInitiated && (
          <Text style={styles.infoText}>
            Please check your phone to complete the M-PESA payment.
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MpesaPaymentScreen;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.white,
    justifyContent: "flex-start", // Align items to the top
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    color: colors.dark,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.dark,
    fontWeight: "600",
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
    padding: 12,
    marginBottom: 20,
    color: colors.dark,
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Adds shadow for better depth
  },
  buttonIcon: {
    marginRight: 10,
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
