import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Linking,
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
const isTablet = width >= 768;

const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "Good morning";
  if (currentHour < 18) return "Good afternoon";
  return "Good evening";
};

const getFirstName = (name: string) => name.split(" ")[0];

const Greeting: React.FC<{ name: string }> = ({ name }) => (
  <Heading
    my={isTablet ? "$6" : "$4"}
    textAlign="center"
    style={styles.greetingHeading}
  >
    {`${getGreeting()}, ${getFirstName(name)}`}
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
    const fetchProjects = async () => {
      try {
        const response = await api.get("/featured-projects");
        const projects = response.data.projects;
        if (projects.length > 0) {
          setCampaigns(projects); // Set to the full array of projects
        } else {
          setCampaigns([]); // Handle case when there are no featured projects
        }
      } catch (error) {
        console.error("Failed to fetch featured projects:", error);
        setCampaigns([]); // Ensure campaigns is an empty array on error
      }
    };

    const fetchFeaturedCampaign = async () => {
      try {
        const response = await api.get("/monthly-campaign");
        setFeaturedCampaign(response.data.campaign);
        setFeaturedError(null);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setFeaturedError("No featured campaigns at the moment.");
        } else {
          setFeaturedError("Failed to fetch featured campaign.");
        }
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchProjects();
    fetchFeaturedCampaign();
  }, []);

  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Center>
          <Box bgColor={colors.light}>
            <Greeting name={user?.name || "User"} />

            <Box
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="space-between"
              w="100%"
              mb="$6"
              paddingHorizontal="10%"
              borderRadius={20}
            >
              {[
                {
                  label: "Payment Schedule",
                  icon: "calendar",
                  route: "Project Selection for Payment",
                },
                {
                  label: "View Receipts",
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
                  w="22%"
                  mb={isTablet ? "$6" : "$4"}
                >
                  <Pressable
                    onPress={() => navigation.navigate(item.route)}
                    style={styles.quickActionButton}
                  >
                    <MaterialCommunityIcons
                      name={
                        item.icon as keyof typeof MaterialCommunityIcons.glyphMap
                      }
                      size={isTablet ? 40 : 30}
                      color="white"
                    />
                  </Pressable>
                  <Text style={styles.quickActionLabel}>{item.label}</Text>
                </VStack>
              ))}
            </Box>
          </Box>

          <Heading size="md" my="$4" textAlign="center">
            Featured Campaign
          </Heading>

          {loadingFeatured ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : featuredError ? (
            <Text style={styles.errorText}>{featuredError}</Text>
          ) : (
            featuredCampaign && (
              <Pressable onPress={() => openURL(featuredCampaign.link)}>
                <Box style={styles.campaignCard}>
                  <Image
                    source={{ uri: featuredCampaign.banner_image_url }}
                    style={styles.campaignImage}
                    alt={`${featuredCampaign.title} image`}
                  />
                </Box>
              </Pressable>
            )
          )}

          <Heading size="md" mb="$6" textAlign="center">
            Featured Properties
          </Heading>

          {campaigns.length > 0 ? (
            <Carousel
              loop
              width={width * 0.9}
              height={isTablet ? width * 0.5 : width * 0.6}
              autoPlay
              data={campaigns}
              scrollAnimationDuration={1000}
              renderItem={({ item }: { item: Project }) => (
                <Pressable
                  key={item.project_id}
                  style={styles.campaignCard}
                  onPress={() => openURL(item.website_link)}
                >
                  <Image
                    source={{ uri: item.banner }}
                    style={styles.campaignImage}
                    alt={`${item.name} image`}
                  />
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
  },
  greetingHeading: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: "500",
  },
  quickActionButton: {
    height: isTablet ? 80 : 60,
    width: isTablet ? 80 : 60,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  quickActionLabel: {
    marginTop: 8,
    fontSize: isTablet ? 16 : 12,
    textAlign: "center",
    color: colors.secondary,
    fontWeight: "600",
  },
  campaignCard: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    width: width * 0.9,
    marginBottom: 20,
  },
  campaignImage: {
    width: "100%",
    height: isTablet ? width * 0.5 : width * 0.6,
    resizeMode: "cover",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  noCampaignsText: {
    fontSize: isTablet ? 16 : 14,
    color: colors.secondary,
    marginTop: 10,
  },
});
