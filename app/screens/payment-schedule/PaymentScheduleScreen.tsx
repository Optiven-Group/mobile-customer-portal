import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator } from "react-native";
import {
  Text,
  Box,
  Card,
  VStack,
  Heading,
  Button,
  HStack,
  Icon,
  DownloadIcon,
} from "@gluestack-ui/themed";
import Screen from "../../components/Screen";
import colors from "../../utils/colors";
import api from "../../utils/api";

interface InstallmentSchedule {
  is_id: number;
  due_date: string;
  installment_amount: string;
  paid: string;
  // Add other fields as needed
}

interface PaymentScheduleScreenProps {
  route: any;
}

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "yes":
      return colors.success;
    case "no":
      return colors.danger;
    case "upcoming":
      return colors.warning;
    default:
      return colors.medium;
  }
};

const PaymentScheduleScreen: React.FC<PaymentScheduleScreenProps> = ({
  route,
}) => {
  const property = route?.params?.property;

  const [schedules, setSchedules] = useState<InstallmentSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!property) return;

    const fetchInstallmentSchedules = async () => {
      try {
        const response = await api.get(
          `/properties/${property.lead_file_no}/installment-schedule`
        );
        const fetchedSchedules = response.data.installment_schedules;
        setSchedules(fetchedSchedules);
      } catch (error: any) {
        setError("Failed to fetch installment schedules. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstallmentSchedules();
  }, [property]);

  if (!property) {
    return (
      <Screen style={styles.container}>
        <Heading size="lg" style={styles.headingText}>
          No property selected
        </Heading>
        <Text size="xs" style={styles.subText}>
          Please go back and select a property to view the payment schedule.
        </Text>
      </Screen>
    );
  }

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
      <HStack style={styles.heading}>
        <VStack>
          <Heading size="lg" style={styles.headingText}>
            {property.plot_number}
          </Heading>
          <Text size="xs" style={styles.subText}>
            Track your payment progress.
          </Text>
        </VStack>
        <Button
          size="sm"
          variant="solid"
          action="primary"
          borderRadius={"$full"}
          style={styles.downloadButton}
          onPress={() => console.log("downloaded")}
        >
          <Icon as={DownloadIcon} style={{ color: colors.white }} />
        </Button>
      </HStack>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Box flexDirection="column" alignItems="center">
          {schedules.map((schedule) => (
            <Card key={schedule.is_id.toString()} style={styles.card}>
              <VStack>
                <Text size="sm" bold style={styles.dateText}>
                  {new Date(schedule.due_date).toLocaleDateString()}
                </Text>
                <HStack alignItems="center">
                  <Text size="2xl" bold>
                    {schedule.installment_amount}
                  </Text>
                  <Text size="xs" style={styles.currencyText}>
                    KES
                  </Text>
                </HStack>
              </VStack>
              <VStack style={styles.paymentDetails}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: statusColor(schedule.paid) },
                  ]}
                />
              </VStack>
            </Card>
          ))}
        </Box>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    padding: 20,
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 3,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  headingText: {
    fontWeight: "bold",
    color: colors.dark,
  },
  subText: {
    color: colors.medium,
    marginTop: 2,
  },
  downloadButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  dateText: {
    marginBottom: 4,
    color: colors.medium,
  },
  currencyText: {
    marginLeft: 5,
    color: colors.medium,
  },
  paymentDetails: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default PaymentScheduleScreen;
