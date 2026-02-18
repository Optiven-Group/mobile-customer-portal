import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Dimensions,
} from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
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

const { width } = Dimensions.get("window");

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  link: string;
}

const MOCK_NEWS: NewsArticle[] = [
  {
    id: 1,
    title: "Optiven Launches New Eco-Friendly Project in Malindi",
    excerpt: "Experience sustainable living with our newest coastal development featuring solar panels and rainwater harvesting...",
    image: "https://www.optiven.co.ke/wp-content/uploads/2023/10/malindi.jpg",
    date: "2024-04-20",
    category: "Projects",
    link: "https://www.optiven.co.ke",
  },
  {
    id: 2,
    title: "Customer Appreciation Day - March 2024 Highlights",
    excerpt: "Thank you to all our valued customers who joined us for an unforgettable experience at our annual appreciation event...",
    image: "https://www.optiven.co.ke/wp-content/uploads/2023/10/event.jpg",
    date: "2024-03-28",
    category: "Events",
    link: "https://www.optiven.co.ke",
  },
  {
    id: 3,
    title: "How to Maximize Your Referral Earnings",
    excerpt: "Our referral program has paid out over KES 50M to customers. Learn the tips and tricks to maximize your earnings...",
    image: "https://www.optiven.co.ke/wp-content/uploads/2023/10/referral.jpg",
    date: "2024-03-15",
    category: "Tips",
    link: "https://www.optiven.co.ke",
  },
  {
    id: 4,
    title: "Infrastructure Update: Amani Ridge Roads Now Complete",
    excerpt: "We are pleased to announce that all-weather roads at Amani Ridge are now fully tarmacked...",
    image: "https://www.optiven.co.ke/wp-content/uploads/2023/10/roads.jpg",
    date: "2024-03-01",
    category: "Updates",
    link: "https://www.optiven.co.ke",
  },
];

type Category = "All" | "Projects" | "Events" | "Tips" | "Updates";

const NewsFeedScreen = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  useEffect(() => {
    setTimeout(() => {
      setArticles(MOCK_NEWS);
      setLoading(false);
    }, 800);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setArticles(MOCK_NEWS);
      setRefreshing(false);
    }, 1000);
  };

  const filteredArticles = articles.filter((a) =>
    activeCategory === "All" ? true : a.category === activeCategory
  );

  const CategoryChip = ({ label, active }: { label: Category; active: boolean }) => (
    <TouchableOpacity
      onPress={() => setActiveCategory(label)}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text size="xs" bold color={active ? "$white" : "$coolGray600"}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderFeatured = () => {
    if (filteredArticles.length === 0) return null;
    const featured = filteredArticles[0];
    return (
      <Pressable onPress={() => Linking.openURL(featured.link)} mx="$4" mb="$4">
        <Card p="$0" overflow="hidden" borderRadius="$xl">
          <Image
            source={{ uri: featured.image }}
            alt={featured.title}
            w="$full"
            h={200}
            resizeMode="cover"
          />
          <Box position="absolute" bottom={0} left={0} right={0} bg="rgba(0,0,0,0.65)" p="$3">
            <Box bg={colors.secondary} alignSelf="flex-start" px="$2" py="$0.5" borderRadius="$sm" mb="$1">
              <Text size="2xs" color="$white" bold>{featured.category}</Text>
            </Box>
            <Heading size="sm" color="$white" numberOfLines={2}>{featured.title}</Heading>
            <Text size="xs" color="$coolGray300" mt="$1">
              {new Date(featured.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            </Text>
          </Box>
        </Card>
      </Pressable>
    );
  };

  const renderArticleItem = ({ item, index }: { item: NewsArticle; index: number }) => {
    if (index === 0) return null; // Featured is rendered separately
    return (
      <Pressable onPress={() => Linking.openURL(item.link)} mx="$4" mb="$3">
        <Card p="$0" overflow="hidden" borderRadius="$lg">
          <HStack>
            <Image
              source={{ uri: item.image }}
              alt={item.title}
              w={110}
              h={100}
              resizeMode="cover"
            />
            <VStack flex={1} p="$3" justifyContent="space-between">
              <Box>
                <Box bg={colors.primary + "20"} alignSelf="flex-start" px="$2" borderRadius="$sm" mb="$1">
                  <Text size="2xs" color={colors.primary} bold>{item.category}</Text>
                </Box>
                <Heading size="xs" numberOfLines={2}>{item.title}</Heading>
              </Box>
              <Text size="2xs" color="$coolGray400">
                {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </Text>
            </VStack>
          </HStack>
        </Card>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderArticleItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            <Box px="$4" pt="$4" pb="$2">
              <Heading size="xl" mb="$3">News & Updates</Heading>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={(["All", "Projects", "Events", "Tips", "Updates"] as Category[])}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <CategoryChip label={item} active={activeCategory === item} />
                )}
                contentContainerStyle={{ gap: 8 }}
              />
            </Box>
            {renderFeatured()}
            <Heading size="sm" px="$4" mb="$2" color="$coolGray600">Latest</Heading>
          </>
        }
        ListEmptyComponent={
          <Box py="$10" alignItems="center">
            <MaterialCommunityIcons name="newspaper-variant-outline" size={48} color={colors.coolGray} />
            <Text mt="$2" color="$coolGray500">No news articles found.</Text>
          </Box>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </Screen>
  );
};

export default NewsFeedScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginRight: 4,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
});
