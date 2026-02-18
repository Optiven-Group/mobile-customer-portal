import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
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

const { width } = Dimensions.get("window");
type CategoryFilter = "All" | "Cashback" | "Discounts" | "Gifts" | "Services";

interface Reward {
  id: number;
  name: string;
  description: string;
  pointsRequired: number;
  category: string;
  tierRequired: string;
  available: boolean;
  image: string;
}

const MOCK_REWARDS: Reward[] = [
  { id: 1, name: "KES 5,000 Cashback", description: "Applied to your next installment", pointsRequired: 1000, category: "Cashback", tierRequired: "Bronze", available: true, image: "" },
  { id: 2, name: "10% Plot Discount", description: "On any available Love Gardens plot", pointsRequired: 3000, category: "Discounts", tierRequired: "Silver", available: true, image: "" },
  { id: 3, name: "Free Title Transfer", description: "Complimentary title deed processing", pointsRequired: 5000, category: "Services", tierRequired: "Gold", available: true, image: "" },
  { id: 4, name: "Optiven Gift Hamper", description: "Branded merchandise and gifts", pointsRequired: 500, category: "Gifts", tierRequired: "Bronze", available: true, image: "" },
  { id: 5, name: "KES 15,000 Cashback", description: "Applied to your wallet balance", pointsRequired: 2500, category: "Cashback", tierRequired: "Silver", available: true, image: "" },
  { id: 6, name: "VIP Site Visit", description: "Private transport and guided tour", pointsRequired: 2000, category: "Services", tierRequired: "Silver", available: false, image: "" },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Cashback": return "cash-refund";
    case "Discounts": return "tag-text";
    case "Gifts": return "gift";
    case "Services": return "room-service";
    default: return "star";
  }
};

const RewardsCatalogScreen = () => {
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  const filteredRewards = MOCK_REWARDS.filter((r) => {
    if (activeCategory === "All") return true;
    return r.category === activeCategory;
  });

  const CardWidth = (width - 48) / 2;

  const renderItem = ({ item }: { item: Reward }) => (
    <TouchableOpacity style={{ width: CardWidth, marginBottom: 12 }} onPress={() => navigation.navigate("RewardDetail", { reward: item })}>
      <Card variant="elevated" p="$0" borderRadius={14} overflow="hidden" h={180}>
        <Box bg={colors.primary + "10"} h={70} alignItems="center" justifyContent="center">
          <MaterialCommunityIcons name={getCategoryIcon(item.category) as any} size={32} color={colors.primary} />
        </Box>
        <VStack p="$3" flex={1} justifyContent="space-between">
          <VStack>
            <Text bold size="xs" numberOfLines={1}>{item.name}</Text>
            <Text size="2xs" color="$coolGray500" numberOfLines={1}>{item.description}</Text>
          </VStack>
          <HStack justifyContent="space-between" alignItems="center" mt="$1">
            <Text bold size="xs" color={colors.primary}>{item.pointsRequired} pts</Text>
            <Box bg={item.available ? colors.success + "18" : colors.coolGray + "25"} px="$1.5" borderRadius="$sm">
              <Text size="2xs" color={item.available ? colors.success : colors.coolGray}>
                {item.available ? "Available" : "Locked"}
              </Text>
            </Box>
          </HStack>
        </VStack>
      </Card>
    </TouchableOpacity>
  );

  const CategoryChip = ({ label }: { label: CategoryFilter }) => (
    <TouchableOpacity
      onPress={() => setActiveCategory(label)}
      style={[styles.chip, activeCategory === label && styles.chipActive]}
    >
      <Text size="xs" bold color={activeCategory === label ? "$white" : "$coolGray600"}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.container}>
      <FlatList
        data={filteredRewards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListHeaderComponent={
          <Box mb="$3">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={(["All", "Cashback", "Discounts", "Gifts", "Services"] as CategoryFilter[])}
              keyExtractor={(item) => item}
              renderItem={({ item }) => <CategoryChip label={item} />}
              contentContainerStyle={{ gap: 8, marginBottom: 8 }}
            />
          </Box>
        }
        ListEmptyComponent={
          <Box py="$10" alignItems="center">
            <MaterialCommunityIcons name="gift-off" size={48} color={colors.coolGray} />
            <Text mt="$2" color="$coolGray500">No rewards in this category.</Text>
          </Box>
        }
      />
    </Screen>
  );
};

export default RewardsCatalogScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  chip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: "#E5E7EB" },
  chipActive: { backgroundColor: colors.primary },
});
