import React, { useState } from "react";
import { ScrollView, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { useStripe, CardField } from "@stripe/stripe-react-native";
import api from "../../utils/api";
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
import { useAuth } from "../../context/AuthContext";

type MakePaymentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "MakePayment"
>;

const MakePaymentScreen: React.FC<MakePaymentScreenProps> = ({
  route,
  navigation,
}) => {
  const { payment, property } = route.params;

  // Get user from AuthContext
  const { user } = useAuth();

  // Check if user, payment, and property are defined
  if (!user || !user.email) {
    Alert.alert("Error", "User is not logged in or email is missing.");
    navigation.goBack();
    return null;
  }

  if (!payment || !property) {
    Alert.alert("Error", "Payment or property information is missing.");
    navigation.goBack();
    return null;
  }

  const stripe = useStripe();

  const [amount, setAmount] = useState(payment.installment_amount || "");
  const [cardDetails, setCardDetails] = useState({ complete: false });

  const handlePayment = async () => {
    if (!amount) {
      Alert.alert("Error", "Please enter an amount.");
      return;
    }

    if (!cardDetails.complete) {
      Alert.alert("Error", "Please enter complete card details.");
      return;
    }

    try {
      // Convert amount to integer (in the smallest currency unit)
      const amountInt = parseInt(amount.replace(/,/g, ""), 10) * 100;

      // Create PaymentIntent on the backend
      const response = await api.post("/create-payment-intent", {
        amount: amountInt,
        currency: "kes",
        customer_email: user.email,
      });

      const { clientSecret } = response.data;

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment(
        clientSecret,
        {
          paymentMethodType: "Card",
          paymentMethodData: {
            billingDetails: {
              email: user.email,
            },
          },
        }
      );

      if (error) {
        Alert.alert("Payment Error", error.message || "An error occurred");
      } else if (paymentIntent) {
        Alert.alert("Payment Successful", "Your payment was successful.");
        // Optionally, update payment status or refresh data
        navigation.goBack();
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Payment Error", "An error occurred during payment.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Make a Payment</Text>

      {/* Property Information */}
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

      {/* Amount Input */}
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

      {/* Card Input Field */}
      <Box mt="$4">
        <FormControlLabel mb="$1">
          <FormControlLabelText>Card Details</FormControlLabelText>
        </FormControlLabel>
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: "4242 4242 4242 4242",
            expiration: "MM/YY",
            cvc: "CVC",
          }}
          cardStyle={{
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
          }}
          style={{
            width: "100%",
            height: 50,
            marginVertical: 10,
          }}
          onCardChange={(details) => {
            setCardDetails(details);
          }}
        />
      </Box>

      {/* Pay Button */}
      <Button onPress={handlePayment} bgColor={colors.black} mt="$4">
        <ButtonText>Pay Securely</ButtonText>
      </Button>
    </ScrollView>
  );
};

export default MakePaymentScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  propertyInfo: {
    fontSize: 18,
    marginBottom: 20,
    color: "#000",
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
