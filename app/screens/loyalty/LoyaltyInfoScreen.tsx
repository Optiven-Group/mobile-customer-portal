import React from "react";
import { Box, Text, VStack, HStack, Divider } from "@gluestack-ui/themed";
import { ScrollView, StyleSheet } from "react-native";
import colors from "../../utils/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LoyaltyInfoScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Box px={20} py={20}>
        <Text style={styles.header}>Unlock Exclusive Benefits!</Text>
        <Text style={styles.subHeader}>
          Discover the perks of climbing up our loyalty tiers. The more you invest, the more you gain!
        </Text>

        <VStack space="xs" mt={20}>
          {/* Platinum Tier */}
          <Box style={styles.tierContainer}>
            <HStack alignItems="center">
              <Box style={[styles.iconContainer, { backgroundColor: "#E5E4E2" }]}>
                <MaterialCommunityIcons name="crown" size={24} color={colors.white} />
              </Box>
              <Text style={[styles.tierTitle, { color: "#E5E4E2" }]}>Platinum Tier</Text>
            </HStack>
            <Text style={styles.tierDescription}>
              🎉 You're a property mogul! With over 20 million spent, enjoy an **exclusive 10% discount** 
              on your next purchase. Time to add another gem to your collection!
            </Text>
          </Box>
          <Divider style={styles.divider} />

          {/* Gold Tier */}
          <Box style={styles.tierContainer}>
            <HStack alignItems="center">
              <Box style={[styles.iconContainer, { backgroundColor: "#FFD700" }]}>
                <MaterialCommunityIcons name="star" size={24} color={colors.white} />
              </Box>
              <Text style={[styles.tierTitle, { color: "#FFD700" }]}>Gold Tier</Text>
            </HStack>
            <Text style={styles.tierDescription}>
              ✨ Shining bright! With over 10 million spent, enjoy a **7% discount** on your next purchase. 
              Keep up the sparkle!
            </Text>
          </Box>
          <Divider style={styles.divider} />

          {/* Silver Tier */}
          <Box style={styles.tierContainer}>
            <HStack alignItems="center">
              <Box style={[styles.iconContainer, { backgroundColor: "#C0C0C0" }]}>
                <MaterialCommunityIcons name="medal" size={24} color={colors.white} />
              </Box>
              <Text style={[styles.tierTitle, { color: "#C0C0C0" }]}>Silver Tier</Text>
            </HStack>
            <Text style={styles.tierDescription}>
              🥈 You're climbing the ladder! With over 5 million spent, enjoy a **5% discount** on your next 
              purchase. Silver suits you!
            </Text>
          </Box>
          <Divider style={styles.divider} />

          {/* Bronze Tier */}
          <Box style={styles.tierContainer}>
            <HStack alignItems="center">
              <Box style={[styles.iconContainer, { backgroundColor: "#CD7F32" }]}>
                <MaterialCommunityIcons name="trophy" size={24} color={colors.white} />
              </Box>
              <Text style={[styles.tierTitle, { color: "#CD7F32" }]}>Bronze Tier</Text>
            </HStack>
            <Text style={styles.tierDescription}>
              🏅 Great start! With over 1 million spent, enjoy a **3% discount** on your next purchase. Keep 
              going for more rewards!
            </Text>
          </Box>
          <Divider style={styles.divider} />

          {/* Sapphire Tier */}
          <Box style={styles.tierContainer}>
            <HStack alignItems="center">
              <Box style={[styles.iconContainer, { backgroundColor: "#0F52BA" }]}>
                <MaterialCommunityIcons name="circle" size={24} color={colors.white} />
              </Box>
              <Text style={[styles.tierTitle, { color: "#0F52BA" }]}>Sapphire Tier</Text>
            </HStack>
            <Text style={styles.tierDescription}>
              💎 Welcome aboard! As a Sapphire member, you're on your way to unlocking amazing benefits. Let's 
              embark on this exciting journey together!
            </Text>
          </Box>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default LoyaltyInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.dark,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    color: colors.medium,
    textAlign: "center",
    marginTop: 8,
  },
  tierContainer: {
    paddingVertical: 16,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tierTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  tierDescription: {
    marginTop: 8,
    fontSize: 16,
    color: colors.medium,
    lineHeight: 22,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: colors.light,
    height: 1,
  },
});
