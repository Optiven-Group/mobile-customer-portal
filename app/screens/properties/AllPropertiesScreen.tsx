import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  TextInput,
  RefreshControl,
} from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import api from "../../utils/api";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface Project {
  project_id: number;
  name: string;
  description?: string;
  banner?: string;
  location?: string;
}

const MOCK_PROJECTS: Project[] = [
  { project_id: 1, name: "Amani Ridge — The Place of Peace", description: "Prime plots in Kiambu County, 40 minutes from Nairobi CBD. Available in 1/8 and 1/4 acre sizes.", banner: "https://optiven.co.ke/wp-content/uploads/2023/06/Amani-Ridge.jpg", location: "Kiambu, Kenya" },
  { project_id: 2, name: "Love Gardens — Machakos", description: "Plots in Machakos with beautiful views of the surrounding hills. Great for residential and investment.", banner: "https://www.optiven.co.ke/wp-content/uploads/2023/01/Love-Gardens-Kajiado.jpg", location: "Machakos, Kenya" },
  { project_id: 3, name: "Success Gardens — Gatanga", description: "Affordable plots in Gatanga, Murang'a County. Ideal for farming and rural homes.", banner: "https://optiven.co.ke/wp-content/uploads/2022/10/Success-Gardens-Gatanga-Road-Phase-2.webp", location: "Gatanga, Murang'a" },
  { project_id: 4, name: "Joy Lovers — Konza", description: "Strategic plots near the Konza Technopolis. A great investment opportunity.", banner: "https://www.optiven.co.ke/wp-content/uploads/2023/11/Joy-Lovers-Club-Konza.jpg", location: "Konza, Machakos" },
  { project_id: 5, name: "Victory Gardens — Kitengela", description: "Fast-developing area with excellent infrastructure and proximity to Nairobi.", banner: "https://www.optiven.co.ke/wp-content/uploads/2020/01/Phase-4-1.jpg", location: "Kitengela, Kajiado" },
  { project_id: 6, name: "Wema Gardens — Nanyuki", description: "Cool-climate plots with stunning views of Mount Kenya. Perfect for holiday homes.", banner: "https://www.optiven.co.ke/wp-content/uploads/2022/11/Wema-Gardens.webp", location: "Nanyuki, Laikipia" },
];

const PROJECT_COLORS = ["#388E3C", "#1B5E20", "#2E7D32", "#4CAF50", "#0D47A1", "#5A0000"];

const AllPropertiesScreen = () => {
  const navigation = useNavigation<any>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchProjects = async () => {
    try {
      const response = await api.get("/visible-projects");
      const all = [
        ...(response.data.featured_projects || []),
        ...(response.data.other_projects || []),
      ];
      setProjects(all.length > 0 ? all : MOCK_PROJECTS);
    } catch (error) {
      setProjects(MOCK_PROJECTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchProjects(); };

  const filtered = search
    ? projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.location?.toLowerCase().includes(search.toLowerCase()))
    : projects;

  if (loading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  const renderItem = ({ item, index }: { item: Project; index: number }) => {
    const accentColor = PROJECT_COLORS[index % PROJECT_COLORS.length];
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("ProjectDetail", { project: item })}
        style={styles.card}
      >
        {/* Color accent header */}
        {item.banner ? (
          <Box h={140} w="$full" bg="$coolGray200">
            <Animated.Image 
              source={{ uri: item.banner }} 
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
          </Box>
        ) : (
          <View style={[styles.bannerPlaceholder, { backgroundColor: accentColor + "10" }]}>
            <View style={[styles.iconBubble, { backgroundColor: accentColor + "20" }]}>
              <MaterialCommunityIcons name="home-city" size={32} color={accentColor} />
            </View>
          </View>
        )}

        <View style={styles.cardBody}>
          <Heading size="sm" color="#1F2937" numberOfLines={1}>{item.name}</Heading>
          {item.location && (
            <HStack alignItems="center" space="xs" mt="$1">
              <MaterialCommunityIcons name="map-marker-outline" size={14} color="#66BB6A" />
              <Text size="xs" color="#6B7280">{item.location}</Text>
            </HStack>
          )}
          {item.description && (
            <Text size="xs" color="#9CA3AF" mt="$1.5" numberOfLines={2} lineHeight={18}>
              {item.description}
            </Text>
          )}

          <HStack mt="$3" alignItems="center" justifyContent="space-between">
            <HStack space="xs" alignItems="center">
              <View style={[styles.statusDot, { backgroundColor: "#4CAF50" }]} />
              <Text size="2xs" color="#4CAF50" bold>Available</Text>
            </HStack>
            <HStack alignItems="center" space="xs">
              <Text size="xs" color="#388E3C" bold>View Details</Text>
              <MaterialCommunityIcons name="arrow-right" size={14} color="#388E3C" />
            </HStack>
          </HStack>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search properties..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialCommunityIcons name="close-circle" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.project_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListHeaderComponent={
          <HStack justifyContent="space-between" alignItems="center" mb="$3">
            <Text size="sm" color="#6B7280">{filtered.length} properties available</Text>
          </HStack>
        }
        ListEmptyComponent={
          <Box py="$10" alignItems="center">
            <MaterialCommunityIcons name="home-search" size={48} color="#D1D5DB" />
            <Text mt="$2" color="#9CA3AF">No properties found.</Text>
          </Box>
        }
      />
    </Screen>
  );
};

export default AllPropertiesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FBF6" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
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
  bannerPlaceholder: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { padding: 16 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
});
