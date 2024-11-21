import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import { OverviewStackParamList } from "../navigation/types";

interface Property {
  lead_file_no: string;
  plot_number: string;
  purchase_price: number;
  total_paid: number;
  sale_agreement_sent: string;
}

const PaymentProgressScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<OverviewStackParamList>>();
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

  const handleViewTitleStatus = (propertyId: string | undefined): void => {
    if (propertyId) {
      navigation.navigate("Title Status", { leadFileNo: propertyId });
    } else {
      Alert.alert("Error", "Property ID is undefined");
    }
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

          return (
            <Box
              flexDirection="column"
              alignItems="center"
              key={property.lead_file_no}
            >
              <Card style={[styles.card, styles.propertyCard]}>
                <Text style={styles.heading}>
                  {property.plot_number} - Payment Progress
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
                </View>
                <Text style={styles.progressText} bold>
                  {Math.floor(progress * 100)}% Completed
                </Text>
                <Pressable
                  style={[
                    styles.viewTitleButton,
                    !isPaymentComplete && styles.disabledButton,
                  ]}
                  onPress={() => handleViewTitleStatus(property.lead_file_no)}
                  disabled={!isPaymentComplete}
                >
                  <Icon
                    as={isPaymentComplete ? UnlockIcon : LockIcon}
                    color={colors.white}
                    style={styles.lockIcon}
                  />
                  <Text
                    style={[
                      styles.viewTitleText,
                      !isPaymentComplete && styles.disabledText,
                    ]}
                  >
                    Title Status
                  </Text>
                </Pressable>
              </Card>
            </Box>
          );
        })}
      </ScrollView>
    </Screen>
  );
};

export default PaymentProgressScreen;

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
    marginRight: 10,
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
  viewTitleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    width: "100%",
  },
  viewTitleText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: colors.medium,
  },
  disabledText: {
    color: colors.light,
  },
});
