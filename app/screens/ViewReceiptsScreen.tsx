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
    <HStack justifyContent="space-between" style={styles.receiptHeader}>
      <VStack>
        <Text bold style={styles.receiptNumber}>
          Receipt No: {receipt.receiptNumber}
        </Text>
        <Text style={styles.receiptDate}>{receipt.date}</Text>
      </VStack>
      <Button
        size="sm"
        variant="solid"
        action="primary"
        borderRadius={"$full"}
        style={styles.downloadButton}
        onPress={() =>
          console.log(`Downloaded receipt ${receipt.receiptNumber}`)
        }
      >
        <ButtonIcon as={DownloadIcon} />
      </Button>
    </HStack>

    <VStack space="sm" style={styles.detailsSection}>
      <HStack>
        <Text bold>Project: </Text>
        <Text>{receipt.projectName}</Text>
      </HStack>
      <HStack>
        <Text bold>Plot No: </Text>
        <Text>{receipt.plotNumber}</Text>
      </HStack>
      <Text style={styles.amount}>
        {formatCurrency(receipt.amount, "KES", "en-KE")}
      </Text>
    </VStack>
  </View>
);

const ViewReceiptsScreen = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    setReceipts(sampleReceipts);
  }, []);

  return (
    <Screen style={styles.container}>
      <FlatList
        data={receipts.sort((a: any, b: any) => b.id - a.id)}
        renderItem={({ item }) => <ReceiptItem receipt={item} />}
        keyExtractor={(item) => item.receiptNumber}
      />
    </Screen>
  );
};

export default ViewReceiptsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  receiptItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  receiptHeader: {
    marginBottom: 8,
    alignItems: "center",
  },
  receiptNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.dark,
  },
  receiptDate: {
    fontSize: 12,
    color: colors.medium,
    marginTop: 4,
  },
  detailsSection: {
    marginTop: 4,
  },
  amount: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.success,
  },
  downloadButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
});
