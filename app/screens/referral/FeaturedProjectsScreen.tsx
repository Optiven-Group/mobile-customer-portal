import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { View, Text, Button, ButtonText } from "@gluestack-ui/themed";
import { NavigationProp } from "@react-navigation/native";
import { ReferralStackParamList, Project } from "../../navigation/types";
import api from "../../utils/api";
import colors from "../../utils/colors";
import { Feather } from "@expo/vector-icons"; // For the share icon

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
        <View style={styles.card}>
          <TouchableOpacity onPress={() => handleSelectProject(item)}>
            {item.banner && (
              <Image source={{ uri: item.banner }} style={styles.banner} />
            )}
            <View style={styles.content}>
              <Text style={styles.projectName}>{item.name}</Text>
              {/* <Text style={styles.description}>{item.description}</Text> */}
              <Button variant="link" justifyContent="flex-start">
                <ButtonText color={colors.primary}>View Details</ButtonText>
              </Button>
            </View>
          </TouchableOpacity>
          {/* Share Icon */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => handleSelectProject(item)}
          >
            <Feather name="share" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default FeaturedProjectsScreen;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden", // To ensure the image doesn't go beyond card
  },
  banner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 15,
  },
  projectName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: colors.medium,
    marginBottom: 10,
  },
  shareButton: {
    position: "absolute",
    right: 15,
    top: 15,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 5,
    elevation: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
