import React from "react";
import { StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Screen from "../components/Screen";
import {
  Box,
  Button,
  ButtonText,
  Center,
  Heading,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../utils/colors";

type HomeScreenProps = {
  navigation: NavigationProp<any>;
};

const user: any = {
  fullnames: "Kasili",
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
  return (
    <Screen style={styles.container}>
      <Center>
        <Heading my="$4">{`${getGreeting()}, ${user.fullnames}`}</Heading>
        <Box flexDirection="row" justifyContent="space-around" w="90%" mb="$4">
          {[
            {
              label: "Payment Schedule",
              icon: "calendar",
              route: "Payment Schedule",
            },
            {
              label: "View My Receipts",
              icon: "receipt",
              route: "View Receipts",
            },
            {
              label: "Sales Agreement",
              icon: "handshake-outline",
              route: "Sales Agreement",
            },
            {
              label: "View Statements",
              icon: "history",
              route: "View Statements",
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
        {/* Advertisement Section */}
        <Box
          w="90%"
          bg="$darkBlue800"
          padding="$6"
          my="$6"
          alignItems="center"
          borderRadius="$2xl"
        >
          <Text size="2xl" bold color={colors.white} mb="$3">
            Get more Information about your Properties!
          </Text>
          <Text size="md" color={colors.white} mb="$4">
            Get in-depth info about the status of your property, titles, etc.
          </Text>
          <Button
            size="lg"
            variant="outline"
            action="primary"
            onPress={() => console.log("Explore Offers")}
            borderRadius="$lg"
            paddingHorizontal="$10"
          >
            <ButtonText color={colors.white}>Explore Now</ButtonText>
          </Button>
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
