import React from "react";
import { StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Screen from "../components/Screen";
import { Box, Center, Pressable, Text } from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../utils/colors";

type HomeScreenProps = {
  navigation: NavigationProp<any>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <Screen style={styles.container}>
      <Center>
        <Text my="$4" bold size="lg">
          Good morning, Kasili
        </Text>
        {/* Todo: modularize these components */}
        <Box flexDirection="row">
          <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            w="$20"
          >
            <Pressable
              onPress={() => navigation.navigate("Payment Schedule")}
              h="$16"
              w="$16"
              bg="$green700"
              borderRadius="$full"
              alignItems="center"
              justifyContent="center"
            >
              <MaterialCommunityIcons name="calendar" size={24} color="white" />
            </Pressable>
            <Text bold size="xs" textAlign="center" lineHeight={14} mt="$1">
              Payment Schedule
            </Text>
          </Box>
          <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            w="$20"
          >
            <Pressable
              onPress={() => navigation.navigate("View Receipts")}
              h="$16"
              w="$16"
              bg="$green700"
              borderRadius="$full"
              alignItems="center"
              justifyContent="center"
            >
              <MaterialCommunityIcons name="receipt" size={24} color="white" />
            </Pressable>
            <Text bold size="xs" textAlign="center" lineHeight={14} mt="$1">
              View My Receipts
            </Text>
          </Box>
          <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            w="$20"
          >
            <Pressable
              onPress={() => navigation.navigate("Sales Agreement")}
              h="$16"
              w="$16"
              bg="$green700"
              borderRadius="$full"
              alignItems="center"
              justifyContent="center"
            >
              <MaterialCommunityIcons
                name="handshake-outline"
                size={24}
                color="white"
              />
            </Pressable>
            <Text bold size="xs" textAlign="center" lineHeight={14} mt="$1">
              Sales Agreement
            </Text>
          </Box>
          <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            w="$20"
          >
            <Pressable
              onPress={() => navigation.navigate("View Statements")}
              h="$16"
              w="$16"
              bg="$green700"
              borderRadius="$full"
              alignItems="center"
              justifyContent="center"
            >
              <MaterialCommunityIcons name="history" size={24} color="white" />
            </Pressable>
            <Text bold size="xs" textAlign="center" lineHeight={14} mt="$1">
              View Statements
            </Text>
          </Box>
        </Box>
      </Center>
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: colors.light,
  },
  menuItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
