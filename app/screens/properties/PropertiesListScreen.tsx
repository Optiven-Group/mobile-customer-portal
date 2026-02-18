import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, View, TextInput, Dimensions, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { Box, VStack, HStack, Text, Heading, Image } from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../../utils/api";

const { width } = Dimensions.get("window");

const MOCK_PROPERTIES = [
  { id: 1, name: "Plot 45", project: "Amani Ridge", location: "Kiambu", size: "50x100", status: "Fully Paid", image: "", price: 3500000, balance: 0 },
  { id: 2, name: "Plot 12", project: "Love Gardens", location: "Kajiado", size: "50x100", status: "Installment", image: "", price: 1500000, balance: 450000 },
];

const PropertiesListScreen = () => {
  const navigation = useNavigation<any>();
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProperties = async () => {
    try {
      setTimeout(() => {
        setProperties(MOCK_PROPERTIES);
        setFilteredProperties(MOCK_PROPERTIES);
        setLoading(false);
        setRefreshing(false);
      }, 800);
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = properties.filter((p) =>
        p.project.toLowerCase().includes(text.toLowerCase()) ||
        p.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties);
    }
  };

  const getStatusConfig = (status: string) => {
    if (status === "Fully Paid") return { bg: "#E8F5E9", color: "#2E7D32", icon: "check-circle" };
    return { bg: "#FFF3E0", color: "#E65100", icon: "clock-outline" };
  };

  const getProgress = (item: any) => {
    if (item.price === 0) return 100;
    return Math.round(((item.price - item.balance) / item.price) * 100);
  };

  const renderItem = ({ item }: { item: any }) => {
    const statusConfig = getStatusConfig(item.status);
    const progress = getProgress(item);

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("PropertyDetail", { property: item })}
        style={styles.card}
      >
        {/* Color bar top */}
        <View style={[styles.cardAccent, { backgroundColor: statusConfig.color }]} />

        <View style={styles.cardContent}>
          <HStack justifyContent="space-between" alignItems="flex-start">
            <VStack flex={1}>
              <Heading size="sm" color="#1F2937">{item.project}</Heading>
              <Text size="xs" color="#6B7280" mt="$0.5">{item.name} • {item.location}</Text>
            </VStack>
            <View style={[styles.statusChip, { backgroundColor: statusConfig.bg }]}>
              <MaterialCommunityIcons name={statusConfig.icon as any} size={12} color={statusConfig.color} />
              <Text size="2xs" bold color={statusConfig.color} ml="$1">{item.status}</Text>
            </View>
          </HStack>

          {/* Progress bar */}
          <View style={styles.progressSection}>
            <HStack justifyContent="space-between" mb="$1">
              <Text size="2xs" color="#9CA3AF">Payment progress</Text>
              <Text size="2xs" bold color="#388E3C">{progress}%</Text>
            </HStack>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: statusConfig.color }]} />
            </View>
          </View>

          {/* Financial details */}
          <HStack mt="$3" justifyContent="space-between">
            <VStack>
              <Text size="2xs" color="#9CA3AF">Total Price</Text>
              <Text size="xs" bold color="#1F2937">KES {item.price.toLocaleString()}</Text>
            </VStack>
            <VStack alignItems="flex-end">
              <Text size="2xs" color="#9CA3AF">Balance</Text>
              <Text size="xs" bold color={item.balance > 0 ? "#E65100" : "#2E7D32"}>
                KES {item.balance.toLocaleString()}
              </Text>
            </VStack>
            <VStack alignItems="flex-end">
              <Text size="2xs" color="#9CA3AF">Size</Text>
              <Text size="xs" bold color="#1F2937">{item.size}</Text>
            </VStack>
          </HStack>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search my properties..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Stats summary */}
      <HStack px="$4" mb="$2" space="sm">
        <View style={styles.statChip}>
          <Text size="2xs" bold color="#388E3C">{properties.length}</Text>
          <Text size="2xs" color="#6B7280"> Properties</Text>
        </View>
        <View style={styles.statChip}>
          <Text size="2xs" bold color="#2E7D32">{properties.filter(p => p.status === "Fully Paid").length}</Text>
          <Text size="2xs" color="#6B7280"> Paid</Text>
        </View>
        <View style={styles.statChip}>
          <Text size="2xs" bold color="#E65100">{properties.filter(p => p.status !== "Fully Paid").length}</Text>
          <Text size="2xs" color="#6B7280"> Active</Text>
        </View>
      </HStack>

      <FlatList
        data={filteredProperties}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProperties(); }} colors={[colors.primary]} />}
        ListEmptyComponent={
          <Box py="$10" alignItems="center">
            <MaterialCommunityIcons name="home-off-outline" size={48} color="#D1D5DB" />
            <Text mt="$2" color="#9CA3AF">No properties found.</Text>
          </Box>
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
};

export default PropertiesListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FBF6" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#E8F5E9",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1F2937" },
  statChip: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardAccent: { height: 4, width: "100%" },
  cardContent: { padding: 16 },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressSection: { marginTop: 14 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F0F0F0",
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3 },
});
