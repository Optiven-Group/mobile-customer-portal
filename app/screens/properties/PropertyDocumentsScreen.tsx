import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface PropertyDocument {
  id: number;
  name: string;
  type: "sale_agreement" | "receipt" | "title_deed" | "valuation" | "other";
  date: string;
  size: string;
}

const MOCK_DOCUMENTS: PropertyDocument[] = [
  { id: 1, name: "Sale Agreement - Plot 45", type: "sale_agreement", date: "2023-10-12", size: "1.2 MB" },
  { id: 2, name: "Payment Receipt - Nov 2023", type: "receipt", date: "2023-11-15", size: "245 KB" },
  { id: 3, name: "Payment Receipt - Dec 2023", type: "receipt", date: "2023-12-15", size: "198 KB" },
  { id: 4, name: "Title Deed - Plot 45", type: "title_deed", date: "2024-02-20", size: "3.5 MB" },
  { id: 5, name: "Valuation Report", type: "valuation", date: "2024-01-10", size: "2.1 MB" },
];

const getDocIcon = (type: string): string => {
  switch (type) {
    case "sale_agreement": return "file-sign";
    case "receipt": return "receipt";
    case "title_deed": return "certificate";
    case "valuation": return "chart-bar";
    default: return "file-document";
  }
};

const getDocColor = (type: string): string => {
  switch (type) {
    case "sale_agreement": return colors.primary;
    case "receipt": return colors.success;
    case "title_deed": return colors.warning;
    case "valuation": return colors.tertiary;
    default: return colors.medium;
  }
};

const PropertyDocumentsScreen = () => {
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setDocuments(MOCK_DOCUMENTS);
      setLoading(false);
    }, 800);
  }, []);

  const handleDownload = (doc: PropertyDocument) => {
    Alert.alert("Download", `Downloading ${doc.name}...`, [{ text: "OK" }]);
  };

  const handlePreview = (doc: PropertyDocument) => {
    Alert.alert("Preview", `Previewing ${doc.name}...`, [{ text: "OK" }]);
  };

  const renderDocItem = ({ item }: { item: PropertyDocument }) => (
    <Card variant="elevated" p="$0" mb="$3" borderRadius="$lg" overflow="hidden">
      <HStack p="$4" space="md" alignItems="center">
        <Box bg={getDocColor(item.type) + "20"} p="$3" borderRadius="$lg">
          <MaterialCommunityIcons name={getDocIcon(item.type) as any} size={24} color={getDocColor(item.type)} />
        </Box>
        <VStack flex={1}>
          <Text bold size="sm" numberOfLines={1}>{item.name}</Text>
          <HStack space="sm" mt="$1">
            <Text size="2xs" color="$coolGray500">{new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</Text>
            <Text size="2xs" color="$coolGray400">•</Text>
            <Text size="2xs" color="$coolGray500">{item.size}</Text>
          </HStack>
        </VStack>
        <HStack space="sm">
          <TouchableOpacity onPress={() => handlePreview(item)} style={styles.iconBtn}>
            <MaterialCommunityIcons name="eye-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDownload(item)} style={styles.iconBtn}>
            <MaterialCommunityIcons name="download" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </HStack>
      </HStack>
    </Card>
  );

  if (loading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDocItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListHeaderComponent={
          <Box mb="$4">
            <Heading size="lg" mb="$1">Documents</Heading>
            <Text size="sm" color="$coolGray500">{documents.length} documents available</Text>
          </Box>
        }
        ListEmptyComponent={
          <Box py="$10" alignItems="center">
            <MaterialCommunityIcons name="file-document-outline" size={48} color={colors.coolGray} />
            <Text mt="$2" color="$coolGray500">No documents available.</Text>
          </Box>
        }
      />
    </Screen>
  );
};

export default PropertyDocumentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
});
