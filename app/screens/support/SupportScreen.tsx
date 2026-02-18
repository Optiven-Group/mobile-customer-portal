import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
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
  Divider,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How do I make a payment for my property?",
    answer:
      'Navigate to Payments from the sidebar or Dashboard, select your property, and choose your preferred payment method (M-Pesa, Bank Transfer, or Card). Follow the on-screen instructions to complete the payment.',
  },
  {
    question: "How do I check my payment schedule?",
    answer:
      'Go to the Home screen and tap "Pay Now" or navigate to your property details. Your installment schedule with due dates and amounts will be displayed.',
  },
  {
    question: "How does the referral program work?",
    answer:
      "Share your unique referral link or code with friends and family. When they purchase a property through Optiven, you earn a commission. Track your referrals from the Refer & Earn section.",
  },
  {
    question: "How do I download my financial statement?",
    answer:
      'Navigate to Payments > Payment History and tap "Download Statement". You can filter by date range and property before downloading.',
  },
  {
    question: "How do I update my profile information?",
    answer:
      "Go to My Profile from the sidebar menu, then tap Edit Profile to update your personal details, contact information, and profile picture.",
  },
  {
    question: "What should I do if I forgot my password?",
    answer:
      'On the login screen, tap "Forgot Password". Enter your registered email or phone number and follow the OTP verification process to set a new password.',
  },
];

const SupportScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const ContactCard = ({
    icon,
    title,
    subtitle,
    onPress,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity onPress={onPress}>
      <Card variant="elevated" p="$4" mb="$3" borderRadius="$lg">
        <HStack space="md" alignItems="center">
          <Box bg={colors.primary + "15"} p="$3" borderRadius="$full">
            <MaterialCommunityIcons
              name={icon as any}
              size={24}
              color={colors.primary}
            />
          </Box>
          <VStack flex={1}>
            <Text bold size="sm">
              {title}
            </Text>
            <Text size="xs" color="$coolGray500">
              {subtitle}
            </Text>
          </VStack>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color={colors.coolGray}
          />
        </HStack>
      </Card>
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <Box
          bg={colors.primary}
          px="$4"
          py="$6"
          borderBottomLeftRadius={30}
          borderBottomRightRadius={30}
        >
          <VStack space="md" alignItems="center">
            <MaterialCommunityIcons
              name="headset"
              size={48}
              color="white"
            />
            <Heading size="xl" color="$white" textAlign="center">
              How can we help?
            </Heading>
            <Box
              w="$full"
              bg="$white"
              borderRadius="$lg"
              px="$3"
              mt="$2"
            >
              <HStack alignItems="center">
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  color={colors.coolGray}
                />
                <TextInput
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                  placeholderTextColor="#9CA3AF"
                />
              </HStack>
            </Box>
          </VStack>
        </Box>

        {/* Contact Options */}
        <Box px="$4" mt="$6">
          <Heading size="sm" mb="$3" color="$coolGray600" textTransform="uppercase">
            Contact Us
          </Heading>
          <ContactCard
            icon="phone"
            title="Call Us"
            subtitle="+254 790 300 300"
            onPress={() => Linking.openURL("tel:+254790300300")}
          />
          <ContactCard
            icon="whatsapp"
            title="WhatsApp"
            subtitle="Chat with support"
            onPress={() => Linking.openURL("https://wa.me/254790300300")}
          />
          <ContactCard
            icon="email"
            title="Email Support"
            subtitle="info@optiven.co.ke"
            onPress={() => Linking.openURL("mailto:info@optiven.co.ke")}
          />
        </Box>

        {/* FAQs */}
        <Box px="$4" mt="$6">
          <Heading size="sm" mb="$3" color="$coolGray600" textTransform="uppercase">
            Frequently Asked Questions
          </Heading>
          {filteredFAQs.map((faq, index) => (
            <Card
              key={index}
              variant="elevated"
              p="$0"
              mb="$2"
              borderRadius="$lg"
              overflow="hidden"
            >
              <TouchableOpacity onPress={() => toggleExpand(index)}>
                <HStack
                  p="$4"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text bold size="sm" flex={1} mr="$2">
                    {faq.question}
                  </Text>
                  <MaterialCommunityIcons
                    name={
                      expandedIndex === index ? "chevron-up" : "chevron-down"
                    }
                    size={22}
                    color={colors.coolGray}
                  />
                </HStack>
              </TouchableOpacity>
              {expandedIndex === index && (
                <Box px="$4" pb="$4" bg="$coolGray50">
                  <Text size="sm" color="$coolGray600" lineHeight="$lg">
                    {faq.answer}
                  </Text>
                </Box>
              )}
            </Card>
          ))}
          {filteredFAQs.length === 0 && (
            <Box py="$6" alignItems="center">
              <Text color="$coolGray500">
                No results found for "{searchQuery}"
              </Text>
            </Box>
          )}
        </Box>

        {/* Create Ticket CTA */}
        <Box px="$4" mt="$6">
          <Card
            bg={colors.secondary + "10"}
            p="$6"
            borderRadius="$lg"
            alignItems="center"
          >
            <MaterialCommunityIcons
              name="ticket-confirmation"
              size={40}
              color={colors.secondary}
            />
            <Heading size="sm" mt="$2" textAlign="center">
              Still need help?
            </Heading>
            <Text
              size="sm"
              color="$coolGray600"
              textAlign="center"
              mt="$1"
              mb="$3"
            >
              Create a support ticket and our team will get back to you.
            </Text>
            <Button
              size="md"
              bg={colors.secondary}
              borderRadius="$full"
              onPress={() => {}}
            >
              <ButtonText>Create Support Ticket</ButtonText>
            </Button>
          </Card>
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#1F2937",
  },
});
