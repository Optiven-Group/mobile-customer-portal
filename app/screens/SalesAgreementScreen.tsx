import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ProgressBarAndroid,
  Button,
  Alert,
} from "react-native";
import Screen from "../components/Screen";

const SalesAgreementScreen = () => {
  // Dummy data
  const plotPrice = 7900000; // Plot price in Kenyan Shillings
  const amountPaid = 5750000; // Amount paid by the user
  const progress = amountPaid / plotPrice;
  const isPaymentComplete = progress >= 1;

  const handleViewAgreement = () => {
    if (isPaymentComplete) {
      Alert.alert("Sales Agreement", "You can now view your Sales Agreement.");
    } else {
      Alert.alert(
        "Payment Incomplete",
        "Complete the payment to unlock the Sales Agreement."
      );
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.heading}>Sales Agreement for JL5</Text>
        <Text style={styles.subheading}>
          Plot Price: KES {plotPrice.toLocaleString()}
        </Text>
        <Text style={styles.subheading}>
          Amount Paid: KES {amountPaid.toLocaleString()}
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Payment Progress</Text>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={progress}
          color="#00b894"
          style={styles.progressBar}
        />
        <Text style={styles.progressText}>
          {(progress * 100).toFixed(2)}% Completed
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={
            isPaymentComplete
              ? "View Sales Agreement"
              : "Complete Payment to View Sales Agreement"
          }
          onPress={handleViewAgreement}
          disabled={!isPaymentComplete}
          color={isPaymentComplete ? "#00b894" : "#b2bec3"}
        />
      </View>
    </Screen>
  );
};

export default SalesAgreementScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    borderRadius: 20,
  },
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  infoContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    color: "#636e72",
    marginBottom: 5,
  },
  chartContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 15,
  },
  progressBar: {
    height: 20,
    borderRadius: 10,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0984e3",
    textAlign: "center",
  },
});
