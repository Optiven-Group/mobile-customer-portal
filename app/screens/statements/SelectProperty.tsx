import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import { Card, Text, VStack, Pressable } from "@gluestack-ui/themed";
import Screen from "../../components/Screen";
import { NavigationProp } from "@react-navigation/native";
import colors from "../../utils/colors";
import api from "../../utils/api";
import { OverviewStackParamList } from "../../navigation/types";

type SelectPropertyForStatementsScreenProps = {
  navigation: NavigationProp<
    OverviewStackParamList,
    "Select Property for Statements"
  >;
};

interface Property {
  lead_file_no: string;
  plot_number: string;
}

const SelectPropertyForStatementsScreen: React.FC<
  SelectPropertyForStatementsScreenProps
> = ({ navigation }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchProperties = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      const response = await api.get("/properties");
      const fetchedProperties: Property[] = response.data.properties;
      setProperties(fetchedProperties);
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
    navigation.navigate("View Statements", { property });
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

export default SelectPropertyForStatementsScreen;
