import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
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
  ChevronDownIcon,
} from "@gluestack-ui/themed";

interface Property {
  code: string;
}

const MakePaymentScreen = () => {
  // Simulated property data (dummy data)
  const properties: Property[] = [
    { code: "VR77" },
    { code: "VR88" },
    { code: "VR99" },
  ];

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");

  useEffect(() => {
    // Autofill property if the user has only one property
    if (properties.length === 1) {
      setSelectedProperty(properties[0].code);
    }
  }, [properties]);

  const handlePayment = () => {
    if (amount === "") {
      Alert.alert("Error", "Please enter an amount.");
      return;
    }

    if (paymentMethod === "") {
      Alert.alert("Error", "Please select a payment method.");
      return;
    }

    if (selectedProperty === "") {
      Alert.alert("Error", "Please select a property.");
      return;
    }

    // Payment processing logic here (replace with real payment logic)
    Alert.alert(
      "Payment Successful",
      `You have paid ${amount} for property ${selectedProperty} using ${paymentMethod}.`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Make a Payment</Text>

      {/* Property Select */}
      {properties.length > 1 && (
        <>
          <Text style={styles.label}>Select Property</Text>
          <Select onValueChange={setSelectedProperty} mb="$4">
            <SelectTrigger variant="outline" size="md">
              <SelectInput placeholder="Select Property" />
              <SelectIcon mr="$3" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {properties.map((property) => (
                  <SelectItem
                    key={property.code}
                    label={property.code}
                    value={property.code}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </>
      )}

      {/* Amount Input */}
      <Text style={styles.label}>Enter Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="300,000"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Payment Method Select */}
      <Text style={styles.label}>Select Payment Method</Text>
      <Select onValueChange={setPaymentMethod} mb="$4">
        <SelectTrigger variant="outline" size="md">
          <SelectInput placeholder="Select Payment Method" />
          <SelectIcon mr="$3" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectItem label="Credit Card" value="credit-card" />
            <SelectItem label="Mobile Money" value="mobile-money" />
            <SelectItem label="MPESA" value="mpesa" />
          </SelectContent>
        </SelectPortal>
      </Select>

      {/* Pay Button */}
      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default MakePaymentScreen;
