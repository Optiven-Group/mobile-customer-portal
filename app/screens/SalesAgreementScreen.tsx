import React from "react";
import { StyleSheet, Alert, View } from "react-native";
import * as Progress from "react-native-progress";
import Screen from "../components/Screen";
import colors from "../utils/colors";
import {
  Box,
  Card,
  Icon,
  Text,
  ScrollView,
  LockIcon,
  UnlockIcon,
} from "@gluestack-ui/themed";

type Property = {
  id: string;
  plotPrice: number;
  amountPaid: number;
};

const properties: Property[] = [
  { id: "JL5", plotPrice: 7900000, amountPaid: 6750000 },
  { id: "VR28", plotPrice: 6500000, amountPaid: 6500000 },
];

const SalesAgreementScreen: React.FC = () => {
  const handleViewAgreement = (propertyId: string): void => {
    const property = properties.find((prop) => prop.id === propertyId);
    if (property) {
      const isPaymentComplete = property.amountPaid >= property.plotPrice;
      if (isPaymentComplete) {
        Alert.alert(
          "Sales Agreement",
          `You can now view your Sales Agreement for ${propertyId}.`
        );
      }
    }
  };

  return (
    <Screen style={styles.container}>
      <ScrollView>
        {properties.map((property) => {
          const progress = property.amountPaid / property.plotPrice;
          const isPaymentComplete = progress >= 1;

          return (
            <Box flexDirection="column" alignItems="center" key={property.id}>
              <Card style={[styles.card, styles.propertyCard]}>
                <Text style={styles.heading}>
                  {property.id} - Sales Agreement
                </Text>
                <Text style={styles.subheading}>
                  <Text style={styles.label}>Plot Price: </Text>
                  <Text style={styles.value}>
                    KES {property.plotPrice.toLocaleString()}
                  </Text>
                </Text>
                <Text style={styles.subheading}>
                  <Text style={styles.label}>Amount Paid: </Text>
                  <Text style={styles.value}>
                    KES {property.amountPaid.toLocaleString()}
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
              {isPaymentComplete && (
                <Card style={styles.card}>
                  <Text
                    onPress={() => handleViewAgreement(property.id)}
                    style={styles.viewAgreement}
                  >
                    View Sales Agreement
                  </Text>
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
