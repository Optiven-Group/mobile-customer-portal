import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  RefreshControl,
  Animated,
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

// 10 languages with time-of-day greetings
const LANGUAGES = [
  { code: "en", morning: "Good Morning", afternoon: "Good Afternoon", evening: "Good Evening", flag: "🇬🇧" },
  { code: "sw", morning: "Habari za Asubuhi", afternoon: "Habari za Mchana", evening: "Habari za Jioni", flag: "🇰🇪" },
  { code: "fr", morning: "Bonjour", afternoon: "Bon après-midi", evening: "Bonsoir", flag: "🇫🇷" },
  { code: "es", morning: "Buenos Días", afternoon: "Buenas Tardes", evening: "Buenas Noches", flag: "🇪🇸" },
  { code: "ar", morning: "صباح الخير", afternoon: "مساء الخير", evening: "مساء الخير", flag: "🇸🇦" },
  { code: "zh", morning: "早上好", afternoon: "下午好", evening: "晚上好", flag: "🇨🇳" },
  { code: "pt", morning: "Bom Dia", afternoon: "Boa Tarde", evening: "Boa Noite", flag: "🇧🇷" },
  { code: "de", morning: "Guten Morgen", afternoon: "Guten Tag", evening: "Guten Abend", flag: "🇩🇪" },
  { code: "ja", morning: "おはようございます", afternoon: "こんにちは", evening: "こんばんは", flag: "🇯🇵" },
  { code: "hi", morning: "सुप्रभात", afternoon: "नमस्ते", evening: "शुभ संध्या", flag: "🇮🇳" },
];

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<OverviewStackParamList>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredCampaign, setFeaturedCampaign] = useState<Campaign | null>(null);
  const [langIndex, setLangIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-cycle languages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setLangIndex((prev) => (prev + 1) % LANGUAGES.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = useCallback((): string => {
    const hour = new Date().getHours();
    const lang = LANGUAGES[langIndex];
    if (hour < 12) return lang.morning;
    if (hour < 18) return lang.afternoon;
    return lang.evening;
  }, [langIndex]);

  const getDateString = useCallback((): string => {
    return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => (navigation as any).openDrawer()}
          style={{ marginLeft: 10 }}
        >
          <MaterialCommunityIcons name="menu" size={28} color={colors.primary} />
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

  const ActionButton = ({ title, icon, color, onPress, isNew = false }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.actionBtn}>
      <Box bg="#2C2D35" p="$3" borderRadius={14} mb="$1" position="relative">
        <MaterialCommunityIcons name={icon} size={24} color={color} />
        {isNew && (
          <Box position="absolute" top={-4} right={-4} bg={colors.danger} w={10} h={10} borderRadius={5} />
        )}
      </Box>
      <Text size="2xs" textAlign="center" bold color="#E5E7EB">{title}</Text>
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
        <Box px="$5" pt="$6" pb="$6" bg={colors.primary}>
          <Text color="#E5E7EB" size="xs">
            {getDateString()}
          </Text>
          <HStack alignItems="center" justifyContent="space-between" mt="$1">
            <Animated.View style={{ opacity: fadeAnim }}>
              <HStack alignItems="center" space="xs">
                <Text style={{ fontSize: 16 }}>{LANGUAGES[langIndex].flag}</Text>
                <Text color="#E5E7EB" size="md">
                  {getGreeting()},
                </Text>
              </HStack>
            </Animated.View>
            <HStack space="md">
              
              <TouchableOpacity onPress={() => (navigation as any).navigate("Profile")}>
                <Box bg="#2C2D35" p="$2" borderRadius="$full">
                  <MaterialCommunityIcons name="account-outline" size={20} color="#4CAF50" />
                </Box>
              </TouchableOpacity>
            </HStack>
          </HStack>
          <Heading size="xl" color="#FFFFFF" mt="$1" style={{ letterSpacing: -0.3 }}>
            {user?.name?.split(" ")[0] || "User"} 👋
          </Heading>
        </Box>

        {/* Summary Stats Cards - Swipeable */}
        <Box mt="$4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {/* Properties Card */}
            <TouchableOpacity style={[styles.darkCard, { width: width * 0.42, marginRight: 16 }]} onPress={() => (navigation as any).navigate("PropertyNav")}>
              <Text color="#4CAF50" size="xs" bold mb="$1">My Properties</Text>
              <HStack alignItems="baseline" space="xs" mb="$3">
                <Text color="#FFFFFF" size="2xl" bold>{summary?.totalProperties || 0}</Text>
                <MaterialCommunityIcons name="home-city-outline" size={16} color="#9CA3AF" />
              </HStack>
              <Box borderWidth={1} borderColor="#374151" borderRadius={8} py="$1.5" px="$3" alignItems="center">
                <Text color="#4CAF50" size="xs">View All</Text>
              </Box>
            </TouchableOpacity>

            {/* Wallet Balance Card */}
            <TouchableOpacity style={[styles.darkCard, { width: width * 0.42, borderLeftWidth: 2, borderLeftColor: "#3B82F6", marginRight: 16 }]} onPress={() => (navigation as any).navigate("Wallet")}>
              <HStack justifyContent="space-between" alignItems="center" mb="$1">
                <Text color="#4CAF50" size="xs" bold>Wallet</Text>
                {summary?.paymentsDue ? <MaterialCommunityIcons name="alert-circle" size={14} color="#F59E0B" /> : null}
              </HStack>
              <Text color="#FFFFFF" size="xl" bold mb="$3" numberOfLines={1}>
                KES {((summary?.walletBalance || 0) / 1000).toFixed(0)}K
              </Text>
              <Box borderWidth={1} borderColor="#374151" borderRadius={8} py="$1.5" px="$3" alignItems="center">
                <Text color="#4CAF50" size="xs">Top Up</Text>
              </Box>
            </TouchableOpacity>

            {/* Placeholder Card (Optional 3rd swipeable item) */}
            <TouchableOpacity style={[styles.darkCard, { width: width * 0.42, borderLeftWidth: 2, borderLeftColor: "#F59E0B" }]} onPress={() => (navigation as any).navigate("MainTabs", {screen: "Refer & Earn"})}>
              <Text color="#4CAF50" size="xs" bold mb="$1">Referrals</Text>
              <HStack alignItems="baseline" space="xs" mb="$3">
                <Text color="#FFFFFF" size="2xl" bold>0</Text>
                <MaterialCommunityIcons name="account-group" size={16} color="#9CA3AF" />
              </HStack>
              <Box borderWidth={1} borderColor="#374151" borderRadius={8} py="$1.5" px="$3" alignItems="center">
                <Text color="#4CAF50" size="xs">Earn More</Text>
              </Box>
            </TouchableOpacity>
          </ScrollView>
        </Box>

        {/* Quick Actions */}
        <Box px="$4" mt="$6" bg="#08632eff" pt="$5" pb="$4" borderRadius={24} mx="$4">
          <Heading size="sm" mb="$4" color="#FFFFFF" px="$2">
            Quick Actions
          </Heading>
          <HStack justifyContent="space-between" px="$2">
            <ActionButton 
              title="Properties" 
              icon="home-city-outline" 
              color="#4CAF50" 
              onPress={() => (navigation as any).navigate("PropertyNav")} 
            />
            <ActionButton 
              title="Pay" 
              icon="credit-card-outline" 
              color="#F87171" 
              onPress={() => navigation.navigate("Payment Schedule" as never)} 
            />
            <ActionButton 
              title="Refer" 
              icon="account-group-outline" 
              color="#4CAF50" 
              isNew
              onPress={() => (navigation as any).navigate("MainTabs", {screen: "Refer & Earn"})} 
            />
            <ActionButton 
              title="Loyalty" 
              icon="shield-star-outline" 
              color="#60A5FA" 
              onPress={() => (navigation as any).navigate("LoyaltyNav")} 
            />
          </HStack>
        </Box>

        {/* News and Updates Horizontal Scroll */}
        <Box px="$0" mt="$6">
          <HStack px="$4" justifyContent="space-between" alignItems="center" mb="$3">
            <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg">
              News & Updates
            </Heading>
            <TouchableOpacity onPress={() => (navigation as any).navigate("NewsFeed")}>
              <Text color={colors.primary} size="xs" bold>View All</Text>
            </TouchableOpacity>
          </HStack>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {[
              { id: 1, title: "Optiven Awards Top Performers", img: "https://optiven.co.ke/wp-content/uploads/2024/02/IMG-20240214-WA0004.jpg" },
              { id: 2, title: "New Project Launch in Naivasha", img: "https://www.optiven.co.ke/wp-content/uploads/2023/11/Joy-Lovers-Club-Konza.jpg" },
              { id: 3, title: "Investment Tips for 2024", img: "https://www.optiven.co.ke/wp-content/uploads/2023/01/Love-Gardens-Kajiado.jpg" }
            ].map((news, index) => (
              <Pressable key={news.id} onPress={() => (navigation as any).navigate("NewsFeed")} style={{ width: width * 0.7, marginRight: index === 2 ? 0 : 16 }}>
                <Card p="$0" overflow="hidden" borderRadius={14}>
                  <Box position="relative">
                    <Image 
                      source={{ uri: news.img }} 
                      alt={news.title}
                      w="$full"
                      h={140}
                      resizeMode="cover"
                    />
                    <Box position="absolute" top={0} bottom={0} left={0} right={0} bg="rgba(0,0,0,0.5)" p="$4" justifyContent="flex-end">
                      <Text color="$white" size="md" bold numberOfLines={2}>{news.title}</Text>
                      <Box bg={colors.primary} alignSelf="flex-start" py="$1" px="$3" borderRadius={6} mt="$2">
                        <Text color="$white" size="xs" bold>Learn More</Text>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Pressable>
            ))}
          </ScrollView>
        </Box>

        {/* Recent Activity Feed */}
        <Box px="$4" mt="$6">
          <HStack justifyContent="space-between" alignItems="center" mb="$3">
            <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg">
              Recent Activity
            </Heading>
            <TouchableOpacity onPress={() => (navigation as any).navigate("Notifications")}>
              <Text color={colors.primary} size="xs" bold>View All</Text>
            </TouchableOpacity>
          </HStack>
          <Card variant="elevated" p="$0" borderRadius={14} overflow="hidden">
            <Box bg="$white" px="$4">
              {activities.length > 0 ? (
                activities.slice(0, 5).map((item) => (
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
  darkCard: {
    backgroundColor: "#2C2D35",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  actionBtn: {
    width: (width - 48) / 4,
    alignItems: "center",
  },
});
