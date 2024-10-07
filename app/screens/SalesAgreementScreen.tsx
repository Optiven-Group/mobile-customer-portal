import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import * as Progress from "react-native-progress";
import Screen from "../app-components/Screen";
import colors from "../utils/colors";
import {
  Box,
  Card,
  Icon,
  Text,
  ScrollView,
  LockIcon,
  UnlockIcon,
  RefreshControl,
} from "@gluestack-ui/themed";
import api from "../utils/api";

interface Property {
  lead_file_no: string;
  plot_number: string;
  purchase_price: number;
  total_paid: number;
  sale_agreement_sent: string;
}

const SalesAgreementScreen: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchProperties = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      const response = await api.get("/properties");
      const fetchedProperties: Property[] = response.data.properties.map(
        (property: any) => ({
          lead_file_no: property.lead_file_no,
          plot_number: property.plot_number,
          purchase_price: property.purchase_price,
          total_paid: property.total_paid,
          sale_agreement_sent: property.sale_agreement_sent,
          // Map other fields if necessary
        })
      );
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

  const handleViewAgreement = (propertyId: string): void => {
    Alert.alert(
      "Sales Agreement",
      `You can now view your Sales Agreement for ${propertyId}.`
    );
    // Implement the actual logic to view or download the sales agreement.
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {properties.map((property) => {
          const progress =
            property.total_paid && property.purchase_price
              ? property.total_paid / property.purchase_price
              : 0;
          const isPaymentComplete = progress >= 1;
          const canViewAgreement =
            isPaymentComplete &&
            property.sale_agreement_sent.toLowerCase() === "yes";

          return (
            <Box
              flexDirection="column"
              alignItems="center"
              key={property.lead_file_no}
            >
              <Card style={[styles.card, styles.propertyCard]}>
                <Text style={styles.heading}>
                  {property.plot_number} - Sales Agreement
                </Text>
                <Text style={styles.subheading}>
                  <Text style={styles.label}>Plot Price: </Text>
                  <Text style={styles.value}>
                    KES {property.purchase_price.toLocaleString()}
                  </Text>
                </Text>
                <Text style={styles.subheading}>
                  <Text style={styles.label}>Amount Paid: </Text>
                  <Text style={styles.value}>
                    KES {property.total_paid.toLocaleString()}
                  </Text>
                </Text>
              </Card>
              <Card style={styles.card}>
                <View style={styles.progressContainer}>
                  <Progress.Circle
                    progress={progress}
                    size={200}
                    thickness={20}
                    color={isPaymentComplete ? "green" : "tomato"}
                    style={styles.progressBar}
                    strokeCap="round"
                    showsText
                    formatText={() => `${Math.floor(progress * 100)}%`}
                  />
                  <Icon
                    as={isPaymentComplete ? UnlockIcon : LockIcon}
                    style={styles.lockIcon}
                    color={isPaymentComplete ? "green" : "tomato"}
                  />
                </View>
                <Text style={styles.progressText} bold>
                  {Math.floor(progress * 100)}% Completed
                </Text>
              </Card>
              {canViewAgreement && (
                <Card style={styles.card}>
                  <Pressable
                    onPress={() => handleViewAgreement(property.lead_file_no)}
                  >
                    <Text style={styles.viewAgreement}>
                      View Sales Agreement
                    </Text>
                  </Pressable>
                </Card>
              )}
            </Box>
          );
        })}
      </ScrollView>
    </Screen>
  );
};

export default SalesAgreementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  card: {
    marginVertical: 8,
    padding: 15,
    width: "90%",
    borderRadius: 10,
    shadowOpacity: 0.05,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    color: colors.dark,
  },
  subheading: {
    fontSize: 18,
    color: colors.dark,
    marginBottom: 5,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  progressBar: {
    marginRight: 10,
  },
  propertyCard: {
    backgroundColor: colors.white,
    borderColor: colors.light,
    borderWidth: 1,
  },
  lockIcon: {
    marginLeft: 10,
  },
  progressText: {
    marginTop: 10,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  value: {
    fontWeight: "normal",
    color: colors.medium,
  },
  viewAgreement: {
    color: "green",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 10,
  },
});
