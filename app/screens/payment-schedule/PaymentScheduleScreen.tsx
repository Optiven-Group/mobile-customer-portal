import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  View,
} from "react-native";
import {
  Text,
  Card,
  VStack,
  Heading,
  Button,
  HStack,
  Icon,
  DownloadIcon,
  Pressable,
} from "@gluestack-ui/themed";
import { format } from "date-fns";
import Screen from "../../components/Screen";
import colors from "../../utils/colors";
import api from "../../utils/api";

interface InstallmentSchedule {
  is_id: number;
  due_date: string;
  installment_amount: string;
  paid: string;
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
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchInstallmentSchedules = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      const response = await api.get(
        `/properties/${property.lead_file_no}/installment-schedule`
      );
      const fetchedSchedules: InstallmentSchedule[] =
        response.data.installment_schedules;
      setSchedules(fetchedSchedules);
      setError("");
    } catch (error: any) {
      setError("Failed to fetch installment schedules. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      if (refreshing) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    if (!property) return;
    fetchInstallmentSchedules();
  }, [property]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInstallmentSchedules();
  };

  const formatAmount = (amount: string) => {
    const number = parseFloat(amount.replace(/,/g, ""));
    return new Intl.NumberFormat().format(number);
  };

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
        <Text style={{ color: colors.danger }}>{error}</Text>
        <Pressable
          onPress={fetchInstallmentSchedules}
          style={styles.retryButton}
        >
          <Text style={{ color: colors.primary }}>Tap to Retry</Text>
        </Pressable>
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

      <FlatList<InstallmentSchedule>
        data={schedules}
        keyExtractor={(item) => item.is_id.toString()}
        renderItem={({ item }) => (
          <Card key={item.is_id.toString()} style={styles.card}>
            <VStack>
              <Text size="sm" bold style={styles.dateText}>
                {format(new Date(item.due_date), "dd-MM-yyyy")}
              </Text>
              <HStack alignItems="center">
                <Text size="2xl" bold>
                  {formatAmount(item.installment_amount)}
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
                  { backgroundColor: statusColor(item.paid) },
                ]}
              />
            </VStack>
          </Card>
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
    alignItems: "center",
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
  retryButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});

export default PaymentScheduleScreen;
