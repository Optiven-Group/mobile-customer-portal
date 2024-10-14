import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import colors from "../utils/colors";

type PaymentMethodScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PaymentMethod"
>;

const PaymentMethodScreen: React.FC<PaymentMethodScreenProps> = ({
  route,
  navigation,
}) => {
  const { payment, property } = route.params;

  const handleBankPayment = () => {
    navigation.navigate("StripePayment", { payment, property });
  };

  const handleMpesaPayment = () => {
    navigation.navigate("MpesaPayment", { payment, property });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Method</Text>
      <TouchableOpacity style={styles.button} onPress={handleBankPayment}>
        <Text style={styles.buttonText}>Bank</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleMpesaPayment}>
        <Text style={styles.buttonText}>M-Pesa</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: colors.dark,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
  },
});
