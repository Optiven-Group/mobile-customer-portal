import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { format } from "date-fns";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { Text, Pressable } from "@gluestack-ui/themed";
import { formatCurrency } from "../../utils/formatCurrency";
import { NavigationProp } from "@react-navigation/native";
import api from "../../utils/api";

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  time: string;
}

interface ViewStatementsScreenProps {
  route: any;
  navigation: NavigationProp<any>;
}

const ViewStatementsScreen: React.FC<ViewStatementsScreenProps> = ({
  route,
}) => {
  const property = route?.params?.property;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchTransactions = async () => {
    if (!property) return;

    try {
      if (!refreshing) {
        setLoading(true);
      }
      const response = await api.get(
        `/properties/${property.lead_file_no}/transactions`
      );
      const fetchedTransactions: Transaction[] = response.data.transactions.map(
        (transaction: any) => ({
          id: transaction.id,
          date: format(new Date(transaction.date), "dd MMMM yyyy"),
          type: transaction.type,
          amount: transaction.amount,
          time: transaction.time,
        })
      );
      setTransactions(fetchedTransactions);
      setError("");
    } catch (error: any) {
      setError("Failed to fetch transactions. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      if (refreshing) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [property]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const handlePressTransaction = (item: Transaction) => {
    console.log("Navigate to detail screen", item);
    // Implement navigation to transaction detail screen if needed
  };

  if (loading && !refreshing) {
    return (
      <Screen style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen style={styles.container}>
        <Text style={{ color: colors.danger, textAlign: "center" }}>
          {error}
        </Text>
        <Pressable onPress={fetchTransactions} style={styles.retryButton}>
          <Text style={{ color: colors.primary }}>Tap to Retry</Text>
        </Pressable>
      </Screen>
    );
  }

  if (!property) {
    return (
      <Screen style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No property selected.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={transactions.sort((a, b) => b.id.localeCompare(a.id))}
        renderItem={({ item }) => (
          <TransactionItem item={item} onPress={handlePressTransaction} />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </Screen>
  );
};

const TransactionItem = ({
  item,
  onPress,
}: {
  item: Transaction;
  onPress: (item: Transaction) => void;
}) => (
  <Pressable style={styles.transactionItem} onPress={() => onPress(item)}>
    <View style={styles.transactionType}>
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
  </Pressable>
);

export default ViewStatementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.medium,
    backgroundColor: colors.white,
  },
  transactionType: {
    justifyContent: "space-between",
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  retryButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});
