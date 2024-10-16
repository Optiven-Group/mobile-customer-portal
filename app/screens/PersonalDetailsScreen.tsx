import React from "react";
import { StyleSheet, View } from "react-native";
import { Box, Text, Button, ButtonText, VStack } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountStackParamList } from "../navigation/types";
import colors from "../utils/colors";

type PersonalDetailsScreenProps = NativeStackScreenProps<
  AccountStackParamList,
  "PersonalDetails"
>;

const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({
  navigation,
}) => {
  const dummyData = {
    name: "FRED MAKOKHA",
    email: "wachiye25@gmail.com",
    phone: "254794711006",
  };

  return (
    <VStack style={styles.container}>
      <Box>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{dummyData.name}</Text>
      </Box>
      <Box>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{dummyData.email}</Text>
      </Box>
      <Box>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{dummyData.phone}</Text>
      </Box>

      <Button
        onPress={() => navigation.navigate("EditDetails", { ...dummyData })}
        bgColor={colors.primary}
        mt="$4"
      >
        <ButtonText>Edit Details</ButtonText>
      </Button>
    </VStack>
  );
};

export default PersonalDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: colors.medium,
  },
});
