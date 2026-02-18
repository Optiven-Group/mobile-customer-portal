import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { Box, VStack, HStack, Text, Heading, Card, Image, Input, InputField, InputSlot, InputIcon } from "@gluestack-ui/themed";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Property, Project } from "../../navigation/types";
import api from "../../utils/api";

// Mock data for properties if API fails or for demo
const MOCK_PROPERTIES = [
  {
    id: 1,
    name: "Plot 45",
    project: "Amani Ridge",
    location: "Kiambu",
    size: "50x100",
    status: "Fully Paid",
    image: "https://www.optiven.co.ke/wp-content/uploads/2023/10/amani-ridge.jpg",
    price: 3500000,
    balance: 0,
  },
  {
    id: 2,
    name: "Plot 12",
    project: "Love Gardens",
    location: "Kajiado",
    size: "50x100",
    status: "Installment",
    image: "https://www.optiven.co.ke/wp-content/uploads/2023/10/love-gardens.jpg",
    price: 1500000,
    balance: 450000,
  },
];

const PropertiesListScreen = () => {
  const navigation = useNavigation<any>();
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProperties = async () => {
    try {
      // Simulate API call
      // const response = await api.get("/my-properties");
      // setProperties(response.data.properties);
      setTimeout(() => {
          setProperties(MOCK_PROPERTIES);
          setFilteredProperties(MOCK_PROPERTIES);
          setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch properties", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = properties.filter((prop) => 
        prop.project.toLowerCase().includes(text.toLowerCase()) || 
        prop.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate("PropertyDetail", { property: item })}>
      <Card p="$0" mb="$4" borderRadius="$lg" overflow="hidden" variant="elevated">
        <Image
          source={{ uri: item.image }}
          alt={item.project}
          w="$full"
          h={150}
          resizeMode="cover"
        />
        <Box p="$3">
          <HStack justifyContent="space-between" alignItems="center" mb="$1">
            <Heading size="sm">{item.project}</Heading>
            <Box bg={item.status === 'Fully Paid' ? "$success100" : "$warning100"} px="$2" py="$1" borderRadius="$sm">
                <Text size="xs" color={item.status === 'Fully Paid' ? "$success700" : "$warning700"} bold>{item.status}</Text>
            </Box>
          </HStack>
          <Text size="sm" color="$coolGray600" mb="$2">{item.name} • {item.location}</Text>
          <HStack alignItems="center" space="xs">
             <MaterialCommunityIcons name="ruler-square" size={16} color={colors.coolGray} />
             <Text size="xs" color="$coolGray500">{item.size}</Text>
          </HStack>
        </Box>
      </Card>
    </TouchableOpacity>
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
      <VStack space="md" p="$4">
        <Input variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false}>
          <InputSlot pl="$3">
            <InputIcon as={Feather} name="search" color="$coolGray400"/>
          </InputSlot>
          <InputField placeholder="Search properties..." value={searchQuery} onChangeText={handleSearch} />
        </Input>

        <FlatList
          data={filteredProperties}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text textAlign="center" mt="$10" color="$coolGray500">No properties found.</Text>}
          showsVerticalScrollIndicator={false}
        />
      </VStack>
    </Screen>
  );
};

export default PropertiesListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
