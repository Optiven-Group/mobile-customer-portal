import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Screen from "../components/Screen";
import colors from "../utils/colors";
import { Text } from "@gluestack-ui/themed";

interface Transaction {
  id: string;
  date: string;
  entity: string;
  amount: number;
  time: string;
  description: string;
}

// Dummy data for the list
const transactions: Transaction[] = [
  {
    id: "t1",
    date: "20 March 2024",
    entity: "Optiven Limited",
    amount: -250000.0,
    time: "07:58 AM",
    description: "Installment",
  },
  {
    id: "t2",
    date: "20 February 2024",
    entity: "Optiven Limited",
    amount: -250000.0,
    time: "07:08 PM",
    description: "Installment",
  },
];

const ViewStatement: React.FC = () => {
  const renderTransaction = ({ item }: { item: Transaction }) => {
    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => console.log("Navigate to detail screen", item)}
      >
        <View style={styles.transactionDetails}>
          <Text bold>{item.entity}</Text>
          <Text size="sm">{item.date}</Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text color="tomato">{item.amount}</Text>
          <Text size="sm" color={colors.medium}>
            {item.time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
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
  transactionDetails: {
    justifyContent: "space-between",
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
});
