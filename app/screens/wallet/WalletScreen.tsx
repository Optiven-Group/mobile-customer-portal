import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Dimensions,
  Image,
  View,
} from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { useAuth } from "../../context/AuthContext";
import { Transaction } from "../../navigation/types";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Divider,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = CARD_WIDTH * 0.6;

// Mock transactions
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "TXN001", type: "credit", description: "Deposit via M-Pesa", amount: 50000, date: "2024-04-20T10:30:00Z", status: "completed", reference: "QKL34F8XH2" },
  { id: "TXN002", type: "debit", description: "Installment - Plot 45 Amani Ridge", amount: 15000, date: "2024-04-18T14:15:00Z", status: "completed", reference: "PAY-2024-003" },
  { id: "TXN003", type: "credit", description: "Referral Commission", amount: 5000, date: "2024-04-15T09:00:00Z", status: "completed", reference: "REF-COM-012" },
  { id: "TXN004", type: "debit", description: "Installment - Plot 12 Love Gardens", amount: 10000, date: "2024-04-10T11:20:00Z", status: "pending", reference: "PAY-2024-002" },
  { id: "TXN005", type: "credit", description: "Deposit via Bank Transfer", amount: 100000, date: "2024-04-05T16:45:00Z", status: "completed", reference: "BANK-TRF-045" },
];

type FilterTab = "All" | "Credits" | "Debits";

const WalletScreen = () => {
  const { user } = useAuth();
  const [balance] = useState(45000);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  useEffect(() => {
    setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setLoading(false);
    }, 800);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setRefreshing(false);
    }, 1000);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (activeTab === "Credits") return t.type === "credit";
    if (activeTab === "Debits") return t.type === "debit";
    return true;
  });

  const userName = user?.name || "Customer";
  const customerNo = user?.customerNumber || "OPT-2024-0001";

  const formatBalance = (amount: number): string => {
    return amount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // ─── ATM Card Component ──────────────────────────────
  const ATMCard = () => (
    <View style={styles.cardShadow}>
      <LinearGradient
        colors={["#1a472a", "#2d5016", "#5c4827", "#3d2b1f"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.atmCard}
      >
        {/* Decorative circuit lines */}
        <View style={styles.circuitLine1} />
        <View style={styles.circuitLine2} />
        <View style={styles.circuitLine3} />

        {/* Top row: Chip + Contactless */}
        <HStack justifyContent="space-between" alignItems="flex-start" zIndex={2}>
          <VStack>
            <Text style={styles.cardLabel}>OPTIVEN</Text>
            <Text style={styles.cardSubLabel}>CUSTOMER WALLET</Text>
          </VStack>
          <HStack space="sm" alignItems="center">
            {/* EMV Chip */}
            <View style={styles.chipContainer}>
              <LinearGradient
                colors={["#d4a843", "#c49a2c", "#e8c558", "#b88b24"]}
                style={styles.chip}
              >
                <View style={styles.chipLine1} />
                <View style={styles.chipLine2} />
                <View style={styles.chipLine3} />
              </LinearGradient>
            </View>
            {/* Contactless icon */}
            <MaterialCommunityIcons name="contactless-payment" size={22} color="rgba(255,255,255,0.5)" />
          </HStack>
        </HStack>

        {/* Balance */}
        <VStack mt="$3" zIndex={2}>
          <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
          <HStack alignItems="baseline" space="xs">
            <Text style={styles.currencySymbol}>KES</Text>
            <Text style={styles.balanceAmount}>{formatBalance(balance)}</Text>
          </HStack>
        </VStack>

        {/* Customer Info Row */}
        <HStack justifyContent="space-between" alignItems="flex-end" mt="$3" zIndex={2}>
          <VStack>
            <Text style={styles.infoLabel}>CARD HOLDER</Text>
            <Text style={styles.infoValue}>{userName.toUpperCase()}</Text>
          </VStack>
          <VStack alignItems="flex-end">
            <Text style={styles.infoLabel}>CUSTOMER NO.</Text>
            <Text style={styles.infoValue}>{customerNo}</Text>
          </VStack>
        </HStack>

        {/* Bottom row: Valid date + Optiven Logo */}
        <HStack justifyContent="space-between" alignItems="flex-end" mt="$2" zIndex={2}>
          <VStack>
            <Text style={styles.infoLabel}>MEMBER SINCE</Text>
            <Text style={styles.dateValue}>01/24</Text>
          </VStack>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.cardLogo}
            resizeMode="contain"
          />
        </HStack>
      </LinearGradient>
    </View>
  );

  // ─── Tab Button ──────────────────────────────────────
  const TabButton = ({ label, active }: { label: FilterTab; active: boolean }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(label)}
      style={[styles.tabBtn, active && styles.tabBtnActive]}
    >
      <Text size="sm" bold color={active ? "$white" : "$coolGray600"}>{label}</Text>
    </TouchableOpacity>
  );

  // ─── Transaction Item ────────────────────────────────
  const TransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity activeOpacity={0.7}>
      <HStack space="md" alignItems="center" py="$3" px="$4" borderBottomWidth={1} borderColor="$borderLight100">
        <Box bg={item.type === "credit" ? "#E8F5E9" : "#FFEBEE"} p="$2.5" borderRadius="$full">
          <MaterialCommunityIcons
            name={item.type === "credit" ? "arrow-down" : "arrow-up"}
            size={18}
            color={item.type === "credit" ? colors.success : colors.danger}
          />
        </Box>
        <VStack flex={1}>
          <Text bold size="sm" numberOfLines={1}>{item.description}</Text>
          <Text size="xs" color="$coolGray500">
            {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </Text>
        </VStack>
        <VStack alignItems="flex-end">
          <Text bold size="sm" color={item.type === "credit" ? "$success700" : "$error700"}>
            {item.type === "credit" ? "+" : "-"} KES {item.amount.toLocaleString()}
          </Text>
          <Box
            bg={item.status === "completed" ? "#E8F5E9" : item.status === "pending" ? "#FFF8E1" : "#FFEBEE"}
            px="$2"
            py="$0.5"
            borderRadius="$sm"
          >
            <Text
              size="2xs"
              bold
              color={item.status === "completed" ? "$success700" : item.status === "pending" ? "$warning700" : "$error700"}
            >
              {item.status}
            </Text>
          </Box>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );

  // ─── Payment Method Row ──────────────────────────────
  const PaymentMethod = ({ icon, name, iconColor, iconBg }: { icon: string; name: string; iconColor: string; iconBg: string }) => (
    <TouchableOpacity activeOpacity={0.7}>
      <HStack space="md" alignItems="center" py="$3.5" px="$4" borderBottomWidth={1} borderColor="$borderLight100">
        <Box bg={iconBg} p="$2.5" borderRadius={10}>
          <MaterialCommunityIcons name={icon as any} size={20} color={iconColor} />
        </Box>
        <Text flex={1} size="sm" bold>{name}</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.coolGray} />
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
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            {/* Wallet Title */}
            <Box px="$4" pt="$3" pb="$2">
              <Heading size="2xl">Wallet</Heading>
            </Box>

            {/* ATM Card */}
            <Box px="$4" pb="$4">
              <ATMCard />
            </Box>

            {/* Quick Actions */}
            <HStack px="$4" space="sm" mb="$4">
              <TouchableOpacity style={styles.actionBtn}>
                <Box bg={colors.primary + "15"} p="$2.5" borderRadius="$full" mb="$1">
                  <MaterialCommunityIcons name="plus" size={20} color={colors.primary} />
                </Box>
                <Text size="2xs" bold>Add funds</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Box bg="#FF980015" p="$2.5" borderRadius="$full" mb="$1">
                  <MaterialCommunityIcons name="bank-transfer-out" size={20} color="#FF9800" />
                </Box>
                <Text size="2xs" bold>Withdraw</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Box bg="#2196F315" p="$2.5" borderRadius="$full" mb="$1">
                  <MaterialCommunityIcons name="send" size={20} color="#2196F3" />
                </Box>
                <Text size="2xs" bold>Transfer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Box bg="#9C27B015" p="$2.5" borderRadius="$full" mb="$1">
                  <MaterialCommunityIcons name="history" size={20} color="#9C27B0" />
                </Box>
                <Text size="2xs" bold>Statement</Text>
              </TouchableOpacity>
            </HStack>

            {/* Payment methods section */}
            <Box px="$4" mb="$2">
              <Heading size="sm" color="$coolGray700">Payment methods</Heading>
            </Box>
            <Box mx="$4" bg="$white" borderRadius={14} overflow="hidden" mb="$4"
              shadowColor="#000" sx={{ shadowOpacity: 0.04, shadowRadius: 8 }}
            >
              <PaymentMethod icon="cellphone" name="M-Pesa — pay now" iconColor="#4CAF50" iconBg="#E8F5E9" />
              <PaymentMethod icon="bank" name="Bank Transfer" iconColor="#1976D2" iconBg="#E3F2FD" />
              <PaymentMethod icon="credit-card-plus-outline" name="Add payment method" iconColor={colors.primary} iconBg={colors.primary + "12"} />
            </Box>

            {/* Filter Tabs */}
            <HStack px="$4" py="$2" space="sm" justifyContent="center">
              {(["All", "Credits", "Debits"] as FilterTab[]).map((tab) => (
                <TabButton key={tab} label={tab} active={activeTab === tab} />
              ))}
            </HStack>

            {/* Section Title */}
            <HStack px="$4" justifyContent="space-between" alignItems="center" mt="$1" mb="$1">
              <Heading size="sm" color="$coolGray700">Transaction History</Heading>
              <TouchableOpacity>
                <Text size="xs" color={colors.primary} bold>Export</Text>
              </TouchableOpacity>
            </HStack>
          </>
        }
        ListEmptyComponent={
          <Box py="$10" alignItems="center">
            <MaterialCommunityIcons name="cash-remove" size={48} color={colors.coolGray} />
            <Text mt="$2" color="$coolGray500">No transactions found.</Text>
          </Box>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </Screen>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  // ─── ATM Card ────────────────────────────────────────
  cardShadow: {
    shadowColor: "#1a472a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  atmCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    padding: 22,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  // Decorative circuit lines for ATM feel
  circuitLine1: {
    position: "absolute",
    top: 30,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  circuitLine2: {
    position: "absolute",
    bottom: -60,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  circuitLine3: {
    position: "absolute",
    top: -20,
    left: 80,
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.03)",
  },

  // ─── EMV Chip ────────────────────────────────────────
  chipContainer: {
    width: 40,
    height: 30,
    borderRadius: 6,
    overflow: "hidden",
  },
  chip: {
    flex: 1,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  chipLine1: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    top: "33%",
  },
  chipLine2: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    top: "66%",
  },
  chipLine3: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.15)",
    left: "50%",
  },

  // ─── Card Typography ──────────────────────────────────
  cardLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 4,
  },
  cardSubLabel: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 8,
    fontWeight: "600",
    letterSpacing: 3,
    marginTop: 1,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 2,
  },
  currencySymbol: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    fontWeight: "300",
    letterSpacing: 2,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "200",
    letterSpacing: 3,
    fontVariant: ["tabular-nums"],
  },
  infoLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 7,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  infoValue: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    marginTop: 1,
  },
  dateValue: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 2,
    marginTop: 1,
  },
  cardLogo: {
    width: 60,
    height: 28,
    tintColor: "rgba(255,255,255,0.45)",
  },

  // ─── Quick Actions ────────────────────────────────────
  actionBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },

  // ─── Filter Tabs ──────────────────────────────────────
  tabBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
  },
});
