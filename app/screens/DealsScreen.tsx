import React from "react";
import { StyleSheet, ScrollView, Dimensions } from "react-native";
import Screen from "../app-components/Screen";
import { Button, Image, Pressable, Text, VStack } from "@gluestack-ui/themed";
import { NavigationProp } from "@react-navigation/native";
import colors from "../utils/colors";
import { ButtonText } from "@gluestack-ui/themed";

const { width } = Dimensions.get("window");

type DealsScreenProps = {
  navigation: NavigationProp<any>;
};

const DealsScreen: React.FC<DealsScreenProps> = ({ navigation }) => {
  // Hardcoding the membership tier and discount for now
  const userTier = "Gold";
  const discount = 7; // Hardcoded 7% discount for this version

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.dealsList}>
        {/* Property Deal Card */}
        <Pressable
          style={styles.dealCard}
          onPress={() =>
            navigation.navigate("Refer", {
              screen: "ReferSomeone",
              params: { project: { name: "Next Property" } },
            })
          }
          padding="$2"
        >
          <Image
            source="https://images.unsplash.com/photo-1542430429-58de68cd873e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            style={styles.dealImage}
            alt="Property Deal"
          />
          <VStack px={4} py={2}>
            <Text bold size="lg" mt="$2">
              Get {discount}% off your next Optiven Property!
            </Text>
            <Text mt="$1">
              Invest in your dream property with a {discount}% discount as a
              Gold member.
            </Text>
            <Button
              size="sm"
              variant="link"
              action="positive"
              isDisabled={false}
              isFocusVisible={false}
              justifyContent="flex-start"
            >
              <ButtonText>View Properties</ButtonText>
            </Button>
          </VStack>
        </Pressable>

        {/* Hospitality Deal Card */}
        <Pressable
          style={styles.dealCard}
          onPress={() =>
            navigation.navigate("Refer", {
              screen: "ReferSomeone",
              params: { project: { name: "Hospitality Deal" } },
            })
          }
          padding="$2"
        >
          <Image
            source="https://images.unsplash.com/photo-1552604617-eea98aa27234?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            style={styles.dealImage}
            alt="Hospitality Deal"
          />
          <VStack px={4} py={2}>
            <Text bold size="lg" mt="$2">
              Enjoy {discount}% Off Hospitality Services
            </Text>
            <Text mt="$1">
              Take advantage of {discount}% off our hospitality services,
              available exclusively for Gold members.
            </Text>
          </VStack>
        </Pressable>
      </ScrollView>
    </Screen>
  );
};

export default DealsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
  },
  dealsList: {
    paddingBottom: 20,
  },
  dealCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginVertical: 12,
    width: width * 0.9,
    alignSelf: "center",
  },
  dealImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
