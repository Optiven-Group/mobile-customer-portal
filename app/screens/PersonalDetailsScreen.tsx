import React from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import {
  Box,
  Text,
  VStack,
  HStack,
  Heading,
  Avatar,
  AvatarFallbackText,
  Divider,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountStackParamList } from "../navigation/types";
import { useAuth } from "../context/AuthContext";
import Screen from "../app-components/Screen";

type PersonalDetailsScreenProps = NativeStackScreenProps<AccountStackParamList, "PersonalDetails">;

const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({ navigation }) => {
  const { user } = useAuth();

  const details = {
    name: user?.name || "James Kabui",
    email: user?.email || "programmer@optiven.co.ke",
    phone: "254748199582",
    customerNumber: user?.customerNumber || "OPT-2024-0001",
    joined: "Oct 2023",
  };

  const getInitials = (n?: string): string => {
    if (!n) return "U";
    const parts = n.trim().split(" ");
    if (parts.length <= 1) return (parts[0]?.[0] || "U").toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <HStack alignItems="center" py="$3.5">
      <View style={[styles.detailIcon, { backgroundColor: "#E8F5E9" }]}>
        <MaterialCommunityIcons name={icon as any} size={16} color="#388E3C" />
      </View>
      <VStack flex={1}>
        <Text size="2xs" color="#9CA3AF">{label}</Text>
        <Text size="sm" bold color="#1F2937" mt="$0.5">{value}</Text>
      </VStack>
    </HStack>
  );

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Avatar Header */}
        <View style={styles.header}>
          <Avatar bgColor="#388E3C" size="xl" borderRadius="$full">
            <AvatarFallbackText color="$white" fontSize={28}>
              {getInitials(details.name)}
            </AvatarFallbackText>
          </Avatar>
          <Heading size="lg" color="#1B5E20" mt="$3">{details.name}</Heading>
          <HStack alignItems="center" space="xs" mt="$1">
            <MaterialCommunityIcons name="star" size={14} color="#CD7F32" />
            <Text size="xs" color="#6B7280">{details.customerNumber}</Text>
          </HStack>
        </View>

        {/* Personal Information Card */}
        <View style={styles.card}>
          <HStack alignItems="center" space="sm" mb="$2">
            <View style={styles.sectionIcon}>
              <MaterialCommunityIcons name="account-outline" size={18} color="#388E3C" />
            </View>
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </HStack>

          <DetailRow icon="account" label="Full Name" value={details.name} />
          <Divider />
          <DetailRow icon="email-outline" label="Email Address" value={details.email} />
          <Divider />
          <DetailRow icon="phone-outline" label="Phone Number" value={details.phone} />
          <Divider />
          <DetailRow icon="identifier" label="Customer Number" value={details.customerNumber} />
          <Divider />
          <DetailRow icon="calendar-month" label="Member Since" value={details.joined} />
        </View>

        {/* Action Buttons */}
        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("EditDetails", { name: details.name, email: details.email, phone: details.phone })}
          >
            <MaterialCommunityIcons name="account-edit-outline" size={20} color="#FFF" />
            <Text bold size="md" color="$white" ml="$2">Edit Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <MaterialCommunityIcons name="lock-reset" size={18} color="#388E3C" />
            <Text bold size="sm" color="#388E3C" ml="$2">Change Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default PersonalDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FBF6" },
  header: {
    alignItems: "center",
    paddingVertical: 28,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
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
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  editButton: {
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
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "#E8F5E9",
  },
});
