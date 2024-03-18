import React from "react";
import { StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Screen from "../components/Screen";
import {
  Box,
  Center,
  Heading,
  Image,
  Pressable,
  Text,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../utils/colors";

type HomeScreenProps = {
  navigation: NavigationProp<any>;
};

const user: any = {
  fullnames: "Kasili Wachiye",
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <Screen style={styles.container}>
      <Center>
        <Heading my="$4">Good morning, Kasili</Heading>
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
        <Box
          w="$4/5"
          borderColor="$borderLight100"
          borderRadius="$xl"
          borderWidth="$1"
          my="$8"
          overflow="hidden"
        >
          <Image
            h={200}
            w="$full"
            source={{
              uri: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1770&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            alt="home-image"
          />
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
