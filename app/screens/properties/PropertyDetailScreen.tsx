import React from "react";
import { StyleSheet, ScrollView, Dimensions, TouchableOpacity, View} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { Box, VStack, HStack, Text, Heading, Divider } from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const PropertyDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { property } = route.params;

  const progress = property.price > 0 ? Math.round(((property.price - property.balance) / property.price) * 100) : 100;
  const statusConfig = property.status === "Fully Paid"
    ? { bg: "#E8F5E9", color: "#2E7D32", icon: "check-circle", label: "Fully Paid" }
    : { bg: "#FFF3E0", color: "#E65100", icon: "clock-outline", label: "Installment" };

  const DetailRow = ({ icon, label, value, valueColor }: { icon: string; label: string; value: string; valueColor?: string }) => (
    <HStack alignItems="center" py="$3">
      <View style={[styles.detailIcon, { backgroundColor: "#E8F5E9" }]}>
        <MaterialCommunityIcons name={icon as any} size={16} color="#388E3C" />
      </View>
      <Text flex={1} size="sm" color="#6B7280">{label}</Text>
      <Text bold size="sm" color={valueColor || "#1F2937"}>{value}</Text>
    </HStack>
  );

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero Header */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: statusConfig.bg }]}>
            <MaterialCommunityIcons name="home-city" size={40} color={statusConfig.color} />
          </View>
          <Heading size="xl" color="#1B5E20" textAlign="center" mt="$3" style={{ letterSpacing: -0.5 }}>
            {property.project}
          </Heading>
          <Text size="md" color="#6B7280" textAlign="center" mt="$1">{property.name}</Text>
          <HStack alignItems="center" space="xs" mt="$2" justifyContent="center">
            <MaterialCommunityIcons name="map-marker-outline" size={14} color="#66BB6A" />
            <Text size="sm" color="#66BB6A">{property.location}</Text>
          </HStack>

          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <MaterialCommunityIcons name={statusConfig.icon as any} size={14} color={statusConfig.color} />
            <Text size="xs" bold color={statusConfig.color} ml="$1">{statusConfig.label}</Text>
          </View>
        </View>

        {/* Payment Progress Card */}
        <View style={styles.card}>
          <HStack alignItems="center" space="sm" mb="$3">
            <View style={styles.sectionIcon}>
              <MaterialCommunityIcons name="chart-arc" size={18} color="#388E3C" />
            </View>
            <Text style={styles.sectionTitle}>Payment Progress</Text>
          </HStack>

          <View style={styles.progressContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>{progress}%</Text>
              <Text size="2xs" color="#9CA3AF">Complete</Text>
            </View>
            <VStack flex={1} ml="$4" space="sm">
              <HStack justifyContent="space-between">
                <Text size="xs" color="#9CA3AF">Total Price</Text>
                <Text size="sm" bold color="#1F2937">KES {property.price?.toLocaleString()}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text size="xs" color="#9CA3AF">Amount Paid</Text>
                <Text size="sm" bold color="#2E7D32">KES {(property.price - property.balance)?.toLocaleString()}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text size="xs" color="#9CA3AF">Balance</Text>
                <Text size="sm" bold color={property.balance > 0 ? "#E65100" : "#2E7D32"}>KES {property.balance?.toLocaleString()}</Text>
              </HStack>
            </VStack>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Property Details Card */}
        <View style={styles.card}>
          <HStack alignItems="center" space="sm" mb="$2">
            <View style={styles.sectionIcon}>
              <MaterialCommunityIcons name="text-box-outline" size={18} color="#388E3C" />
            </View>
            <Text style={styles.sectionTitle}>Property Details</Text>
          </HStack>

          <DetailRow icon="ruler-square" label="Plot Size" value={property.size} />
          <Divider />
          <DetailRow icon="calendar-month" label="Purchase Date" value="Oct 12, 2023" />
          <Divider />
          <DetailRow icon="identifier" label="Plot ID" value={`#${property.id}`} />
          <Divider />
          <DetailRow icon="home-group" label="Project" value={property.project} />
        </View>

        {/* Action Buttons */}
        <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
          {property.balance > 0 && (
            <TouchableOpacity
              style={styles.ctaButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Payment Schedule", { property })}
            >
              <MaterialCommunityIcons name="credit-card-outline" size={20} color="#FFF" />
              <Text bold size="md" color="$white" ml="$2">Make Payment</Text>
            </TouchableOpacity>
          )}

          <HStack space="sm" mt="$3">
            <TouchableOpacity
              style={[styles.secondaryBtn, { flex: 1 }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("PropertyDocuments", { property })}
            >
              <MaterialCommunityIcons name="file-document-outline" size={18} color="#388E3C" />
              <Text bold size="xs" color="#388E3C" ml="$1.5">Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryBtn, { flex: 1 }]}
              activeOpacity={0.85}
              onPress={() => {}}
            >
              <MaterialCommunityIcons name="receipt" size={18} color="#388E3C" />
              <Text bold size="xs" color="#388E3C" ml="$1.5">Statement</Text>
            </TouchableOpacity>
          </HStack>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default PropertyDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FBF6" },
  hero: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 28,
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
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 14,
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
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1B5E20", letterSpacing: -0.3 },
  detailIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  progressContainer: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  progressCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#388E3C",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F7F1",
  },
  progressText: { fontSize: 18, fontWeight: "800", color: "#1B5E20" },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F0F0F0",
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3, backgroundColor: "#388E3C" },
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
  secondaryBtn: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E8F5E9",
  },
});
