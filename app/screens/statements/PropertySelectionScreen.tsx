import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import { Card, Text, VStack, Pressable } from "@gluestack-ui/themed";
import Screen from "../../app-components/Screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OverviewStackParamList, Property } from "../../navigation/types";
import colors from "../../utils/colors";
import api from "../../utils/api";

type PropertySelectionForStatementsScreenProps = NativeStackScreenProps<
  OverviewStackParamList,
  "Property Selection for Statements"
>;

const PropertySelectionForStatementsScreen: React.FC<
  PropertySelectionForStatementsScreenProps
> = ({ navigation, route }) => {
  const { project } = route.params;

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchProperties = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await api.get(
        `/projects/${project.project_id}/properties`
      );
      setProperties(response.data.properties);
      setError("");
    } catch (error: any) {
      setError("Failed to fetch properties. Please try again.");
      console.error(error);
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const onRefresh = () => {
    fetchProperties(true);
  };

  const handlePropertySelect = (property: Property) => {
    navigation.navigate("View Statements", { property });
  };

  if (loading) {
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
        <Pressable onPress={() => fetchProperties()} style={styles.retryButton}>
          <Text style={{ color: colors.primary }}>Tap to Retry</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <FlatList<Property>
        data={properties}
        keyExtractor={(item) => item.lead_file_no}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePropertySelect(item)}>
            <Card style={styles.card}>
              <VStack>
                <Text bold size="lg">
                  {item.plot_number}
                </Text>
              </VStack>
            </Card>
          </Pressable>
        )}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </Screen>
  );
};

export default PropertySelectionForStatementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContent: {
    paddingBottom: 90,
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
