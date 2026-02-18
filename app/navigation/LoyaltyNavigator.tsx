import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoyaltyStackParamList } from "./types";
import LoyaltyDashboardScreen from "../screens/loyalty/LoyaltyDashboardScreen";
import TierSystemScreen from "../screens/loyalty/TierSystemScreen";
import PointsHistoryScreen from "../screens/loyalty/PointsHistoryScreen";
import RewardsCatalogScreen from "../screens/loyalty/RewardsCatalogScreen";
import RewardDetailScreen from "../screens/loyalty/RewardDetailScreen";
import LeaderboardScreen from "../screens/loyalty/LeaderboardScreen";
import BadgesScreen from "../screens/loyalty/BadgesScreen";

const Stack = createNativeStackNavigator<LoyaltyStackParamList>();

const LoyaltyNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoyaltyDashboard"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="LoyaltyDashboard"
        component={LoyaltyDashboardScreen}
        options={{ title: "Loyalty Program" }}
      />
      <Stack.Screen
        name="TierSystem"
        component={TierSystemScreen}
        options={{ title: "Tier System" }}
      />
      <Stack.Screen
        name="PointsHistory"
        component={PointsHistoryScreen}
        options={{ title: "Points History" }}
      />
      <Stack.Screen
        name="RewardsCatalog"
        component={RewardsCatalogScreen}
        options={{ title: "Rewards" }}
      />
      <Stack.Screen
        name="RewardDetail"
        component={RewardDetailScreen}
        options={{ title: "Reward Details" }}
      />
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ title: "Leaderboard" }}
      />
      <Stack.Screen
        name="Badges"
        component={BadgesScreen}
        options={{ title: "Badges & Achievements" }}
      />
    </Stack.Navigator>
  );
};

export default LoyaltyNavigator;
