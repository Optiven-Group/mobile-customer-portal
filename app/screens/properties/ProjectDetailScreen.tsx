import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Linking,
  Share,
} from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const PROJECT_HIGHLIGHTS = [
  { icon: "road-variant", label: "Tarmac Access" },
  { icon: "water-pump", label: "Water Supply" },
  { icon: "flash", label: "Electricity" },
  { icon: "certificate", label: "Title Deed" },
];

const PLOT_SIZES = [
  { size: "1/8 Acre", price: "KES 1,500,000", popular: false },
  { size: "1/4 Acre", price: "KES 2,800,000", popular: true },
  { size: "1/2 Acre", price: "KES 5,200,000", popular: false },
];

const ProjectDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { project } = route.params;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out ${project.name} by Optiven! Located at ${project.location}. Visit optiven.co.ke for more info.` });
    } catch {}
  };

  const handleContact = () => {
    Linking.openURL("tel:+254790300300");
  };

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Hero Section */}
          <View style={styles.hero}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="home-city" size={48} color="#388E3C" />
            </View>
            <Heading size="xl" color="#1B5E20" textAlign="center" mt="$4" style={{ letterSpacing: -0.5 }}>
              {project.name}
            </Heading>
            <HStack alignItems="center" space="xs" mt="$2" justifyContent="center">
              <MaterialCommunityIcons name="map-marker-outline" size={16} color="#66BB6A" />
              <Text size="sm" color="#66BB6A">{project.location || "Kenya"}</Text>
            </HStack>

            {/* Quick action pills */}
            <HStack space="sm" mt="$5" justifyContent="center">
              <TouchableOpacity style={styles.pill} onPress={handleContact}>
                <MaterialCommunityIcons name="phone-outline" size={16} color="#388E3C" />
                <Text size="xs" color="#388E3C" bold>Call Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pill} onPress={handleShare}>
                <MaterialCommunityIcons name="share-variant-outline" size={16} color="#388E3C" />
                <Text size="xs" color="#388E3C" bold>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pill} onPress={() => Linking.openURL("https://www.optiven.co.ke")}>
                <MaterialCommunityIcons name="web" size={16} color="#388E3C" />
                <Text size="xs" color="#388E3C" bold>Website</Text>
              </TouchableOpacity>
            </HStack>
          </View>

          {/* Description Card */}
          <View style={styles.card}>
            <HStack alignItems="center" space="sm" mb="$3">
              <View style={styles.sectionIcon}>
                <MaterialCommunityIcons name="information-outline" size={18} color="#388E3C" />
              </View>
              <Text style={styles.sectionTitle}>About This Project</Text>
            </HStack>
            <Text style={styles.description}>
              {project.description || "Optiven offers you a unique opportunity to own property in this prime location. Our projects come with value additions including tarmac roads, water, electricity, and ready title deeds. Invest today for a brighter tomorrow."}
            </Text>
          </View>

          {/* Highlights Grid */}
          <View style={styles.card}>
            <HStack alignItems="center" space="sm" mb="$4">
              <View style={styles.sectionIcon}>
                <MaterialCommunityIcons name="star-four-points" size={18} color="#388E3C" />
              </View>
              <Text style={styles.sectionTitle}>Project Highlights</Text>
            </HStack>
            <HStack flexWrap="wrap" justifyContent="space-between">
              {PROJECT_HIGHLIGHTS.map((h, i) => (
                <View key={i} style={styles.highlightItem}>
                  <View style={styles.highlightIcon}>
                    <MaterialCommunityIcons name={h.icon as any} size={22} color="#388E3C" />
                  </View>
                  <Text size="xs" color="#374151" bold mt="$1">{h.label}</Text>
                </View>
              ))}
            </HStack>
          </View>

          {/* Plot Sizes & Prices */}
          <View style={styles.card}>
            <HStack alignItems="center" space="sm" mb="$4">
              <View style={styles.sectionIcon}>
                <MaterialCommunityIcons name="tag-outline" size={18} color="#388E3C" />
              </View>
              <Text style={styles.sectionTitle}>Available Sizes & Pricing</Text>
            </HStack>
            {PLOT_SIZES.map((plot, i) => (
              <View key={i} style={[styles.plotRow, plot.popular && styles.plotRowPopular]}>
                <VStack flex={1}>
                  <HStack alignItems="center" space="xs">
                    <Text bold size="sm" color="#1F2937">{plot.size}</Text>
                    {plot.popular && (
                      <View style={styles.popularBadge}>
                        <Text size="2xs" bold color="#FFF">Popular</Text>
                      </View>
                    )}
                  </HStack>
                  <Text size="xs" color="#6B7280" mt="$0.5">Starting from</Text>
                </VStack>
                <Text bold size="md" color="#1B5E20">{plot.price}</Text>
              </View>
            ))}
          </View>

          {/* Location Map Placeholder */}
          <View style={styles.card}>
            <HStack alignItems="center" space="sm" mb="$3">
              <View style={styles.sectionIcon}>
                <MaterialCommunityIcons name="map-outline" size={18} color="#388E3C" />
              </View>
              <Text style={styles.sectionTitle}>Location</Text>
            </HStack>
            <View style={styles.mapPlaceholder}>
              <MaterialCommunityIcons name="google-maps" size={40} color="#C8E6C9" />
              <Text size="xs" color="#9CA3AF" mt="$2">{project.location || "View on Google Maps"}</Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85} onPress={handleContact}>
              <MaterialCommunityIcons name="phone" size={20} color="#FFF" />
              <Text bold size="md" color="$white" ml="$2">Book a Site Visit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ctaOutline} activeOpacity={0.85} onPress={() => Linking.openURL("https://wa.me/254790300300")}>
              <MaterialCommunityIcons name="whatsapp" size={20} color="#388E3C" />
              <Text bold size="sm" color="#388E3C" ml="$2">WhatsApp Inquiry</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </Screen>
  );
};

export default ProjectDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FBF6" },
  hero: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  heroIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7F1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B5E20",
    letterSpacing: -0.3,
  },
  description: { fontSize: 14, color: "#6B7280", lineHeight: 22 },
  highlightItem: {
    width: "48%",
    backgroundColor: "#F0F7F1",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  highlightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  plotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#FAFCFA",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  plotRowPopular: {
    borderColor: "#388E3C",
    borderWidth: 1.5,
    backgroundColor: "#F0F7F1",
  },
  popularBadge: {
    backgroundColor: "#388E3C",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  mapPlaceholder: {
    height: 120,
    borderRadius: 14,
    backgroundColor: "#F5FBF6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8F5E9",
    borderStyle: "dashed",
  },
  ctaButton: {
    flexDirection: "row",
    backgroundColor: "#388E3C",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaOutline: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "#388E3C",
  },
});
