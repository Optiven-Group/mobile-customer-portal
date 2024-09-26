import React from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import {
  Text,
  Box,
  Card,
  VStack,
  ButtonText,
  Heading,
  Button,
  HStack,
  Icon,
  DownloadIcon,
  InfoIcon,
} from "@gluestack-ui/themed";
import Screen from "../components/Screen";
import colors from "../utils/colors";

interface Payment {
  id: string;
  date: string;
  amount: string;
  status: "Upcoming" | "Paid" | "Due";
}

const payments: Payment[] = [
  { id: "1", date: "2024-10-20", amount: "50,000.00", status: "Upcoming" },
  { id: "2", date: "2024-09-20", amount: "50,000.00", status: "Due" },
  { id: "3", date: "2024-08-20", amount: "50,000.00", status: "Paid" },
  { id: "4", date: "2024-07-20", amount: "50,000.00", status: "Paid" },
  { id: "5", date: "2024-06-20", amount: "50,000.00", status: "Paid" },
  { id: "6", date: "2024-05-20", amount: "50,000.00", status: "Paid" },
  { id: "7", date: "2024-04-20", amount: "50,000.00", status: "Paid" },
  { id: "8", date: "2024-03-20", amount: "50,000.00", status: "Paid" },
  { id: "9", date: "2024-02-20", amount: "50,000.00", status: "Paid" },
  { id: "10", date: "2024-01-20", amount: "50,000.00", status: "Paid" },
];

const statusColor = (status: Payment["status"]) => {
  switch (status) {
    case "Paid":
      return colors.success;
    case "Due":
      return colors.danger;
    case "Upcoming":
      return colors.warning;
    default:
      return colors.danger;
  }
};

const PaymentScheduleScreen: React.FC = () => {
  return (
    <Screen style={styles.container}>
      <HStack style={styles.heading}>
        <VStack>
          <Heading size="lg" style={styles.headingText}>
            Payment Schedule
          </Heading>
          <Text size="xs" style={styles.subText}>
            Track your payment progress below
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
          {payments.map((payment) => (
            <Card key={payment.id} style={styles.card}>
              <VStack>
                <Text size="sm" bold style={styles.dateText}>
                  {payment.date}
                </Text>
                <HStack alignItems="center">
                  <Text size="2xl" bold>
                    {payment.amount}
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
                    { backgroundColor: statusColor(payment.status) },
                  ]}
                />
                <TouchableOpacity onPress={() => console.log("view details")}>
                  <Icon
                    as={InfoIcon}
                    size="sm"
                    style={{ marginTop: 5, color: colors.medium }}
                  />
                </TouchableOpacity>
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
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default PaymentScheduleScreen;
