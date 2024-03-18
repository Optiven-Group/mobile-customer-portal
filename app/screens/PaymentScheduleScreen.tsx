import React from "react";
import {
  StyleSheet,
  ScrollView,
  ViewStyle,
} from "react-native";
import {
  Text,
  Box,
  Card,
  VStack,
  ButtonText,
  Heading,
  Button,
  HStack,
  DownloadIcon,
  ButtonIcon,
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
  { id: "1", date: "2024-03-20", amount: "360,000.00", status: "Upcoming" },
  { id: "2", date: "2024-02-20", amount: "360,000.00", status: "Due" },
  { id: "3", date: "2024-01-20", amount: "1,200,000.00", status: "Paid" },
];

const statusButton = (status: Payment["status"]): ViewStyle => {
  return {
    backgroundColor:
      status === "Upcoming"
        ? colors.primary
        : status === "Due"
        ? colors.danger
        : colors.primary,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  };
};

const PaymentScheduleScreen: React.FC = () => {
  return (
    <Screen style={styles.container}>
      <HStack style={styles.heading}>
        <Heading>Payment Schedule</Heading>
        <Button size="xs" variant="solid" action="primary">
          <ButtonText>View </ButtonText>
          <ButtonIcon as={DownloadIcon} />
        </Button>
      </HStack>
      <ScrollView>
        <Box flexDirection="column" alignItems="center">
          {payments.map((payment) => (
            <Card key={payment.id} style={styles.card}>
              <VStack>
                <Text size="sm" bold>
                  {payment.date}
                </Text>
                <Text size="3xl">{payment.amount}</Text>
              </VStack>
              <VStack style={styles.paymentDetails}>
                <Box style={statusButton(payment.status)}>
                  <Text color="white">
                    {payment.status === "Due" ? "Payment Due" : payment.status}
                  </Text>
                </Box>
                <Button
                  size="sm"
                  variant="link"
                  onPress={() => console.log("view details")}
                >
                  <ButtonText>View Details</ButtonText>
                </Button>
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
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    padding: 15,
    width: "90%",
    borderRadius: 10,
    shadowOpacity: 0.05,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  paymentDetails: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
});

export default PaymentScheduleScreen;
