import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import colors from "../utils/colors";
import { Text } from "@gluestack-ui/themed";

type PaymentMethodScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PaymentMethod"
>;

const PaymentMethodScreen: React.FC<PaymentMethodScreenProps> = ({
  route,
  navigation,
}) => {
  const { payment, property } = route.params;

  const handleMpesaPayment = () => {
    navigation.navigate("MpesaPayment", { payment, property });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Method</Text>
      <TouchableOpacity style={styles.button} onPress={handleMpesaPayment}>
        <Image
          source={require("../../assets/app-images/mpesa-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
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
    alignItems: "center",
    backgroundColor: colors.dark,
    padding: 5,
    borderRadius: 8,
    marginVertical: 10,
  },
  logo: {
    width: 140,
    height: 50,
  },
});