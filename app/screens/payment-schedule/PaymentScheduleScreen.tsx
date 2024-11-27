import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Alert,
  Platform,
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
  Center,
  View,
} from "@gluestack-ui/themed";
import { format } from "date-fns";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import api from "../../utils/api";
import {
  InstallmentSchedule,
  Property,
  OverviewStackParamList,
  RootStackParamList,
} from "../../navigation/types";
import {
  CompositeNavigationProp,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PaymentScheduleScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<OverviewStackParamList, "Payment Schedule">,
  NativeStackNavigationProp<RootStackParamList>
>;

type PaymentScheduleScreenRouteProp = RouteProp<
  OverviewStackParamList,
  "Payment Schedule"
>;

type PaymentScheduleScreenProps = {
  navigation: PaymentScheduleScreenNavigationProp;
  route: PaymentScheduleScreenRouteProp;
};

const PaymentScheduleScreen: React.FC<PaymentScheduleScreenProps> = ({
  navigation,
  route,
}) => {
  const property = route.params.property;

  const [schedules, setSchedules] = useState<InstallmentSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [processingPayments, setProcessingPayments] = useState<number[]>([]);

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

      // Sort from latest to earliest
      const sortedSchedules = fetchedSchedules.sort((a, b) => {
        return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
      });

      setSchedules(sortedSchedules);
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

  // Inside your downloadPDF function for the installment schedule
  const downloadPDF = async () => {
    try {
      const uri = `${api.defaults.baseURL}/properties/${property.lead_file_no}/installment-schedule/pdf`;
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        Alert.alert(
          "Authorization Error",
          "You are not logged in. Please log in again."
        );
        return;
      }

      const downloadResumable = FileSystem.createDownloadResumable(
        uri,
        FileSystem.documentDirectory +
          `payment_schedule_${property.lead_file_no}.pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await downloadResumable.downloadAsync();

      if (result && result.status === 200 && result.uri) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(result.uri);
        } else {
          Alert.alert(
            "Sharing not available",
            "Cannot share the file on this device."
          );
        }
      } else {
        Alert.alert("Download Failed", "Failed to download the PDF file.");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      Alert.alert("Error", "An error occurred while downloading the PDF.");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (processingPayments.length > 0) {
      interval = setInterval(() => {
        fetchInstallmentSchedules();
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [processingPayments]);

  useEffect(() => {
    if (schedules.length > 0 && processingPayments.length > 0) {
      const paidPayments = schedules.filter(
        (schedule) =>
          processingPayments.includes(schedule.is_id) &&
          schedule.paid.toLowerCase() === "yes"
      );
      if (paidPayments.length > 0) {
        setProcessingPayments((prev) =>
          prev.filter((id) => !paidPayments.some((p) => p.is_id === id))
        );
      }
    }
  }, [schedules]);

  useFocusEffect(
    React.useCallback(() => {
      fetchInstallmentSchedules();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchInstallmentSchedules();
  };

  const formatAmount = (amount: string) => {
    const number = parseFloat(amount.replace(/,/g, ""));
    return new Intl.NumberFormat().format(number);
  };

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const unpaidPayments = schedules.filter(
    (schedule) => schedule.paid.toLowerCase() === "no"
  );

  const nextPayment = unpaidPayments.length > 0 ? unpaidPayments[0] : null;
  const isOverdue =
    nextPayment &&
    new Date(nextPayment.due_date).getTime() < currentDate.getTime();

  const otherPayments = schedules.filter(
    (schedule) => schedule.is_id !== nextPayment?.is_id
  );

  const handlePayNow = (payment: InstallmentSchedule) => {
    setProcessingPayments((prev) => [...prev, payment.is_id]);
    navigation.navigate("PaymentMethod", { payment, property });
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
          bgColor={colors.black}
          width="$10"
          height="$10"
          onPress={downloadPDF}
        >
          <Icon as={DownloadIcon} style={{ color: colors.white }} />
        </Button>
      </HStack>

      {nextPayment ? (
        <Center>
          <Card bgColor={colors.white} style={styles.card}>
            <VStack>
              <Text size="sm" bold>
                {isOverdue ? "Overdue Payment" : "Next Payment Due"}
              </Text>
              <Text size="xs">
                {format(new Date(nextPayment.due_date), "dd MMMM yyyy")}
              </Text>
              <HStack alignItems="center">
                <Text size="2xl" bold>
                  {formatAmount(nextPayment.installment_amount)}
                </Text>
                <Text size="xs" ml="$1">
                  KES
                </Text>
              </HStack>
            </VStack>
            {processingPayments.includes(nextPayment.is_id) ? (
              <Text style={{ color: colors.warning, marginTop: 10 }}>
                Processing
              </Text>
            ) : nextPayment.paid.toLowerCase() === "yes" ? (
              <Text style={{ color: colors.primary, marginTop: 10 }}>Paid</Text>
            ) : (
              <Button
                size="md"
                variant="solid"
                borderRadius={"$md"}
                style={styles.payNowButton}
                onPress={() => handlePayNow(nextPayment)}
              >
                <Text style={styles.payNowButtonText}>Pay Now</Text>
              </Button>
            )}
          </Card>
        </Center>
      ) : (
        <Center my="$2">
          <Text size="sm" bold>
            All payments are up to date.
          </Text>
        </Center>
      )}

      {!nextPayment && (
        <Center my="$2">
          <Text size="sm" bold>
            No upcoming payments. All payments are up to date.
          </Text>
        </Center>
      )}

      <FlatList<InstallmentSchedule>
        data={otherPayments}
        keyExtractor={(item) => item.is_id.toString()}
        renderItem={({ item }) => {
          const isItemOverdue =
            item.paid.toLowerCase() === "no" &&
            new Date(item.due_date).getTime() < currentDate.getTime();
          const statusText =
            item.paid.toLowerCase() === "yes"
              ? "Paid"
              : isItemOverdue
              ? "Overdue"
              : "Unpaid";
          const statusColor =
            item.paid.toLowerCase() === "yes"
              ? colors.success
              : isItemOverdue
              ? colors.warning
              : colors.danger;

          return (
            <Card key={item.is_id.toString()} style={styles.card}>
              <VStack>
                <Text size="sm" bold style={styles.dateText}>
                  {format(new Date(item.due_date), "dd MMMM yyyy")}
                </Text>
                <HStack alignItems="center">
                  <Text size="2xl" bold>
                    {formatAmount(item.installment_amount)}
                  </Text>
                  <Text size="xs" ml="$1">
                    KES
                  </Text>
                </HStack>
              </VStack>
              <VStack style={styles.paymentDetails}>
                <Text style={[{ color: statusColor }]}>{statusText}</Text>
              </VStack>
            </Card>
          );
        }}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </Screen>
  );
};

export default PaymentScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContent: {
    paddingBottom: 220,
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
  dateText: {
    marginBottom: 4,
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
  payNowButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
  },
  payNowButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  noUpcomingPaymentsText: {
    textAlign: "center",
    color: colors.medium,
    marginVertical: 20,
  },
});
