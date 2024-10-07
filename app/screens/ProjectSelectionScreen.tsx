import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Card, Text, Pressable } from "@gluestack-ui/themed";
import Screen from "../app-components/Screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OverviewStackParamList, Project } from "../navigation/types";
import colors from "../utils/colors";
import api from "../utils/api";

type ProjectSelectionScreenProps = NativeStackScreenProps<
  OverviewStackParamList,
  | "Project Selection for Payment"
  | "Project Selection"
  | "Project Selection for Statements"
>;

const ProjectSelectionScreen = ({
  navigation,
  route,
}: ProjectSelectionScreenProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchProjects = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      const response = await api.get("/projects");
      setProjects(response.data.projects);
      setError("");
    } catch (error: any) {
      setError("Failed to fetch projects. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      if (refreshing) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  const handleProjectSelect = (project: Project) => {
    const nextScreen =
      route.name === "Project Selection for Payment"
        ? "Property Selection for Payment"
        : route.name === "Project Selection for Statements"
          ? "Property Selection for Statements"
          : "Property Selection";
    navigation.navigate(nextScreen, { project });
  };

  if (loading && !refreshing) {
    return (
      <Screen style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen style={styles.container}>
        <Text style={{ color: colors.danger, textAlign: "center" }}>
          {error}
        </Text>
        <Pressable onPress={fetchProjects} style={styles.retryButton}>
          <Text style={{ color: colors.primary }}>Tap to Retry</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.project_id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleProjectSelect(item)}>
            <Card style={styles.card}>
              <Text bold size="lg">
                {item.name}
              </Text>
            </Card>
          </Pressable>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </Screen>
  );
};

export default ProjectSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  card: {
    padding: 20,
    marginVertical: 8,
    width: "90%",
    alignSelf: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 3,
  },
  retryButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});
