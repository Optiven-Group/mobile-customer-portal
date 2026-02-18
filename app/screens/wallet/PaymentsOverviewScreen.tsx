import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  Button,
  ButtonText,
  Divider,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface PaymentRecord {
  id: string;
  property: string;
  project: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  status: "completed" | "pending" | "failed";
}

const MOCK_PAYMENTS: PaymentRecord[] = [
  { id: "P001", property: "Plot 45", project: "Amani Ridge", amount: 15000, date: "2024-04-20", method: "M-Pesa", reference: "QKL34F8XH2", status: "completed" },
  { id: "P002", property: "Plot 12", project: "Love Gardens", amount: 10000, date: "2024-04-10", method: "Bank Transfer", reference: "BANK-045", status: "completed" },
  { id: "P003", property: "Plot 12", project: "Love Gardens", amount: 10000, date: "2024-03-10", method: "M-Pesa", reference: "MPE-XYZ", status: "completed" },
  { id: "P004", property: "Plot 45", project: "Amani Ridge", amount: 15000, date: "2024-02-20", method: "Card", reference: "CRD-123", status: "completed" },
];

const PaymentsOverviewScreen = () => {
  const navigation = useNavigation<any>();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPayments(MOCK_PAYMENTS);
      setLoading(false);
    }, 800);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPayments(MOCK_PAYMENTS);
      setRefreshing(false);
    }, 1000);
  };

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  const renderPaymentItem = ({ item }: { item: PaymentRecord }) => (
    <TouchableOpacity>
      <HStack space="md" alignItems="center" py="$3" px="$4" borderBottomWidth={1} borderColor="$borderLight100">
        <Box bg="$success100" p="$2" borderRadius="$full">
          <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
        </Box>
        <VStack flex={1}>
          <Text bold size="sm">{item.project} - {item.property}</Text>
          <Text size="xs" color="$coolGray500">{item.method} • {item.reference}</Text>
        </VStack>
        <VStack alignItems="flex-end">
          <Text bold size="sm" color="$success700">KES {item.amount.toLocaleString()}</Text>
          <Text size="2xs" color="$coolGray400">{new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Text>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderPaymentItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            {/* Summary Cards */}
            <Box bg={colors.primary} px="$4" py="$6" borderBottomLeftRadius={30} borderBottomRightRadius={30}>
              <HStack justifyContent="space-around">
                <VStack alignItems="center">
                  <Text color="$white" opacity={0.8} size="xs">Total Paid</Text>
                  <Heading size="lg" color="$white">KES {totalPaid.toLocaleString()}</Heading>
                </VStack>
                <VStack alignItems="center">
                  <Text color="$white" opacity={0.8} size="xs">Outstanding</Text>
                  <Heading size="lg" color="$white">KES 450,000</Heading>
                </VStack>
              </HStack>
              <HStack justifyContent="center" mt="$4">
                <VStack alignItems="center">
                  <Text color="$white" opacity={0.8} size="xs">Next Due</Text>
                  <Text color="$white" bold>May 15, 2024</Text>
                </VStack>
              </HStack>
            </Box>

            {/* Make Payment Button */}
            <Box px="$4" mt="$4">
              <Button size="lg" bg={colors.secondary} borderRadius="$lg" onPress={() => navigation.navigate("Project Selection for Payment")}>
                <HStack space="sm" alignItems="center">
                  <MaterialCommunityIcons name="credit-card-plus" size={20} color="white" />
                  <ButtonText>Make a Payment</ButtonText>
                </HStack>
              </Button>
            </Box>

            {/* History Header */}
            <HStack px="$4" py="$3" mt="$2" justifyContent="space-between" alignItems="center">
              <Heading size="sm" color="$coolGray600">Payment History</Heading>
              <TouchableOpacity>
                <Text size="xs" color={colors.primary} bold>Download Statement</Text>
              </TouchableOpacity>
            </HStack>
          </>
        }
        ListEmptyComponent={
          <Box py="$10" alignItems="center">
            <MaterialCommunityIcons name="cash-remove" size={48} color={colors.coolGray} />
            <Text mt="$2" color="$coolGray500">No payment history.</Text>
          </Box>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </Screen>
  );
};

export default PaymentsOverviewScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
