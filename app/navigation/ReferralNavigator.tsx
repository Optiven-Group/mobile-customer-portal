import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReferralStackParamList } from "./types";
import ReferralHomeScreen from "../screens/referral/ReferralHomeScreen";
import ReferralDashboardScreen from "../screens/referral/ReferralDashboardScreen";
import HowItWorksScreen from "../screens/referral/HowItWorksScreen";
import ReferSomeoneScreen from "../screens/referral/ReferSomeoneScreen";
import FeaturedProjectsScreen from "../screens/referral/FeaturedProjectsScreen";
import ReferralProgressScreen from "../screens/referral/ReferralProgressScreen";
import ReferralDetailScreen from "../screens/referral/ReferralDetailScreen";
import CommissionScreen from "../screens/referral/CommissionScreen";
import PayoutHistoryScreen from "../screens/referral/PayoutHistoryScreen";

const Stack = createNativeStackNavigator<ReferralStackParamList>();

const ReferralNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ReferralHome"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="ReferralHome"
        component={ReferralHomeScreen}
        options={{ title: "Refer & Earn" }}
      />
      <Stack.Screen
        name="ReferralDashboard"
        component={ReferralDashboardScreen}
        options={{ title: "Referral Dashboard" }}
      />
      <Stack.Screen
        name="HowItWorks"
        component={HowItWorksScreen}
        options={{ title: "How It Works" }}
      />
      <Stack.Screen
        name="FeaturedProjects"
        component={FeaturedProjectsScreen}
        options={{ title: "Select Project" }}
      />
      <Stack.Screen
        name="ReferSomeone"
        component={ReferSomeoneScreen}
        options={{ title: "Refer Someone" }}
      />
      <Stack.Screen
        name="ReferralProgress"
        component={ReferralProgressScreen}
        options={{ title: "My Referrals" }}
      />
      <Stack.Screen
        name="ReferralDetail"
        component={ReferralDetailScreen}
        options={{ title: "Referral Details" }}
      />
      <Stack.Screen
        name="Commission"
        component={CommissionScreen}
        options={{ title: "Commission Breakdown" }}
      />
      <Stack.Screen
        name="PayoutHistory"
        component={PayoutHistoryScreen}
        options={{ title: "Payout History" }}
      />
    </Stack.Navigator>
  );
};

export default ReferralNavigator;
