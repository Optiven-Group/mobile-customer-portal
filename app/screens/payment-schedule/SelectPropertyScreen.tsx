import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import {
  Card,
  Text,
  VStack,
  Pressable,
} from "@gluestack-ui/themed";
import Screen from "../../components/Screen";
import { NavigationProp } from "@react-navigation/native";
import colors from "../../utils/colors";
import api from "../../utils/api"; // Import the api utility

type SelectPropertyScreenProps = {
  navigation: NavigationProp<any>;
};

interface Property {
  lead_file_no: string;
  plot_number: string;
  // Add other fields you need
}

const SelectPropertyScreen: React.FC<SelectPropertyScreenProps> = ({
  navigation,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get("/properties");
        const fetchedProperties = response.data.properties;
        setProperties(fetchedProperties);
      } catch (error: any) {
        setError("Failed to fetch properties. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertySelect = (property: Property) => {
    navigation.navigate("Payment Schedule", { property });
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
        <Text style={{ color: colors.danger }}>{error}</Text>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {properties.map((property) => (
          <Pressable
            key={property.lead_file_no}
            onPress={() => handlePropertySelect(property)}
          >
            <Card style={styles.card}>
              <VStack>
                <Text bold size="lg">
                  {property.plot_number}
                </Text>
                {/* Add other property details if needed */}
              </VStack>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
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
});

export default SelectPropertyScreen;
