import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
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
import { Project } from "../navigation/types";
import Carousel from "react-native-reanimated-carousel";

type HomeScreenProps = {
  navigation: NavigationProp<any>;
};

const { width } = Dimensions.get("window");

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
  const [campaigns, setCampaigns] = useState<Project[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get("/featured-projects");
        setCampaigns(response.data.projects);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <Screen style={styles.container}>
      <ScrollView>
        <Center>
          {/* Top Section */}
          <Heading my="$4" textAlign="center">{`${getGreeting()}, ${
            user?.name || "User"
          }`}</Heading>

          {/* Navigable Touchables */}
          <Box
            flexDirection="row"
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

          {/* Monthly Campaign Section */}
          <Heading size="md" my="$4" textAlign="center">
            Ongoing Monthly Campaign
          </Heading>
          <Box style={styles.campaignCard}>
            <Image
              source={require("../../assets/app-images/optiven-at-25.jpeg")}
              width={width}
              height={320}
              alt={`optiven at 25 image`}
            />
          </Box>

          <Heading my="$4" textAlign="left">
            Featured Properties
          </Heading>

          {/* Campaigns Carousel */}
          {campaigns.length > 0 ? (
            <Carousel
              loop
              width={width}
              height={280}
              autoPlay={true}
              data={campaigns}
              scrollAnimationDuration={1000}
              renderItem={({ item }: { item: Project }) => (
                <Pressable style={styles.campaignCard}>
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
            <Text>No campaigns available at the moment.</Text>
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
  campaignCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    width: width * 0.9,
    alignSelf: "center",
  },
  campaignImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
  },
});
