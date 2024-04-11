import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import { formatCurrency } from "../utils/formatCurrency";
import {
  HStack,
  VStack,
  Text,
  Button,
  ButtonIcon,
  DownloadIcon,
  View,
} from "@gluestack-ui/themed";

// Assume this type represents the structure of your receipt data
interface Receipt {
  date: string;
  receiptNumber: string;
  projectName: string;
  plotNumber: string;
  amount: number;
}

// Sample data to simulate fetching receipts
const sampleReceipts: Receipt[] = [
  {
    date: "Feb 19, 2024",
    receiptNumber: "REC017477",
    projectName: "Success Gardens (Phase 2)",
    plotNumber: "SP95",
    amount: 1405150.0,
  },
];

const ReceiptItem = ({ receipt }: { receipt: Receipt }) => (
  <View style={styles.receiptItem}>
    <HStack style={styles.receiptHeader}>
      <Text style={styles.receiptNumber}>
        Receipt No: {receipt.receiptNumber}
      </Text>
      <Text>{receipt.date}</Text>
    </HStack>
    <HStack justifyContent="space-between" alignItems="center">
      <VStack>
        <Text>Project: {receipt.projectName}</Text>
        <Text>Plot No: {receipt.plotNumber}</Text>
        <Text style={styles.amount}>
          {formatCurrency(receipt.amount, "KES", "en-KE")}
        </Text>
      </VStack>
      <Button
        size="xs"
        variant="solid"
        action="primary"
        onPress={() =>
          console.log(`Downloaded receipt ${receipt.receiptNumber}`)
        }
      >
        <ButtonIcon as={DownloadIcon} />
      </Button>
    </HStack>
  </View>
);

const ViewReceiptsScreen = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    // Replace with your actual data fetching method
    setReceipts(sampleReceipts);
  }, []);

  const handlePressReceipt = (receipt: Receipt) => {
    console.log("Receipt pressed", receipt);
  };

  return (
    <Screen>
      <FlatList
        data={receipts}
        renderItem={({ item }) => (
          <ReceiptItem
            receipt={item}
            onPress={() => handlePressReceipt(item)}
          />
        )}
        keyExtractor={(item) => item.receiptNumber}
      />
    </Screen>
  );
};

export default ViewReceiptsScreen;

const styles = StyleSheet.create({
  receiptItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
  },
  receiptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  receiptNumber: {
    fontWeight: "bold",
  },
  amount: {
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 16,
    color: "green",
  },
});
