import React from "react";
import { StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Screen from "../app-components/Screen";
import {
  Box,
  Center,
  Heading,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../utils/colors";
import { useAuth } from "../context/AuthContext";

type HomeScreenProps = {
  navigation: NavigationProp<any>;
};

const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <Screen style={styles.container}>
      <Center>
        {/* Top Section */}
        <Heading my="$4" textAlign="center">{`${getGreeting()}, ${
          user?.name || "User"
        }`}</Heading>

        {/* Navigable Touchables */}
        <Box flexDirection="row" justifyContent="space-around" w="90%" mb="$4">
          {[
            {
              label: "Payment Schedule",
              icon: "calendar",
              route: "Project Selection for Payment",
            },
            {
              label: "View My Receipts",
              icon: "receipt",
              route: "Project Selection",
            },
            {
              label: "Sales Agreement",
              icon: "handshake-outline",
              route: "Sales Agreement",
            },
            {
              label: "View Statements",
              icon: "history",
              route: "Project Selection for Statements",
            },
          ].map((item) => (
            <VStack
              key={item.label}
              alignItems="center"
              justifyContent="center"
              w="$20"
            >
              <Pressable
                onPress={() => navigation.navigate(item.route)}
                h="$16"
                w="$16"
                bg="$green700"
                borderRadius="$full"
                alignItems="center"
                justifyContent="center"
              >
                <MaterialCommunityIcons
                  name={
                    item.icon as keyof typeof MaterialCommunityIcons.glyphMap
                  }
                  size={24}
                  color="white"
                />
              </Pressable>
              <Text bold size="xs" textAlign="center" lineHeight={14} mt="$1">
                {item.label}
              </Text>
            </VStack>
          ))}
        </Box>
      </Center>
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollViewContent: {
    alignItems: "center",
    paddingBottom: 100,
  },
  propertyCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  propertyImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
});
