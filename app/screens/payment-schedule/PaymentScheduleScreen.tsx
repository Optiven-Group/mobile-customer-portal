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
} from "@react-navigation/native";
import {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

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

      // Sort schedules from latest to earliest
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

  const downloadPDF = async () => {
    try {
      const url = `/properties/${property.lead_file_no}/installment-schedule/pdf`;

      // Get the authorization header from your api instance
      const authHeader = api.defaults.headers.common["Authorization"] as string;

      if (!authHeader) {
        Alert.alert(
          "Authorization Error",
          "Authorization header is missing. Please log in again."
        );
        return;
      }

      const fileUri =
        FileSystem.documentDirectory +
        `payment_schedule_${property.lead_file_no}.pdf`;

      const downloadResumable = FileSystem.createDownloadResumable(
        api.defaults.baseURL + url,
        fileUri,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      const result = await downloadResumable.downloadAsync();

      if (result && result.uri) {
        if (Platform.OS === "ios" || Platform.OS === "android") {
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(result.uri);
          } else {
            Alert.alert(
              "Sharing not available",
              "The sharing functionality is not available on this device."
            );
          }
        } else {
          // For web or other platforms, handle accordingly
          Alert.alert(
            "Download Complete",
            "The PDF has been downloaded to your device."
          );
        }
      } else {
        Alert.alert("Download Failed", "Failed to download the PDF file.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while downloading the PDF.");
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

  // Use the current date
  const currentDate = new Date();

  const upcomingPayments = schedules.filter(
    (schedule) =>
      schedule.paid.toLowerCase() === "no" &&
      new Date(schedule.due_date) >= currentDate
  );

  const nextPayment =
    upcomingPayments.length > 0
      ? upcomingPayments.reduce((prev, current) => {
          return new Date(prev.due_date) < new Date(current.due_date)
            ? prev
            : current;
        })
      : null;

  const pastPayments = schedules.filter(
    (schedule) =>
      schedule.is_id !== nextPayment?.is_id || upcomingPayments.length === 0
  );

  const handlePayNow = (payment: InstallmentSchedule) => {
    navigation.navigate("MakePayment", { payment, property });
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
          onPress={downloadPDF}
        >
          <Icon as={DownloadIcon} style={{ color: colors.white }} />
        </Button>
      </HStack>

      {/* Show Next Payment */}
      {nextPayment && (
        <Card style={styles.nextPaymentCard}>
          <VStack>
            <Text size="sm" bold style={styles.dateText}>
              Next Payment Due:{" "}
              {format(new Date(nextPayment.due_date), "dd MMMM yyyy")}
            </Text>
            <HStack alignItems="center">
              <Text size="2xl" bold>
                {formatAmount(nextPayment.installment_amount)}
              </Text>
              <Text size="xs" style={styles.currencyText}>
                KES
              </Text>
            </HStack>
          </VStack>
          <Button
            size="md"
            variant="solid"
            action="primary"
            borderRadius={"$md"}
            style={styles.payNowButton}
            onPress={() => handlePayNow(nextPayment)}
          >
            <Text style={styles.payNowButtonText}>Pay Now</Text>
          </Button>
        </Card>
      )}

      {/* If no upcoming payments, show a message */}
      {!nextPayment && (
        <Center my="$2">
          <Text size="sm" bold>
            No upcoming payments. All payments are up to date.
          </Text>
        </Center>
      )}

      {/* Past Payments */}
      <FlatList<InstallmentSchedule>
        data={pastPayments}
        keyExtractor={(item) => item.is_id.toString()}
        renderItem={({ item }) => (
          <Card key={item.is_id.toString()} style={styles.card}>
            <VStack>
              <Text size="sm" bold style={styles.dateText}>
                {format(new Date(item.due_date), "dd MMMM yyyy")}
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
                  {
                    backgroundColor:
                      item.paid.toLowerCase() === "yes"
                        ? colors.success
                        : colors.danger,
                  },
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

export default PaymentScheduleScreen;

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
  nextPaymentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    padding: 20,
    width: "90%",
    alignSelf: "center",
    backgroundColor: colors.light,
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
