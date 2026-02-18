import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Screen from "../app-components/Screen";
import colors from "../utils/colors";
import { useAuth } from "../context/AuthContext";
import {
  Project,
  Campaign,
  OverviewStackParamList,
  DashboardSummary,
  ActivityFeedItem,
} from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  Image,
  Pressable,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../utils/api";
import { getDashboardSummary, getRecentActivity } from "../services/dashboardService";

const { width } = Dimensions.get("window");

type Lang = "en" | "sw";

const GREETINGS: Record<Lang, { morning: string; afternoon: string; evening: string; welcome: string; date_locale: string }> = {
  en: { morning: "Good Morning", afternoon: "Good Afternoon", evening: "Good Evening", welcome: "Welcome back", date_locale: "en-US" },
  sw: { morning: "Habari za Asubuhi", afternoon: "Habari za Mchana", evening: "Habari za Jioni", welcome: "Karibu tena", date_locale: "sw-KE" },
};

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<OverviewStackParamList>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredCampaign, setFeaturedCampaign] = useState<Campaign | null>(null);
  const [lang, setLang] = useState<Lang>("en");

  const getGreeting = useCallback((): string => {
    const hour = new Date().getHours();
    const g = GREETINGS[lang];
    if (hour < 12) return g.morning;
    if (hour < 18) return g.afternoon;
    return g.evening;
  }, [lang]);

  const getDateString = useCallback((): string => {
    const locale = GREETINGS[lang].date_locale;
    return new Date().toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric" });
  }, [lang]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => (navigation as any).openDrawer()}
          style={{ marginLeft: 10 }}
        >
          <MaterialCommunityIcons name="menu" size={28} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchData = async () => {
    try {
      const [summaryData, activityData] = await Promise.all([
        getDashboardSummary(),
        getRecentActivity(),
      ]);

      setSummary(summaryData);
      setActivities(activityData);

      try {
        const projectsRes = await api.get("/featured-projects");
        setFeaturedProjects(projectsRes.data.projects || []);
      } catch (e) {
        console.log("Failed to fetch projects", e);
      }

      try {
        const campaignRes = await api.get("/monthly-campaign");
        setFeaturedCampaign(campaignRes.data.campaign || null);
      } catch (e) {
        console.log("Failed to fetch campaign", e);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const ActionButton = ({ title, icon, color, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.actionBtn}>
      <Box bg={color + "18"} p="$3" borderRadius={14} mb="$1">
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </Box>
      <Text size="2xs" textAlign="center" bold color="$coolGray700">{title}</Text>
    </TouchableOpacity>
  );

  const ActivityItem = ({ item }: { item: ActivityFeedItem }) => (
    <HStack space="md" alignItems="center" py="$3" borderBottomWidth={1} borderColor="$borderLight200">
      <Box bg={item.read ? "$coolGray100" : colors.primary + "15"} p="$2" borderRadius="$full">
        <MaterialCommunityIcons 
          name={item.type === 'payment' ? 'cash' : item.type === 'property' ? 'home' : 'bell'} 
          size={18} 
          color={item.read ? colors.medium : colors.primary} 
        />
      </Box>
      <VStack flex={1}>
        <Text bold size="sm" color={item.read ? "$coolGray600" : "$textDark"}>{item.title}</Text>
        <Text size="xs" numberOfLines={1} color="$coolGray500">{item.description}</Text>
      </VStack>
      <Text size="xs" color="$coolGray400">{new Date(item.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</Text>
    </HStack>
  );

  if (loading && !refreshing) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Welcome Section */}
        <Box px="$5" pt="$4" pb="$8" bg={colors.primary}>
          <HStack justifyContent="space-between" alignItems="flex-start">
            <VStack flex={1}>
              <Text color="$white" opacity={0.7} size="xs">
                {getDateString()}
              </Text>
              <Text color="$white" opacity={0.85} size="md" mt="$0.5">
                {getGreeting()},
              </Text>
              <Heading size="xl" color="$white" mt="$0.5" style={{ letterSpacing: -0.3 }}>
                {user?.name?.split(" ")[0] || "User"} 👋
              </Heading>
            </VStack>
            {/* Language Toggle */}
            <TouchableOpacity
              onPress={() => setLang(lang === "en" ? "sw" : "en")}
              style={{
                flexDirection: "row",
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 20,
                padding: 3,
                marginTop: 2,
              }}
            >
              <Box
                bg={lang === "en" ? "$white" : "transparent"}
                px="$2.5"
                py="$1"
                borderRadius={16}
              >
                <Text size="2xs" bold color={lang === "en" ? colors.primary : "$white"}>
                  EN
                </Text>
              </Box>
              <Box
                bg={lang === "sw" ? "$white" : "transparent"}
                px="$2.5"
                py="$1"
                borderRadius={16}
              >
                <Text size="2xs" bold color={lang === "sw" ? colors.primary : "$white"}>
                  SW
                </Text>
              </Box>
            </TouchableOpacity>
          </HStack>
        </Box>

        {/* Summary Stats Pills */}
        <Box px="$4" mt={-24}>
          <Card variant="elevated" p="$0" borderRadius={16} overflow="hidden">
            <HStack>
              {/* Properties Pill */}
              <TouchableOpacity style={[styles.statPill, { backgroundColor: colors.secondary }]} onPress={() => (navigation as any).navigate("PropertyNav")}>
                <MaterialCommunityIcons name="home-city" size={20} color="white" />
                <Text bold color="$white" size="lg" mt="$0.5">{summary?.totalProperties || 0}</Text>
                <Text color="$white" size="2xs" opacity={0.85}>Properties</Text>
              </TouchableOpacity>

              {/* Pending Pill */}
              <TouchableOpacity style={[styles.statPill, { backgroundColor: colors.danger }]} onPress={() => (navigation as any).navigate("Payments")}>
                <MaterialCommunityIcons name="clock-alert-outline" size={20} color="white" />
                <Text bold color="$white" size="lg" mt="$0.5">{summary?.paymentsDue || 0}</Text>
                <Text color="$white" size="2xs" opacity={0.85}>Pending</Text>
              </TouchableOpacity>

              {/* Wallet Balance Pill */}
              <TouchableOpacity style={[styles.statPill, { backgroundColor: "#fff" }]} onPress={() => (navigation as any).navigate("Wallet")}>
                <MaterialCommunityIcons name="wallet-outline" size={20} color={colors.primary} />
                <Text bold color={colors.primary} size="sm" mt="$0.5" numberOfLines={1}>
                  KES {((summary?.walletBalance || 0) / 1000).toFixed(0)}K
                </Text>
                <Text color={colors.secondary} size="2xs" bold>Top Up +</Text>
              </TouchableOpacity>
            </HStack>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Box px="$4" mt="$6">
          <Heading size="xs" mb="$3" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg">
            Quick Actions
          </Heading>
          <HStack justifyContent="space-between">
            <ActionButton 
              title="Pay Now" 
              icon="credit-card-outline" 
              color={colors.primary} 
              onPress={() => navigation.navigate("Payment Schedule" as never)} 
            />
            <ActionButton 
              title="Statements" 
              icon="file-document-outline" 
              color={colors.secondary} 
              onPress={() => (navigation as any).navigate("View Statements" as never)} 
            />
            <ActionButton 
              title="Properties" 
              icon="home-search-outline" 
              color={colors.primary} 
              onPress={() => (navigation as any).navigate("PropertyNav")} 
            />
            <ActionButton 
              title="Refer" 
              icon="account-group-outline" 
              color={colors.secondary} 
              onPress={() => (navigation as any).navigate("MainTabs", {screen: "Refer & Earn"})} 
            />
          </HStack>
        </Box>

        {/* Recent Activity Feed */}
        <Box px="$4" mt="$5">
          <HStack justifyContent="space-between" alignItems="center" mb="$3">
            <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg">
              Recent Activity
            </Heading>
            <TouchableOpacity>
              <Text color={colors.primary} size="xs" bold>View All</Text>
            </TouchableOpacity>
          </HStack>
          <Card variant="elevated" p="$0" borderRadius={14} overflow="hidden">
            <Box bg="$white" px="$4">
              {activities.length > 0 ? (
                activities.map((item) => (
                  <React.Fragment key={item.id}>
                    <ActivityItem item={item} />
                  </React.Fragment>
                ))
              ) : (
                <Text textAlign="center" color="$coolGray500" py="$6">No recent activity.</Text>
              )}
            </Box>
          </Card>
        </Box>

        {/* Featured Campaign Banner */}
        {featuredCampaign && (
          <Box px="$4" mt="$6" mb="$6">
            <Heading size="xs" mb="$3" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg">
              Special Offer
            </Heading>
            <Pressable onPress={() => Linking.openURL(featuredCampaign.link)}>
              <Card p="$0" overflow="hidden" borderRadius={14}>
                <Box>
                  <Image 
                    source={{ uri: featuredCampaign.banner_image_url }} 
                    alt={featuredCampaign.title}
                    w="$full"
                    h={150}
                    resizeMode="cover"
                  />
                  <Box position="absolute" bottom={0} left={0} right={0} bg="rgba(0,0,0,0.55)" p="$3">
                    <Text color="$white" bold>{featuredCampaign.title}</Text>
                  </Box>
                </Box>
              </Card>
            </Pressable>
          </Box>
        )}

      </ScrollView>
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statPill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  actionBtn: {
    width: (width - 48) / 4,
    alignItems: "center",
  },
});
