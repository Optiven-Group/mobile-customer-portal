import React from "react";
import { ScrollView, StyleSheet, Share, Image } from "react-native";
import {
  Box,
  Button,
  ButtonText,
  VStack,
  Text,
  Heading,
} from "@gluestack-ui/themed";
import colors from "../../utils/colors";

const PropertyDetailsScreen: React.FC = () => {
  const property = {
    id: 1,
    image: {
      uri: "https://www.optiven.co.ke/wp-content/uploads/2024/08/JL-DOTTED-copy.jpg",
    },
    title: "Joy Lovers Club – Malindi ⭐⭐⭐⭐⭐",
    price: "Starting at Ksh 3,950,000",
    description:
      "Joy lovers club is in Malindi Town along Mtangani Road and only 100M from the famous Mwembe Resort. Better referred to as the “Muthaiga of Malindi“, this high-end, luxurious gated community is your ticket to a life of pure opulence on the African-Kenyan coast.",
    amenities: [
      "Prime Location: Only 1.6km away from the Indian Ocean",
      "Beautiful gates to welcome you home",
      "Water on every plot",
      "A secure perimeter wall",
      "Guarded security on-site for your peace of mind",
      "Solar street lights for safe, well-lit streets",
      "Caretaker on-site, an environment specialist",
      "Cabro roads for smooth transportation",
      "Beautiful flowers and selected trees lining the streets",
    ],
    localArea: [
      "Luxurious Lifestyle - With high-end beach resorts and amenities within 2km radius",
      "Malindi International Airport",
      "Afya International Hospital",
      "Mwembe Resort",
      "Malindi Premier School for your family’s convenience",
      "La Malindina Italian restaurant, just 3 minutes away",
      "Malindi Town is a mere 3.2km away for all your urban needs",
    ],
    investment: [
      "Cash 30 days – KSh 3,950,000",
      "Deposit – KSh 1,000,000",
      "3 months Instalment – KSh 4,055,000",
      "6 months – KSh 4,160,000",
      "12 months – KSh 4,370,000",
      "Prices in 3, 6, and 12 Months are inclusive of deposit placed.",
      "Bank Financing Available",
    ],
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out Joy Lovers Club – Malindi from Optiven Limited. Starting at ${property.price}. Visit ${property.image.uri} for more details.`,
      });
      if (result.action === Share.sharedAction) {
        // Shared successfully
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={property.image} style={styles.image} />
      <VStack padding="$4" space="md">
        <Heading style={styles.title}>{property.title}</Heading>
        <Text style={styles.price}>{property.price}</Text>
        <Text style={styles.description}>{property.description}</Text>

        {/* Amenities */}
        <Heading size="md" mt="$4">
          Unmatched Amenities at Joy Lovers Club – Malindi
        </Heading>
        <VStack space="sm" mt="$2">
          {property.amenities.map((amenity, index) => (
            <Text key={index} style={styles.listItem}>
              • {amenity}
            </Text>
          ))}
        </VStack>

        {/* Local Area */}
        <Heading size="md" mt="$4">
          Your Local Area
        </Heading>
        <VStack space="sm" mt="$2">
          {property.localArea.map((item, index) => (
            <Text key={index} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </VStack>

        {/* Investment Options */}
        <Heading size="md" mt="$4">
          Investment – 1/8th Acre Plots
        </Heading>
        <VStack space="sm" mt="$2">
          {property.investment.map((item, index) => (
            <Text key={index} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </VStack>

        {/* Share Refer Link */}
        <Button
          size="md"
          variant="solid"
          action="primary"
          bgColor={colors.primary}
          onPress={handleShare}
          borderRadius="$md"
          mt="$6"
        >
          <ButtonText>Refer & Get a Discount</ButtonText>
        </Button>

        {/* Contact Agent Button */}
        <Button
          size="md"
          variant="outline"
          action="primary"
          onPress={() => console.log("Contact Agent")}
          borderRadius="$md"
        >
          <ButtonText>Contact</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default PropertyDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  image: {
    width: "100%",
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.dark,
  },
  price: {
    fontSize: 20,
    color: colors.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.medium,
  },
  listItem: {
    fontSize: 16,
    color: colors.dark,
  },
});
