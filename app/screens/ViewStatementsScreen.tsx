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
    date: "20 January 2024",
    type: "Deposit",
    amount: 500000.0,
    time: "07:58 AM",
    details: "Deposit for plot SP5",
  },
  {
    id: "2",
    date: "10 February 2024",
    type: "Installment",
    amount: 100000.0,
    time: "07:08 PM",
    details: "First installment towards payment of plot SP5",
  },
  {
    id: "3",
    date: "15 February 2024",
    type: "Installment",
    amount: 100000.0,
    time: "02:34 PM",
    details: "Second installment towards payment of plot SP5",
  },
  {
    id: "4",
    date: "25 February 2024",
    type: "Installment",
    amount: 100000.0,
    time: "11:49 AM",
    details: "Third installment towards payment of plot SP5",
  },
  {
    id: "5",
    date: "05 March 2024",
    type: "Installment",
    amount: 100000.0,
    time: "08:15 AM",
    details: "Final installment towards payment of plot SP5",
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
        {formatCurrency(item.amount)}
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
        data={transactions}
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
  },
  transactiontype: {
    justifyContent: "space-between",
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
});
