import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  Button,
  ButtonText,
  Divider,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CURRENT_POINTS = 2450;

const RewardDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const reward = route.params?.reward;

  const canRedeem = CURRENT_POINTS >= (reward?.pointsRequired || 0) && reward?.available;
  const balanceAfter = CURRENT_POINTS - (reward?.pointsRequired || 0);

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <Box bg={colors.primary + "10"} py="$8" alignItems="center">
          <MaterialCommunityIcons name="gift" size={60} color={colors.primary} />
        </Box>

        <Box px="$4" mt="$4">
          <Heading size="lg">{reward?.name}</Heading>
          <Text size="sm" color="$coolGray500" mt="$1">{reward?.description}</Text>

          {/* Points Info */}
          <Card variant="elevated" p="$4" mt="$5" borderRadius={14}>
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                <Text size="xs" color="$coolGray500">Points Required</Text>
                <Heading size="xl" color={colors.primary}>{reward?.pointsRequired}</Heading>
              </VStack>
              <VStack alignItems="flex-end">
                <Text size="xs" color="$coolGray500">Your Balance</Text>
                <Text bold size="lg">{CURRENT_POINTS}</Text>
              </VStack>
            </HStack>
            <Divider my="$3" />
            <HStack justifyContent="space-between">
              <Text size="xs" color="$coolGray500">Balance After Redemption</Text>
              <Text bold size="sm" color={canRedeem ? colors.success : colors.danger}>{canRedeem ? balanceAfter : "Insufficient"}</Text>
            </HStack>
          </Card>

          {/* Details */}
          <VStack mt="$5" space="sm">
            <HStack alignItems="center" space="sm">
              <MaterialCommunityIcons name="tag" size={16} color={colors.coolGray} />
              <Text size="sm">Category: <Text bold>{reward?.category}</Text></Text>
            </HStack>
            <HStack alignItems="center" space="sm">
              <MaterialCommunityIcons name="shield-star" size={16} color={colors.coolGray} />
              <Text size="sm">Tier Required: <Text bold>{reward?.tierRequired}</Text></Text>
            </HStack>
            <HStack alignItems="center" space="sm">
              <MaterialCommunityIcons name="check-circle" size={16} color={reward?.available ? colors.success : colors.danger} />
              <Text size="sm">{reward?.available ? "Available" : "Currently Unavailable"}</Text>
            </HStack>
          </VStack>

          {/* Redeem Button */}
          <Button
            bg={canRedeem ? colors.primary : "$coolGray300"}
            size="lg"
            borderRadius={14}
            mt="$6"
            disabled={!canRedeem}
            onPress={() => {
              // Mock redeem
              console.log("Redeem reward:", reward?.name);
              navigation.goBack();
            }}
          >
            <ButtonText>{canRedeem ? "Redeem Now" : "Not Enough Points"}</ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default RewardDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
});
