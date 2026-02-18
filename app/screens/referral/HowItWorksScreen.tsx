import React, { useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  Divider,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const STEPS = [
  { icon: "account-plus", title: "Refer a Friend", description: "Share your unique referral link, code, or QR code with friends and family." },
  { icon: "phone-check", title: "We Follow Up", description: "Our team contacts your referral and schedules a site visit." },
  { icon: "map-marker-check", title: "Site Visit", description: "Your referral visits the property and explores available plots." },
  { icon: "handshake", title: "Sale Closes", description: "When your referral makes a purchase, the sale is confirmed." },
  { icon: "cash-check", title: "Earn Commission", description: "You earn commission on each successful referral — paid directly to you!" },
];

const COMMISSION_STRUCTURE = [
  { tier: "Standard", rate: "1%", description: "On all property sales from your referrals" },
  { tier: "Premium", rate: "1.5%", description: "For 10+ successful referrals in a quarter" },
  { tier: "Elite", rate: "2%", description: "For 25+ successful referrals in a quarter" },
];

const FAQS = [
  { q: "How much can I earn per referral?", a: "You earn 1-2% of the property sale value depending on your tier. For example, on a KES 3M property you could earn KES 30,000 – KES 60,000." },
  { q: "When do I get paid?", a: "Commission is processed within 30 days of the sale being confirmed and payment received." },
  { q: "Can I refer multiple people?", a: "Absolutely! There is no limit on how many people you can refer. The more you refer, the more you earn." },
  { q: "What if my referral doesn't buy?", a: "No problem. You only earn commission on successful sales, but we appreciate every referral." },
  { q: "How can I track my referrals?", a: "Use the 'My Referrals' section to track the status of all your referrals in real-time." },
];

const HowItWorksScreen = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <Box bg={colors.primary} px="$5" pt="$5" pb="$8">
          <Heading size="xl" color="$white">How Referrals Work</Heading>
          <Text color="$white" size="sm" opacity={0.8} mt="$1">Your step-by-step guide to earning with Optiven</Text>
        </Box>

        {/* Steps */}
        <Box px="$4" mt={-16}>
          <Card variant="elevated" p="$4" borderRadius={14}>
            {STEPS.map((step, index) => (
              <HStack key={index} space="md" mb={index < STEPS.length - 1 ? "$4" : "$0"}>
                <VStack alignItems="center" w={40}>
                  <Box bg={colors.primary} w={36} h={36} borderRadius="$full" alignItems="center" justifyContent="center">
                    <MaterialCommunityIcons name={step.icon as any} size={18} color="white" />
                  </Box>
                  {index < STEPS.length - 1 && (
                    <Box w={2} h={24} bg={colors.primary + "30"} mt="$1" />
                  )}
                </VStack>
                <VStack flex={1} pt="$1">
                  <Text bold size="sm">{step.title}</Text>
                  <Text size="xs" color="$coolGray500" mt="$0.5">{step.description}</Text>
                </VStack>
              </HStack>
            ))}
          </Card>
        </Box>

        {/* Commission Structure */}
        <Box px="$4" mt="$5">
          <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg" mb="$3">Commission Structure</Heading>
          {COMMISSION_STRUCTURE.map((tier, index) => (
            <Card key={index} variant="elevated" p="$4" borderRadius={14} mb="$3">
              <HStack alignItems="center" justifyContent="space-between">
                <VStack flex={1}>
                  <Text bold size="sm">{tier.tier}</Text>
                  <Text size="xs" color="$coolGray500">{tier.description}</Text>
                </VStack>
                <Box bg={colors.primary + "18"} px="$3" py="$1.5" borderRadius="$full">
                  <Text bold size="md" color={colors.primary}>{tier.rate}</Text>
                </Box>
              </HStack>
            </Card>
          ))}
        </Box>

        {/* FAQs */}
        <Box px="$4" mt="$3">
          <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg" mb="$3">FAQs</Heading>
          <Card variant="elevated" p="$0" borderRadius={14} overflow="hidden">
            {FAQS.map((faq, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  onPress={() => setOpenFaq(openFaq === index ? null : index)}
                  style={styles.faqItem}
                >
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text bold size="sm" flex={1} pr="$2">{faq.q}</Text>
                    <MaterialCommunityIcons name={openFaq === index ? "chevron-up" : "chevron-down"} size={20} color={colors.coolGray} />
                  </HStack>
                  {openFaq === index && (
                    <Text size="xs" color="$coolGray600" mt="$2">{faq.a}</Text>
                  )}
                </TouchableOpacity>
                {index < FAQS.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card>
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default HowItWorksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  faqItem: { paddingHorizontal: 16, paddingVertical: 14 },
});
