import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { View, Text } from "@gluestack-ui/themed";
import { NavigationProp } from "@react-navigation/native";
import { ReferralStackParamList, Project } from "../../navigation/types";
import api from "../../utils/api";
import colors from "../../utils/colors";

interface FeaturedProjectsScreenProps {
  navigation: NavigationProp<ReferralStackParamList, "FeaturedProjects">;
}

const FeaturedProjectsScreen: React.FC<FeaturedProjectsScreenProps> = ({
  navigation,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await api.get("/featured-projects");
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Failed to fetch featured projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProjects();
  }, []);

  const handleSelectProject = (project: Project) => {
    navigation.navigate("ReferSomeone", { project });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={projects}
      keyExtractor={(item) => item.project_id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.projectItem}
          onPress={() => handleSelectProject(item)}
        >
          {item.banner && (
            <Image source={{ uri: item.banner }} style={styles.banner} />
          )}
          <Text style={styles.projectName}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default FeaturedProjectsScreen;

const styles = StyleSheet.create({
  projectItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.medium,
  },
  banner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
  projectName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    marginTop: 5,
    color: colors.medium,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
