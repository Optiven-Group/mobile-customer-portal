import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  SectionList,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
} from "react-native";
import { Text } from "@gluestack-ui/themed";
import { NavigationProp } from "@react-navigation/native";
import { ReferralStackParamList, Project } from "../../navigation/types";
import api from "../../utils/api";
import colors from "../../utils/colors";
import { Feather } from "@expo/vector-icons";

interface FeaturedProjectsScreenProps {
  navigation: NavigationProp<ReferralStackParamList, "FeaturedProjects">;
}

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

const FeaturedProjectsScreen: React.FC<FeaturedProjectsScreenProps> = ({
  navigation,
}) => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/visible-projects");
        setFeaturedProjects(response.data.featured_projects);
        setOtherProjects(response.data.other_projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSelectProject = (project: Project) => {
    navigation.navigate("ReferSomeone", { project });
  };

  const sections = [];

  if (featuredProjects.length > 0) {
    sections.push({
      title: "Featured Projects",
      data: featuredProjects,
    });
  }

  if (otherProjects.length > 0) {
    sections.push({
      title: "All Projects",
      data: otherProjects,
    });
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.project_id.toString()}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>{title}</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <TouchableOpacity onPress={() => handleSelectProject(item)}>
            {item.banner && (
              <Image source={{ uri: item.banner }} style={styles.banner} />
            )}
            <View style={styles.content}>
              <Text style={styles.projectName}>{item.name}</Text>
              {item.description && (
                <Text style={styles.description}>{item.description}</Text>
              )}
            </View>
          </TouchableOpacity>
          {/* Share Icon */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => handleSelectProject(item)}
          >
            <Feather name="share-2" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
      contentContainerStyle={styles.listContent}
    />
  );
};

export default FeaturedProjectsScreen;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  sectionHeaderContainer: {
    backgroundColor: colors.light,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "bold",
    color: colors.dark,
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    height: isTablet ? 250 : 200,
    resizeMode: "cover",
  },
  content: {
    padding: 15,
  },
  projectName: {
    fontSize: isTablet ? 20 : 18,
    color: colors.dark,
    marginBottom: 5,
  },
  description: {
    fontSize: isTablet ? 16 : 14,
    color: colors.medium,
    marginBottom: 10,
  },
  shareButton: {
    position: "absolute",
    right: 15,
    top: 15,
    backgroundColor: "#FFF",
    borderRadius: 30,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
