import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Screen from "../../components/Screen";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  HStack,
  VStack,
  Text,
  Button,
  ButtonIcon,
  DownloadIcon,
  View,
} from "@gluestack-ui/themed";
import colors from "../../utils/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OverviewStackParamList, Receipt } from "../../navigation/types";
import api from "../../utils/api";
import { parse, format } from "date-fns";

type ViewReceiptsScreenProps = NativeStackScreenProps<
  OverviewStackParamList,
  "View Receipts"
>;

const ViewReceiptsScreen = ({ route, navigation }: ViewReceiptsScreenProps) => {
  const { property } = route.params;

  if (!property) {
    return (
      <Screen style={styles.container}>
        <Text style={{ color: colors.danger, textAlign: "center" }}>
          No property selected.
        </Text>
      </Screen>
    );
  }

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchReceipts = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      const response = await api.get(
        `/properties/${property.lead_file_no}/receipts`
      );
      setReceipts(response.data.receipts);
      setError("");
    } catch (error: any) {
      setError("Failed to fetch receipts. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      if (refreshing) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReceipts();
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
        <Button onPress={fetchReceipts} style={styles.retryButton}>
          <Text style={{ color: colors.primary }}>Tap to Retry</Text>
        </Button>
      </Screen>
    );
  }

  if (!loading && receipts.length === 0) {
    return (
      <Screen style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No receipts found for this property.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <FlatList
        data={receipts.sort((a, b) => b.id - a.id)}
        renderItem={({ item }) => <ReceiptItem receipt={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </Screen>
  );
};

const formatDate = (dateString: string): string => {
  const parsedDate = parse(dateString, "MM/dd/yy", new Date());
  return format(parsedDate, "d MMMM yyyy"); // e.g., '27 July 2024'
};

const ReceiptItem = ({ receipt }: { receipt: Receipt }) => (
  <View style={styles.receiptItem}>
    <HStack justifyContent="space-between" style={styles.receiptHeader}>
      <VStack>
        <Text bold style={styles.receiptNumber}>
          {receipt.receipt_no}
        </Text>
        <Text style={styles.receiptDate}>
          {formatDate(receipt.date_posted)}
        </Text>
      </VStack>
      <Button
        size="sm"
        variant="solid"
        action="primary"
        borderRadius={"$full"}
        style={styles.downloadButton}
        onPress={() => console.log(`Downloaded receipt ${receipt.receipt_no}`)}
      >
        <ButtonIcon as={DownloadIcon} />
      </Button>
    </HStack>
    <VStack space="sm" style={styles.detailsSection}>
      <Text color={colors.success} size="2xl" bold>
        {formatCurrency(receipt.amount_lcy, "KES", "en-KE")}
      </Text>
    </VStack>
  </View>
);

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
  downloadButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
  },
  retryButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});
