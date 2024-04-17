import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Screen from "../components/Screen";
import colors from "../utils/colors";
import { Text } from "@gluestack-ui/themed";
import { formatCurrency } from "../utils/formatCurrency";

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  time: string;
  details: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    date: "10 February 2024",
    type: "Installment",
    amount: 100000.0,
    time: "07:08 PM",
    details: "First installment towards payment of plot SP5",
  },
  {
    id: "2",
    date: "15 February 2024",
    type: "Installment",
    amount: 100000.0,
    time: "02:34 PM",
    details: "Second installment towards payment of plot SP5",
  },
  {
    id: "3",
    date: "25 February 2024",
    type: "Installment",
    amount: 100000.0,
    time: "11:49 AM",
    details: "Third installment towards payment of plot SP5",
  },
  {
    id: "4",
    date: "05 March 2024",
    type: "Installment",
    amount: 100000.0,
    time: "08:15 AM",
    details: "Final installment towards payment of plot SP5",
  },
  {
    id: "5",
    date: "25 March 2024",
    type: "Installment",
    amount: 150000.0,
    time: "04:20 PM",
    details: "First installment towards payment of plot LV12",
  },
  {
    id: "6",
    date: "10 April 2024",
    type: "Installment",
    amount: 50000.0,
    time: "03:00 PM",
    details: "Second installment towards payment of plot DV45",
  },
  {
    id: "7",
    date: "20 April 2024",
    type: "Installment",
    amount: 200000.0,
    time: "12:00 PM",
    details: "First installment towards payment of plot SG32",
  },
  {
    id: "8",
    date: "05 May 2024",
    type: "Installment",
    amount: 80000.0,
    time: "09:30 AM",
    details: "Second installment towards payment of plot SG32",
  },
  {
    id: "9",
    date: "15 May 2024",
    type: "Installment",
    amount: 70000.0,
    time: "03:45 PM",
    details: "Third installment towards payment of plot SG32",
  },
  {
    id: "10",
    date: "25 May 2024",
    type: "Installment",
    amount: 90000.0,
    time: "11:00 AM",
    details: "Final installment towards payment of plot SG32",
  },
];

const TransactionItem = ({
  item,
  onPress,
}: {
  item: Transaction;
  onPress: (item: Transaction) => void;
}) => (
  <TouchableOpacity
    style={styles.transactionItem}
    onPress={() => onPress(item)}
  >
    <View style={styles.transactiontype}>
      <Text bold>{item.type}</Text>
      <Text size="sm">{item.date}</Text>
    </View>
    <View style={styles.transactionAmount}>
      <Text color={item.amount >= 0 ? "green" : "tomato"}>
        {formatCurrency(item.amount, "KES", "en-KE")}
      </Text>
      <Text size="sm" color={colors.medium}>
        {item.time}
      </Text>
    </View>
  </TouchableOpacity>
);

const ViewStatement: React.FC = () => {
  const handlePressTransaction = (item: Transaction) => {
    console.log("Navigate to detail screen", item);
  };

  return (
    <Screen>
      <FlatList
        data={transactions.sort((a: any, b: any) => b.id - a.id)}
        renderItem={({ item }) => (
          <TransactionItem item={item} onPress={handlePressTransaction} />
        )}
        keyExtractor={(item) => item.id}
      />
    </Screen>
  );
};

export default ViewStatement;

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.medium,
    backgroundColor: colors.white,
  },
  transactiontype: {
    justifyContent: "space-between",
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
});
