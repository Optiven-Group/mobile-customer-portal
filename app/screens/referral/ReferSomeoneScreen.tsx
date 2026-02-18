import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Clipboard,
  Dimensions,
} from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { useAuth } from "../../context/AuthContext";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  Input,
  InputField,
  Button,
  ButtonText,
  Divider,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type TabKey = "link" | "code" | "qr" | "manual";

const ReferSomeoneScreen = () => {
  const { user } = useAuth();
  const route = useRoute<any>();
  const project = route.params?.project;
  const [activeTab, setActiveTab] = useState<TabKey>("link");
  const [manualForm, setManualForm] = useState({ name: "", phone: "", email: "", notes: "" });

  const referralCode = `${user?.customerNumber || "OPT"}-REF-2024`;
  const referralLink = `https://www.optiven.co.ke/referral?code=${referralCode}${project ? `&project=${project.project_id}` : ""}`;

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    // In production, show a toast
  };

  const handleShare = async (medium?: string) => {
    const msg = project
      ? `Join me in the ${project.name} project at Optiven! Use my referral code: ${referralCode}. ${referralLink}`
      : `Invest in real estate with Optiven! Use my referral code: ${referralCode}. ${referralLink}`;

    try {
      await Share.share({ message: msg, url: referralLink });
    } catch (e) {
      console.log("Share error", e);
    }
  };

  const handleSubmitManual = () => {
    // Mock submit
    console.log("Manual referral submitted", manualForm);
    setManualForm({ name: "", phone: "", email: "", notes: "" });
  };

  const Tab = ({ label, tabKey, icon }: { label: string; tabKey: TabKey; icon: string }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tabKey)}
      style={[styles.tab, activeTab === tabKey && styles.tabActive]}
    >
      <MaterialCommunityIcons name={icon as any} size={18} color={activeTab === tabKey ? colors.primary : colors.coolGray} />
      <Text size="2xs" bold mt="$0.5" color={activeTab === tabKey ? colors.primary : "$coolGray500"}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Project header (if from Featured Projects) */}
        {project && (
          <Box bg={colors.primary} px="$5" py="$4">
            <Text color="$white" size="sm" opacity={0.8}>Referring for</Text>
            <Heading size="md" color="$white">{project.name}</Heading>
          </Box>
        )}

        {/* Tab Selector */}
        <Box px="$4" mt="$4">
          <HStack justifyContent="space-between">
            <Tab label="Link" tabKey="link" icon="link-variant" />
            <Tab label="Code" tabKey="code" icon="content-copy" />
            <Tab label="QR Code" tabKey="qr" icon="qrcode" />
            <Tab label="Manual" tabKey="manual" icon="account-plus" />
          </HStack>
        </Box>

        <Box px="$4" mt="$5">
          {/* Share Link Tab */}
          {activeTab === "link" && (
            <VStack space="md">
              <Card variant="elevated" p="$4" borderRadius={14}>
                <Text size="xs" color="$coolGray500" mb="$2">Your unique referral link</Text>
                <Box bg="$coolGray100" p="$3" borderRadius={10}>
                  <Text size="xs" numberOfLines={2} color="$coolGray700">{referralLink}</Text>
                </Box>
                <TouchableOpacity style={styles.copyBtn} onPress={() => copyToClipboard(referralLink)}>
                  <MaterialCommunityIcons name="content-copy" size={16} color={colors.primary} />
                  <Text size="xs" bold color={colors.primary} ml="$1">Copy Link</Text>
                </TouchableOpacity>
              </Card>

              <Heading size="xs" color={colors.secondary} textTransform="uppercase" letterSpacing="$lg">Share via</Heading>
              <HStack space="md" flexWrap="wrap">
                <TouchableOpacity style={styles.shareBtn} onPress={() => handleShare("whatsapp")}>
                  <MaterialCommunityIcons name="whatsapp" size={28} color="#25D366" />
                  <Text size="2xs" mt="$1">WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareBtn} onPress={() => handleShare("sms")}>
                  <MaterialCommunityIcons name="message-text" size={28} color={colors.primary} />
                  <Text size="2xs" mt="$1">SMS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareBtn} onPress={() => handleShare("email")}>
                  <MaterialCommunityIcons name="email" size={28} color={colors.secondary} />
                  <Text size="2xs" mt="$1">Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareBtn} onPress={() => handleShare()}>
                  <MaterialCommunityIcons name="share-variant" size={28} color={colors.tertiary} />
                  <Text size="2xs" mt="$1">More</Text>
                </TouchableOpacity>
              </HStack>
            </VStack>
          )}

          {/* Share Code Tab */}
          {activeTab === "code" && (
            <Card variant="elevated" p="$5" borderRadius={14} alignItems="center">
              <Text size="xs" color="$coolGray500" mb="$2">Your Referral Code</Text>
              <Heading size="2xl" color={colors.primary} mb="$3">{referralCode}</Heading>
              <HStack space="md">
                <TouchableOpacity style={styles.copyBtn} onPress={() => copyToClipboard(referralCode)}>
                  <MaterialCommunityIcons name="content-copy" size={16} color={colors.primary} />
                  <Text size="xs" bold color={colors.primary} ml="$1">Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.copyBtn} onPress={() => handleShare()}>
                  <MaterialCommunityIcons name="share-variant" size={16} color={colors.primary} />
                  <Text size="xs" bold color={colors.primary} ml="$1">Share</Text>
                </TouchableOpacity>
              </HStack>
            </Card>
          )}

          {/* QR Code Tab */}
          {activeTab === "qr" && (
            <Card variant="elevated" p="$5" borderRadius={14} alignItems="center">
              <Text size="xs" color="$coolGray500" mb="$3">Scan to refer</Text>
              <Box bg="$white" p="$4" borderRadius={12} borderWidth={2} borderColor="$coolGray200">
                {/* Placeholder QR - in production use react-native-qrcode-svg */}
                <Box w={180} h={180} bg="$coolGray100" alignItems="center" justifyContent="center" borderRadius={8}>
                  <MaterialCommunityIcons name="qrcode" size={120} color={colors.primary} />
                </Box>
              </Box>
              <Text size="xs" bold color={colors.primary} mt="$3">{referralCode}</Text>
              <HStack space="md" mt="$3">
                <TouchableOpacity style={styles.copyBtn} onPress={() => {}}>
                  <MaterialCommunityIcons name="download" size={16} color={colors.primary} />
                  <Text size="xs" bold color={colors.primary} ml="$1">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.copyBtn} onPress={() => handleShare()}>
                  <MaterialCommunityIcons name="share-variant" size={16} color={colors.primary} />
                  <Text size="xs" bold color={colors.primary} ml="$1">Share</Text>
                </TouchableOpacity>
              </HStack>
            </Card>
          )}

          {/* Manual Entry Tab */}
          {activeTab === "manual" && (
            <Card variant="elevated" p="$4" borderRadius={14}>
              <Text size="xs" color="$coolGray500" mb="$3">Enter referee details manually</Text>
              <VStack space="md">
                <Input variant="outline" size="md">
                  <InputField placeholder="Full Name *" value={manualForm.name} onChangeText={(t) => setManualForm({ ...manualForm, name: t })} />
                </Input>
                <Input variant="outline" size="md">
                  <InputField placeholder="Phone Number *" keyboardType="phone-pad" value={manualForm.phone} onChangeText={(t) => setManualForm({ ...manualForm, phone: t })} />
                </Input>
                <Input variant="outline" size="md">
                  <InputField placeholder="Email (optional)" keyboardType="email-address" value={manualForm.email} onChangeText={(t) => setManualForm({ ...manualForm, email: t })} />
                </Input>
                <Input variant="outline" size="lg">
                  <InputField placeholder="Notes (optional)" multiline value={manualForm.notes} onChangeText={(t) => setManualForm({ ...manualForm, notes: t })} />
                </Input>
                <Button bg={colors.primary} borderRadius={12} mt="$2" onPress={handleSubmitManual}>
                  <ButtonText>Submit Referral</ButtonText>
                </Button>
              </VStack>
            </Card>
          )}
        </Box>
      </ScrollView>
    </Screen>
  );
};

export default ReferSomeoneScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  tab: { alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: "#F3F4F6", flex: 1, marginHorizontal: 4 },
  tabActive: { backgroundColor: colors.primary + "15", borderWidth: 1, borderColor: colors.primary },
  copyBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, backgroundColor: colors.primary + "12", marginTop: 12 },
  shareBtn: { alignItems: "center", width: (width - 80) / 4, paddingVertical: 12, borderRadius: 12, backgroundColor: "#F9FAFB" },
});
