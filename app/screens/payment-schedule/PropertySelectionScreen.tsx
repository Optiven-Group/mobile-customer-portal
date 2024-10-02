// payment-schedule/PropertySelectionScreen.tsx

import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Card, Text, Pressable } from "@gluestack-ui/themed";
import Screen from "../../components/Screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OverviewStackParamList, Property } from "../../navigation/types";
import colors from "../../utils/colors";
import api from "../../utils/api";

type PropertySelectionScreenProps = NativeStackScreenProps<
  OverviewStackParamList,
  "Property Selection for Payment"
>;

const PropertySelectionScreen = ({
  navigation,
  route,
}: PropertySelectionScreenProps) => {
  const { project } = route.params;
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchProperties = async () => {
    try {
      if (!refreshing) {
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
      setLoading(false);
      if (refreshing) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProperties();
  };

  const handlePropertySelect = (property: Property) => {
    navigation.navigate("Payment Schedule", { property });
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
        <Pressable onPress={fetchProperties} style={styles.retryButton}>
          <Text style={{ color: colors.primary }}>Tap to Retry</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.lead_file_no}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePropertySelect(item)}>
            <Card style={styles.card}>
              <Text bold size="lg">
                {item.plot_number}
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

export default PropertySelectionScreen;

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
