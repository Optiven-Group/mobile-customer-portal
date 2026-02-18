import React, { useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";
import AppNavigator from "./AppNavigator";
import PropertyNavigator from "./PropertyNavigator";
import { DrawerStackParamList } from "./types";
import { useAuth } from "../context/AuthContext";
import colors from "../utils/colors";
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  AvatarFallbackText,
  Divider,
} from "@gluestack-ui/themed";
import WalletScreen from "../screens/wallet/WalletScreen";
import PaymentsOverviewScreen from "../screens/wallet/PaymentsOverviewScreen";
import NewsFeedScreen from "../screens/news/NewsFeedScreen";
import SupportScreen from "../screens/support/SupportScreen";
import LoyaltyNavigator from "./LoyaltyNavigator";
import AllPropertiesScreen from "../screens/properties/AllPropertiesScreen";
import ProjectDetailScreen from "../screens/properties/ProjectDetailScreen";

const Drawer = createDrawerNavigator<DrawerStackParamList>();

// ── Sidebar menu row (Bolt-style) ──────────────────────
const MenuRow = ({
  icon,
  label,
  onPress,
  badge,
  danger,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  badge?: string;
  danger?: boolean;
}) => (
  <TouchableOpacity
    style={styles.menuRow}
    activeOpacity={0.6}
    onPress={onPress}
  >
    <HStack alignItems="center" space="lg" flex={1}>
      <MaterialCommunityIcons
        name={icon as any}
        size={22}
        color={danger ? colors.danger : "#374151"}
      />
      <Text
        size="md"
        style={{ color: danger ? colors.danger : "#1F2937", fontWeight: "500" }}
      >
        {label}
      </Text>
    </HStack>
    {badge && (
      <Box bg={colors.primary} px="$2" py="$0.5" borderRadius="$full">
        <Text size="2xs" bold color="$white">
          {badge}
        </Text>
      </Box>
    )}
  </TouchableOpacity>
);

// ── Custom Drawer Content ──────────────────────────────
const CustomDrawerContent = (props: any) => {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [showAffiliate, setShowAffiliate] = useState(true);

  const getInitials = (name: string | undefined): string => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length === 0) return "U";
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0).toUpperCase() +
      names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  const TAB_NAMES = ["Overview", "Refer & Earn", "Notifications", "Profile"];

  const navigateToTab = (tabName: string) => {
    const tabIndex = TAB_NAMES.indexOf(tabName);
    props.navigation.closeDrawer();
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "MainTabs",
            state: {
              index: tabIndex >= 0 ? tabIndex : 0,
              routes: TAB_NAMES.map((name) => ({ name })),
            },
          },
        ],
      })
    );
  };

  return (
    <View style={[styles.drawerContainer, { paddingTop: insets.top }]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── User Header (Bolt-style) ── */}
        <TouchableOpacity
          style={styles.userHeader}
          activeOpacity={0.7}
          onPress={() => navigateToTab("Profile")}
        >
          <Avatar bgColor={colors.primary} size="md" borderRadius="$full">
            <AvatarFallbackText color="$white">
              {getInitials(user?.name)}
            </AvatarFallbackText>
          </Avatar>
          <VStack ml="$3" flex={1}>
            <Text size="lg" bold color="#1F2937">
              {user?.name || "Customer"}
            </Text>
            <Text size="sm" color={colors.primary}>
              My account
            </Text>
          </VStack>
        </TouchableOpacity>

        {/* Rating / Customer Info */}
        <HStack px="$5" pb="$4" alignItems="center" space="xs">
          <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
          <Text size="sm" bold color="#1F2937">
            {user?.customerNumber || "OPT-2024"}
          </Text>
          <Text size="xs" color="#9CA3AF">
            Customer
          </Text>
        </HStack>

        <Divider />

        {/* ── Menu Items ── */}
        <View style={styles.menuSection}>
          <MenuRow
            icon="wallet"
            label="Wallet"
            onPress={() => props.navigation.navigate("Wallet")}
          />
          <MenuRow
            icon="credit-card-check"
            label="Payments"
            onPress={() => props.navigation.navigate("Payments")}
          />
          <MenuRow
            icon="cash-plus"
            label="Refer & Earn"
            badge="NEW"
            onPress={() => navigateToTab("Refer & Earn")}
          />
          <MenuRow
            icon="home-city"
            label="My Properties"
            onPress={() => props.navigation.navigate("PropertyNav")}
          />
          <MenuRow
            icon="map-search"
            label="All Properties"
            onPress={() => props.navigation.navigate("AllProperties")}
          />
          <MenuRow
            icon="shield-star"
            label="Loyalty Program"
            onPress={() => props.navigation.navigate("LoyaltyNav")}
          />
          <MenuRow
            icon="newspaper-variant"
            label="News & Updates"
            onPress={() => props.navigation.navigate("NewsFeed")}
          />
          <MenuRow
            icon="help-circle"
            label="Support"
            onPress={() => props.navigation.navigate("Support")}
          />
          <MenuRow
            icon="information"
            label="About"
            onPress={() => Linking.openURL("https://www.optiven.co.ke")}
          />
        </View>

        <Divider />

        {/* ── Logout ── */}
        <View style={styles.menuSection}>
          <MenuRow
            icon="logout"
            label="Log out"
            danger
            onPress={() => logout()}
          />
        </View>
      </DrawerContentScrollView>

      {/* ── Affiliate CTA Bubble ── */}
      {showAffiliate && (
        <View style={[styles.affiliateBubble, { marginBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
          <TouchableOpacity
            style={styles.affiliateContent}
            activeOpacity={0.8}
            onPress={() => navigateToTab("Refer & Earn")}
          >
            <VStack flex={1}>
              <Text bold size="md" color="$white">
                Become an Affiliate
              </Text>
              <Text size="xs" color="$white" opacity={0.85}>
                Earn money referring Optiven properties
              </Text>
            </VStack>
            <TouchableOpacity
              onPress={() => setShowAffiliate(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons name="close" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </TouchableOpacity>
          {/* Optiven accent bar */}
          <View style={styles.affiliateAccent} />
        </View>
      )}
    </View>
  );
};

// ── Drawer Navigator ──────────────────────────────────
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.dark,
        drawerStyle: {
          width: "78%",
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={AppNavigator}
        options={{ title: "Home" }}
      />
      <Drawer.Screen
        name="PropertyNav"
        component={PropertyNavigator}
        options={{
          title: "My Properties",
          headerShown: true,
          headerTitle: "My Properties",
        }}
      />
      <Drawer.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          title: "Wallet",
          headerShown: true,
          headerTitle: "Wallet",
        }}
      />
      <Drawer.Screen
        name="Payments"
        component={PaymentsOverviewScreen}
        options={{
          title: "Payments",
          headerShown: true,
          headerTitle: "Payments",
        }}
      />
      <Drawer.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{
          title: "News & Updates",
          headerShown: true,
          headerTitle: "News & Updates",
        }}
      />
      <Drawer.Screen
        name="Support"
        component={SupportScreen}
        options={{
          title: "Support & Help",
          headerShown: true,
          headerTitle: "Support & Help",
        }}
      />
      <Drawer.Screen
        name="LoyaltyNav"
        component={LoyaltyNavigator}
        options={{ title: "Loyalty Program", headerShown: false }}
      />
      <Drawer.Screen
        name="AllProperties"
        component={AllPropertiesScreen}
        options={{
          title: "All Properties",
          headerShown: true,
          headerTitle: "All Properties",
        }}
      />
      <Drawer.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={{
          title: "Project Details",
          headerShown: true,
          headerTitle: "Project Details",
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

// ── Styles ────────────────────────────────────────────
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 10,
    paddingTop: 0,
  },
  // ── User Header ──
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  // ── Menu ──
  menuSection: {
    paddingVertical: 8,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  // ── Affiliate Bubble ──
  affiliateBubble: {
    marginHorizontal: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 0,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  affiliateContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  affiliateAccent: {
    height: 3,
    backgroundColor: colors.primary,
  },
});
