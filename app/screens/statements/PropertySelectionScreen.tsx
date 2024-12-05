import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  View,
  Dimensions,
} from "react-native";
import { Card, Text, Pressable } from "@gluestack-ui/themed";
import Screen from "../../app-components/Screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OverviewStackParamList, Property } from "../../navigation/types";
import colors from "../../utils/colors";
import api from "../../utils/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type PropertySelectionForStatementsScreenProps = NativeStackScreenProps<
  OverviewStackParamList,
  "Property Selection for Statements"
>;

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

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
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => fetchProperties()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tap to Retry</Text>
          </Pressable>
        </View>
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
              <View style={styles.cardContent}>
                <MaterialCommunityIcons
                  name="home-circle-outline"
                  size={isTablet ? 36 : 28}
                  color={colors.primary}
                  style={styles.cardIcon}
                />
                <Text bold size={isTablet ? "xl" : "lg"} style={styles.cardText}>
                  {item.plot_number}
                </Text>
              </View>
            </Card>
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: colors.white,
    fontSize: 16,
  },
  listContent: {
    paddingVertical: 20,
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    marginRight: 16,
  },
  cardText: {
    color: colors.primary,
  },
});
