import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Screen from "../app-components/Screen";
import {
  Box,
  Center,
  Heading,
  Image,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../utils/colors";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { Project, Campaign } from "../navigation/types";
import Carousel from "react-native-reanimated-carousel";

type HomeScreenProps = {
  navigation: NavigationProp<any>;
};

const { width } = Dimensions.get("window");

// Utility function to get greeting based on the time of day
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

// Separate Greeting Component for better readability
const Greeting: React.FC<{ name: string }> = ({ name }) => (
  <Heading
    my="$4"
    textAlign="center"
    numberOfLines={2} // Allow up to 2 lines for long names
    adjustsFontSizeToFit // Adjust font size to fit the container
    style={styles.greetingHeading}
  >
    {`${getGreeting()}, ${name}`}
  </Heading>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Project[]>([]);
  const [featuredCampaign, setFeaturedCampaign] = useState<Campaign | null>(
    null
  );
  const [loadingFeatured, setLoadingFeatured] = useState<boolean>(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get("/featured-projects");
        setCampaigns(response.data.projects);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };

    const fetchFeaturedCampaign = async () => {
      try {
        const response = await api.get("/monthly-campaign");
        setFeaturedCampaign(response.data.campaign);
        setFeaturedError(null);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          setFeaturedError("No featured campaigns at the moment.");
        } else {
          setFeaturedError("Failed to fetch featured campaign.");
        }
        console.error("Failed to fetch featured campaign:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchCampaigns();
    fetchFeaturedCampaign();
  }, []);

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Center>
          {/* Greeting Section */}
          <Greeting name={user?.name || "User"} />

          {/* Quick Actions */}
          <Box
            flexDirection="row"
            flexWrap="wrap" // Allow wrapping for better responsiveness
            justifyContent="space-around"
            w="90%"
            mb="$4"
          >
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
                label: "Payment Progress",
                icon: "progress-check",
                route: "Payment Progress",
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
                w="20%"
                mb="$4" // Add margin bottom for better spacing on wrap
              >
                <Pressable
                  onPress={() => navigation.navigate(item.route)}
                  h="$16"
                  w="$16"
                  bg="$green700"
                  borderRadius="$full"
                  alignItems="center"
                  justifyContent="center"
                  style={styles.quickActionButton}
                >
                  <MaterialCommunityIcons
                    name={
                      item.icon as keyof typeof MaterialCommunityIcons.glyphMap
                    }
                    size={24}
                    color="white"
                  />
                </Pressable>
                <Text
                  bold
                  size="xs"
                  textAlign="center"
                  lineHeight={14}
                  mt="$1"
                  style={styles.quickActionLabel}
                >
                  {item.label}
                </Text>
              </VStack>
            ))}
          </Box>

          {/* Featured Campaign Section */}
          <Heading size="md" my="$4" textAlign="center">
            Featured Campaign
          </Heading>

          {loadingFeatured ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : featuredError ? (
            <Text color="red.500" textAlign="center" mb="$4">
              {featuredError}
            </Text>
          ) : (
            featuredCampaign && (
              <Box key={featuredCampaign.id} style={styles.campaignCard}>
                <Image
                  source={{ uri: featuredCampaign.banner_image_url }}
                  width={width * 0.9} // Adjust width for better spacing
                  height={320}
                  alt={`${featuredCampaign.title} image`}
                  style={styles.campaignImage}
                />
                <Box
                  position="absolute"
                  bottom={10}
                  left={15}
                  right={15}
                  bg="rgba(0,0,0,0.6)" // Increased opacity for better readability
                  p={5}
                  borderRadius={8}
                >
                  <Text color="white" bold size="lg" style={styles.campaignTitle}>
                    {featuredCampaign.title}
                  </Text>
                  <Text color="white" size="sm" style={styles.campaignDescription}>
                    {featuredCampaign.description}
                  </Text>
                </Box>
              </Box>
            )
          )}

          {/* Featured Properties Section */}
          <Heading my="$4" textAlign="left" style={styles.featuredPropertiesHeading}>
            Featured Properties
          </Heading>

          {campaigns.length > 0 ? (
            <Carousel
              loop
              width={width * 0.9} // Adjust width for better spacing
              height={280}
              autoPlay={true}
              data={campaigns}
              scrollAnimationDuration={1000}
              renderItem={({ item }: { item: Project }) => (
                <Pressable key={item.project_id} style={styles.campaignCard}>
                  {item.banner && (
                    <Image
                      source={{ uri: item.banner }}
                      style={styles.campaignImage}
                      alt={`${item.name} image`}
                    />
                  )}
                </Pressable>
              )}
            />
          ) : (
            <Text style={styles.noCampaignsText}>
              No campaigns available at the moment.
            </Text>
          )}
        </Center>
      </ScrollView>
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  greetingHeading: {
    fontSize: 24, // Increased font size
    fontWeight: "700", // Bolder text
    color: colors.textPrimary, // Use a defined text color
    paddingHorizontal: 10, // Add padding to prevent text from touching edges
  },
  quickActionButton: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Add shadow for better visual depth
  },
  quickActionLabel: {
    fontSize: 12,
    color: colors.secondary, // Use a secondary text color
  },
  campaignCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    width: width * 0.9,
    alignSelf: "center",
    marginBottom: 20,
  },
  campaignImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
  },
  campaignTitle: {
    fontSize: 20,
    marginBottom: 5,
  },
  campaignDescription: {
    fontSize: 14,
  },
  featuredPropertiesHeading: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  noCampaignsText: {
    fontSize: 16,
    color: colors.secondary,
    marginTop: 10,
  },
});
