import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
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

const DOC_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  sale_agreement: { icon: "file-sign", color: "#388E3C", label: "Agreement" },
  receipt: { icon: "receipt", color: "#2E7D32", label: "Receipt" },
  title_deed: { icon: "certificate", color: "#F59E0B", label: "Title" },
  valuation: { icon: "chart-bar", color: "#6366F1", label: "Valuation" },
  other: { icon: "file-document", color: "#6B7280", label: "Document" },
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

  const renderDocItem = ({ item }: { item: PropertyDocument }) => {
    const config = DOC_CONFIG[item.type] || DOC_CONFIG.other;

    return (
      <View style={styles.docCard}>
        <HStack space="md" alignItems="center">
          <View style={[styles.docIcon, { backgroundColor: config.color + "15" }]}>
            <MaterialCommunityIcons name={config.icon as any} size={22} color={config.color} />
          </View>
          <VStack flex={1}>
            <Text bold size="sm" color="#1F2937" numberOfLines={1}>{item.name}</Text>
            <HStack space="sm" mt="$1" alignItems="center">
              <View style={[styles.typeBadge, { backgroundColor: config.color + "12" }]}>
                <Text size="2xs" bold color={config.color}>{config.label}</Text>
              </View>
              <Text size="2xs" color="#9CA3AF">{new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</Text>
              <Text size="2xs" color="#D1D5DB">•</Text>
              <Text size="2xs" color="#9CA3AF">{item.size}</Text>
            </HStack>
          </VStack>
        </HStack>

        <HStack space="sm" mt="$3" justifyContent="flex-end">
          <TouchableOpacity onPress={() => handlePreview(item)} style={styles.actionBtn}>
            <MaterialCommunityIcons name="eye-outline" size={16} color="#388E3C" />
            <Text size="2xs" color="#388E3C" bold ml="$1">Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDownload(item)} style={[styles.actionBtn, styles.downloadBtn]}>
            <MaterialCommunityIcons name="download" size={16} color="#FFF" />
            <Text size="2xs" color="$white" bold ml="$1">Download</Text>
          </TouchableOpacity>
        </HStack>
      </View>
    );
  };

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
          <View style={styles.headerCard}>
            <HStack alignItems="center" space="sm">
              <View style={styles.headerIcon}>
                <MaterialCommunityIcons name="folder-open-outline" size={22} color="#388E3C" />
              </View>
              <VStack>
                <Heading size="md" color="#1B5E20">Documents</Heading>
                <Text size="xs" color="#6B7280">{documents.length} documents available</Text>
              </VStack>
            </HStack>
          </View>
        }
        ListEmptyComponent={
          <Box py="$10" alignItems="center">
            <MaterialCommunityIcons name="file-document-outline" size={48} color="#D1D5DB" />
            <Text mt="$2" color="#9CA3AF">No documents available.</Text>
          </Box>
        }
      />
    </Screen>
  );
};

export default PropertyDocumentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FBF6" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  docCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  docIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "#F0F7F1",
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  downloadBtn: {
    backgroundColor: "#388E3C",
    borderColor: "#388E3C",
  },
});
