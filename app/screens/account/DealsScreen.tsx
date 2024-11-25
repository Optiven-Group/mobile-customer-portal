import React from "react";
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Linking,
} from "react-native";
import Screen from "../../app-components/Screen";
import {
  Button,
  Divider,
  Image,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useMembership } from "../../context/MembershipContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountStackParamList } from "../../navigation/types";
import colors from "../../utils/colors";

const { width } = Dimensions.get("window");

type DealsScreenProps = NativeStackScreenProps<AccountStackParamList, "Deals">;

const DealsScreen: React.FC<DealsScreenProps> = ({ navigation }) => {
  const { membershipTier } = useMembership();

  // Define discount based on membership tier
  const getDiscount = (tier: string): number => {
    switch (tier) {
      case "Platinum":
        return 10;
      case "Gold":
        return 7;
      case "Silver":
        return 5;
      case "Bronze":
        return 3;
      case "Sapphire":
        return 0;
      default:
        return 0;
    }
  };

  const discount = getDiscount(membershipTier);

  // Helper function to determine if discount messages should be shown
  const shouldShowDiscount = discount > 0;

  // Function to handle opening Optiven's website
  const handleViewProperties = async () => {
    const url = "https://www.optiven.co.ke";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Unable to open the website.");
    }
  };

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.dealsList}>
        {/* Property Deal Card */}
        <Pressable style={styles.dealCard} padding="$2">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1542430429-58de68cd873e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={styles.dealImage}
            alt="Property Deal"
          />
          <VStack px={4} py={2}>
            {shouldShowDiscount ? (
              <>
                <Text bold size="lg" mt="$2">
                  Get {discount}% off your next Optiven Property!
                </Text>
                <Text mt="$1">
                  Invest in your dream property with a {discount}% discount as a{" "}
                  {membershipTier} member.
                </Text>
              </>
            ) : (
              <>
                <Text bold size="lg" mt="$2">
                  Exclusive Property Deals
                </Text>
                <Text mt="$1">
                  Enjoy exclusive property deals and discounts by upgrading your
                  membership.
                </Text>
              </>
            )}
            <Button
              size="sm"
              variant="link"
              action="positive"
              isDisabled={false}
              isFocusVisible={false}
              justifyContent="flex-start"
              onPress={handleViewProperties}
            >
              <Text color={colors.primary}>View Properties</Text>
            </Button>
          </VStack>
        </Pressable>

        <Divider
          style={{ backgroundColor: colors.light, height: 1 }}
        />

        {/* Hospitality Deal Card */}
        <Pressable style={styles.dealCard} padding="$2">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1552604617-eea98aa27234?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={styles.dealImage}
            alt="Hospitality Deal"
          />
          <VStack px={4} py={2}>
            {shouldShowDiscount ? (
              <>
                <Text bold size="lg" mt="$2">
                  Enjoy {discount}% Off Hospitality Services
                </Text>
                <Text mt="$1">
                  Take advantage of {discount}% off our hospitality services,
                  available exclusively for {membershipTier} members.
                </Text>
              </>
            ) : (
              <>
                <Text bold size="lg" mt="$2">
                  Exclusive Hospitality Services
                </Text>
                <Text mt="$1">
                  Upgrade your membership to enjoy exclusive hospitality
                  services and discounts.
                </Text>
              </>
            )}
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
    alignItems: "center",
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
  },
  dealImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
});
