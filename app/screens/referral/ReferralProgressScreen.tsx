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
import { useNavigation } from "@react-navigation/native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Referral {
  id: number;
  name: string;
  phone: string;
  date: string;
  status: "pending" | "contacted" | "site_visit" | "negotiation" | "converted" | "rejected";
  commission: number;
  project: string;
}

const MOCK_REFERRALS: Referral[] = [
  { id: 1, name: "John M.", phone: "0712***456", date: "2024-04-15", status: "converted", commission: 25000, project: "Amani Ridge" },
  { id: 2, name: "Grace W.", phone: "0722***789", date: "2024-04-10", status: "pending", commission: 15000, project: "Love Gardens" },
  { id: 3, name: "Peter K.", phone: "0733***012", date: "2024-04-05", status: "contacted", commission: 20000, project: "Amani Ridge" },
  { id: 4, name: "Mary N.", phone: "0700***345", date: "2024-03-28", status: "site_visit", commission: 30000, project: "Success Gardens" },
  { id: 5, name: "David O.", phone: "0711***678", date: "2024-03-20", status: "negotiation", commission: 18000, project: "Love Gardens" },
  { id: 6, name: "Sarah K.", phone: "0722***901", date: "2024-03-10", status: "rejected", commission: 0, project: "Amani Ridge" },
  { id: 7, name: "James M.", phone: "0733***234", date: "2024-02-25", status: "converted", commission: 22000, project: "Success Gardens" },
  { id: 8, name: "Lucy W.", phone: "0700***567", date: "2024-02-15", status: "converted", commission: 28000, project: "Amani Ridge" },
];

type StatusFilter = "All" | "Pending" | "Qualified" | "Converted" | "Rejected";

const getStatusColor = (status: string) => {
  switch (status) {
    case "converted": return colors.success;
    case "pending": return colors.warning;
    case "contacted": case "site_visit": case "negotiation": return colors.tertiary;
    case "rejected": return colors.danger;
    default: return colors.medium;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "site_visit": return "Site Visit";
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const matchesFilter = (status: string, filter: StatusFilter) => {
  if (filter === "All") return true;
  if (filter === "Pending") return status === "pending";
  if (filter === "Qualified") return ["contacted", "site_visit", "negotiation"].includes(status);
  if (filter === "Converted") return status === "converted";
  if (filter === "Rejected") return status === "rejected";
  return true;
};

const ReferralProgressScreen = () => {
  const navigation = useNavigation<any>();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");

  useEffect(() => {
    setTimeout(() => {
      setReferrals(MOCK_REFERRALS);
      setLoading(false);
    }, 800);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setReferrals(MOCK_REFERRALS);
      setRefreshing(false);
    }, 1000);
  };

  const filteredReferrals = referrals.filter((r) => matchesFilter(r.status, activeFilter));

  const FilterChip = ({ label, active }: { label: StatusFilter; active: boolean }) => (
    <TouchableOpacity
      onPress={() => setActiveFilter(label)}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text size="xs" bold color={active ? "$white" : "$coolGray600"}>{label}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Referral }) => (
    <TouchableOpacity onPress={() => navigation.navigate("ReferralDetail", { referral: item })}>
      <Card variant="elevated" p="$0" mb="$3" borderRadius={14} overflow="hidden">
        <HStack px="$4" py="$3" alignItems="center">
          <Box bg={getStatusColor(item.status) + "18"} p="$2.5" borderRadius="$full" mr="$3">
            <MaterialCommunityIcons name="account" size={20} color={getStatusColor(item.status)} />
          </Box>
          <VStack flex={1}>
            <Text bold size="sm">{item.name}</Text>
            <Text size="2xs" color="$coolGray500">{item.project} • {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Text>
          </VStack>
          <VStack alignItems="flex-end">
            {item.commission > 0 && (
              <Text size="xs" bold color={colors.primary}>KES {item.commission.toLocaleString()}</Text>
            )}
            <Box bg={getStatusColor(item.status) + "18"} px="$2" py="$0.5" borderRadius="$sm">
              <Text size="2xs" bold color={getStatusColor(item.status)}>{getStatusLabel(item.status)}</Text>
            </Box>
          </VStack>
        </HStack>
      </Card>
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
        data={filteredReferrals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListHeaderComponent={
          <Box mb="$3">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={(["All", "Pending", "Qualified", "Converted", "Rejected"] as StatusFilter[])}
              keyExtractor={(item) => item}
              renderItem={({ item }) => <FilterChip label={item} active={activeFilter === item} />}
              contentContainerStyle={{ gap: 8, marginBottom: 12 }}
            />
          </Box>
        }
        ListEmptyComponent={
          <Box py="$10" alignItems="center">
            <MaterialCommunityIcons name="account-search" size={48} color={colors.coolGray} />
            <Text mt="$2" color="$coolGray500">No referrals in this category.</Text>
          </Box>
        }
      />
    </Screen>
  );
};

export default ReferralProgressScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  chip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: "#E5E7EB" },
  chipActive: { backgroundColor: colors.primary },
});
