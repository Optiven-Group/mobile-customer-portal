import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
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
  Card,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Project {
  project_id: number;
  name: string;
  description?: string;
  banner?: string;
  location?: string;
}

// Mock data fallback
const MOCK_PROJECTS: Project[] = [
  { project_id: 1, name: "Amani Ridge — The Place of Peace", description: "Prime plots in Kiambu County, 40 minutes from Nairobi CBD. Available in 1/8 and 1/4 acre sizes.", banner: "", location: "Kiambu, Kenya" },
  { project_id: 2, name: "Love Gardens — Machakos", description: "Plots in Machakos with beautiful views of the surrounding hills. Great for residential and investment.", banner: "", location: "Machakos, Kenya" },
  { project_id: 3, name: "Success Gardens — Gatanga", description: "Affordable plots in Gatanga, Murang'a County. Ideal for farming and rural homes.", banner: "", location: "Gatanga, Murang'a" },
  { project_id: 4, name: "Joy Lovers — Konza", description: "Strategic plots near the Konza Technopolis. A great investment opportunity.", banner: "", location: "Konza, Machakos" },
  { project_id: 5, name: "Victory Gardens — Kitengela", description: "Fast-developing area with excellent infrastructure and proximity to Nairobi.", banner: "", location: "Kitengela, Kajiado" },
  { project_id: 6, name: "Wema Gardens — Nanyuki", description: "Cool-climate plots with stunning views of Mount Kenya. Perfect for holiday homes.", banner: "", location: "Nanyuki, Laikipia" },
];

const AllPropertiesScreen = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/visible-projects");
        const all = [
          ...(response.data.featured_projects || []),
          ...(response.data.other_projects || []),
        ];
        setProjects(all.length > 0 ? all : MOCK_PROJECTS);
      } catch (error) {
        console.log("Using mock projects");
        setProjects(MOCK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  const renderItem = ({ item }: { item: Project }) => (
    <Card variant="elevated" mb="$3" p="$0" borderRadius={14} overflow="hidden">
      {/* Banner or placeholder */}
      {item.banner ? (
        <Image source={{ uri: item.banner }} style={styles.banner} />
      ) : (
        <Box bg={colors.primary + "12"} h={120} alignItems="center" justifyContent="center">
          <MaterialCommunityIcons name="home-city" size={40} color={colors.primary} />
        </Box>
      )}
      <VStack p="$4">
        <Heading size="sm">{item.name}</Heading>
        {item.location && (
          <HStack alignItems="center" space="xs" mt="$1">
            <MaterialCommunityIcons name="map-marker" size={14} color={colors.coolGray} />
            <Text size="xs" color="$coolGray500">{item.location}</Text>
          </HStack>
        )}
        {item.description && (
          <Text size="xs" color="$coolGray600" mt="$1" numberOfLines={2}>{item.description}</Text>
        )}
      </VStack>
    </Card>
  );

  return (
    <Screen style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.project_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListHeaderComponent={
          <Box mb="$2">
            <Text size="sm" color="$coolGray500">{projects.length} properties available</Text>
          </Box>
        }
        ListEmptyComponent={
          <Box py="$10" alignItems="center">
            <MaterialCommunityIcons name="home-search" size={48} color={colors.coolGray} />
            <Text mt="$2" color="$coolGray500">No properties found.</Text>
          </Box>
        }
      />
    </Screen>
  );
};

export default AllPropertiesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  banner: { width: "100%", height: 140, resizeMode: "cover" },
});
