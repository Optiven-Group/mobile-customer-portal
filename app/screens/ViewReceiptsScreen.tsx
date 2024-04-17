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
import colors from "../utils/colors";

// Assume this type represents the structure of your receipt data
interface Receipt {
  id: number;
  date: string;
  receiptNumber: string;
  projectName: string;
  plotNumber: string;
  amount: number;
}

// Sample data to simulate fetching receipts
const sampleReceipts: Receipt[] = [
  {
    id: 1,
    date: "Feb 19, 2024",
    receiptNumber: "REC017477",
    projectName: "Success Gardens (Phase 2)",
    plotNumber: "SP95",
    amount: 1405150.0,
  },
  {
    id: 2,
    date: "Mar 15, 2024",
    receiptNumber: "REC018232",
    projectName: "Dream Villa Estates",
    plotNumber: "DV45",
    amount: 950000.0,
  },
  {
    id: 3,
    date: "Apr 5, 2024",
    receiptNumber: "REC019006",
    projectName: "Lakeview Heights",
    plotNumber: "LV12",
    amount: 2100000.0,
  },
  {
    id: 4,
    date: "May 20, 2024",
    receiptNumber: "REC020145",
    projectName: "Sunset Gardens",
    plotNumber: "SG32",
    amount: 1789000.0,
  },
  {
    id: 5,
    date: "Jun 8, 2024",
    receiptNumber: "REC021009",
    projectName: "Pinecrest Residences",
    plotNumber: "PR27",
    amount: 1350000.0,
  },
  {
    id: 6,
    date: "Jul 14, 2024",
    receiptNumber: "REC021745",
    projectName: "Oceanview Apartments",
    plotNumber: "OA18",
    amount: 1925000.0,
  },
  {
    id: 7,
    date: "Aug 9, 2024",
    receiptNumber: "REC022512",
    projectName: "Golden Meadows",
    plotNumber: "GM73",
    amount: 1258000.0,
  },
  {
    id: 8,
    date: "Sep 3, 2024",
    receiptNumber: "REC023389",
    projectName: "Silver Springs",
    plotNumber: "SS56",
    amount: 1850000.0,
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
        data={receipts.sort((a: any, b: any) => b.id - a.id)}
        renderItem={({ item }) => (
          <ReceiptItem
            receipt={item}
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
    borderBottomColor: colors.light,
    backgroundColor: colors.white,
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
