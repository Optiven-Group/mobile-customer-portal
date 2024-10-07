import React from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Screen from "../app-components/Screen";
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

const properties = [
  {
    id: 1,
    image: {
      uri: "https://www.optiven.co.ke/wp-content/uploads/2024/08/JL-DOTTED-copy.jpg",
    },
    title: "Joy Lovers Club",
    description:
      "Joy lovers club is in Malindi Town along Mtangani Road and only 100M from the famous Mwembe Resort. Better referred to as the “Muthaiga of Malindi“, this high-end, luxurious gated community is your ticket to a life of pure opulence on the African-Kenyan coast.",
    price: "Starting at Ksh 3,950,000",
  },
  {
    id: 2,
    image: {
      uri: "https://www.optiven.co.ke/wp-content/uploads/2024/06/achievers-paradise-Ngong3-1-600x514.jpeg",
    },
    title: "Achievers’ Paradise - Ngong, Kimuka Phase 2",
    description: "Elevated plots with breathtaking views.",
    price: "Starting at Ksh 1,995,000",
  },
  {
    id: 3,
    image: {
      uri: "https://www.optiven.co.ke/wp-content/uploads/2024/02/ocean-view-ridge.jpeg",
    },
    title: "Ocean View Ridge - Vipingo",
    description:
      "Nestled just 2.4km from the Mombasa-Malindi Road Ocean View Ridge Vipingo is where your dreams meet the ocean. With the shoreline a mere 4.5km away, your new home is a gateway to the serene beauty of the coast. Whether you’re looking for a dream home, retirement haven, or a holiday escape, Ocean View Ridge Vipingo is where life becomes pure luxury, and the coast unfolds endless joy.",
    price: "Starting at Ksh 2,750,000",
  },
  // Add more properties as needed
];

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

      {/* Scrollable Property Feed */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Property Feed Section */}
        <Box w="90%" mt="$4">
          <Heading size="lg" mb="$4">
            Featured Properties
          </Heading>
          {properties.map((property) => (
            <Box key={property.id} style={styles.propertyCard}>
              <Image source={property.image} style={styles.propertyImage} />
              <VStack space="md" padding="$3">
                <Text bold size="md">
                  {property.title}
                </Text>
                <Text size="sm" color={colors.medium}>
                  {property.description.length > 100
                    ? property.description.substring(0, 100) + "..."
                    : property.description}
                </Text>
                <Text bold size="lg" color={colors.primary}>
                  {property.price}
                </Text>
                <Button
                  size="sm"
                  variant="solid"
                  action="primary"
                  bgColor={colors.primary}
                  onPress={() =>
                    navigation.navigate("PropertyDetails", {
                      propertyId: property.id,
                    })
                  }
                  borderRadius="$md"
                  mt="$2"
                >
                  <ButtonText>View Details</ButtonText>
                </Button>
              </VStack>
            </Box>
          ))}
        </Box>
      </ScrollView>
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
