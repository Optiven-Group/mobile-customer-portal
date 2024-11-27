import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Screen from "../../app-components/Screen";
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
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const fetchReceipts = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
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
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const onRefresh = () => {
    fetchReceipts(true);
  };

  if (loading) {
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
        <Button onPress={() => fetchReceipts()} style={styles.retryButton}>
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
        renderItem={({ item }) => (
          <ReceiptItem receipt={item} leadFileNo={property.lead_file_no} />
        )}
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
  return format(parsedDate, "d MMMM yyyy");
};

const ReceiptItem = ({
  receipt,
  leadFileNo,
}: {
  receipt: Receipt;
  leadFileNo: string;
}) => {
  const handleDownloadReceipt = async () => {
    try {
      const uri = `${api.defaults.baseURL}/properties/${leadFileNo}/receipts/${receipt.id}/pdf`;
      const token = await AsyncStorage.getItem("accessToken");

      const downloadResumable = FileSystem.createDownloadResumable(
        uri,
        FileSystem.documentDirectory + `receipt_${receipt.receipt_no}.pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const downloadResult = await downloadResumable.downloadAsync();

      console.log("Download result:", downloadResult);

      if (downloadResult && downloadResult.status === 200) {
        const localUri = downloadResult.uri;
        console.log("Finished downloading to ", localUri);

        // Open the PDF
        if (localUri && (await FileSystem.getInfoAsync(localUri)).exists) {
          await Sharing.shareAsync(localUri);
        } else {
          alert("Could not find the downloaded file.");
        }
      } else {
        console.log("Download failed. Status:", downloadResult?.status);
        alert("Failed to download receipt. Please try again.");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download receipt. Please try again.");
    }
  };

  return (
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
          onPress={handleDownloadReceipt}
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
