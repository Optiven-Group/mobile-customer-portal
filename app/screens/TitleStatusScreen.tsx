import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import Screen from "../app-components/Screen";
import colors from "../utils/colors";
import api from "../utils/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OverviewStackParamList } from "../navigation/types";
import { MaterialIcons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<OverviewStackParamList, "Title Status">;

const titleStatusSteps = [
  "Congratulations Message Sent",
  "Cleared for Transfer",
  "At Client",
  "Received from Client",
  "At Registry",
  "Received from Registry",
  "Consent Form / ID Copy Sent",
  "On Transit",
  "Arrived",
  "Title Deed Picked Up",
  "Issuance Form Attached",
];

const TitleStatusScreen: React.FC<Props> = ({ navigation, route }) => {
  const { leadFileNo } = route.params;

  if (!leadFileNo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: Lead File Number is missing.
        </Text>
      </View>
    );
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<number>(-1);

  useEffect(() => {
    const fetchTitleStatus = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/properties/${leadFileNo}/title-status`
        );
        const fetchedStatus: string = response.data.title_status;

        if (!fetchedStatus || fetchedStatus.trim() === "") {
          setError(
            "You need to complete the payments to be able to see the title status."
          );
          setCurrentStatus(-1);
          return;
        }

        // Map title status to corresponding index in titleStatusSteps
        const statusIndex = titleStatusSteps.findIndex(
          (status) => status.toLowerCase() === fetchedStatus.toLowerCase()
        );

        setCurrentStatus(statusIndex !== -1 ? statusIndex : -1);
        setError("");
      } catch (error: any) {
        setError("Failed to fetch title status. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTitleStatus();
  }, [leadFileNo]);

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
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Title Status Progress</Text>
        <View style={styles.timeline}>
          {titleStatusSteps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepIndicator}>
                <MaterialIcons
                  name={
                    index <= currentStatus
                      ? "check-circle"
                      : "radio-button-unchecked"
                  }
                  size={24}
                  color={
                    index <= currentStatus ? colors.primary : colors.medium
                  }
                />
                {index !== titleStatusSteps.length - 1 && (
                  <View style={styles.line} />
                )}
              </View>
              <Text
                style={[
                  styles.stepText,
                  index <= currentStatus && styles.activeStepText,
                ]}
              >
                {step}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default TitleStatusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.dark,
    textAlign: "center",
    marginBottom: 20,
  },
  timeline: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: 10,
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: colors.medium,
    alignSelf: "center",
  },
  stepText: {
    fontSize: 16,
    color: colors.medium,
    flexShrink: 1,
  },
  activeStepText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: "center",
  },
});
