import React from "react";
import { StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Screen from "../../app-components/Screen";
import colors from "../../utils/colors";
import { Box, VStack, HStack, Text, Heading, Button, ButtonText, Image, Divider, Icon } from "@gluestack-ui/themed";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const PropertyDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { property } = route.params;

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero Image */}
        <Image
          source={{ uri: property.image }}
          alt={property.project}
          w="$full"
          h={250}
          resizeMode="cover"
        />

        <Box p="$4" mt="-$6" bg="$white" borderTopLeftRadius={30} borderTopRightRadius={30} shadowColor="#000" shadowOpacity={0.1} shadowRadius={10} elevation={5}>
            {/* Title & Status */}
            <HStack justifyContent="space-between" alignItems="flex-start" mb="$2">
                <VStack>
                    <Heading size="lg" color={colors.primary}>{property.project}</Heading>
                    <Text size="md" color="$coolGray600" bold>{property.name}</Text>
                </VStack>
                 <Box bg={property.status === 'Fully Paid' ? "$success100" : "$warning100"} px="$3" py="$1" borderRadius="$full">
                    <Text size="sm" color={property.status === 'Fully Paid' ? "$success700" : "$warning700"} bold>{property.status}</Text>
                </Box>
            </HStack>
            
            <HStack alignItems="center" space="xs" mb="$4">
                <MaterialCommunityIcons name="map-marker" size={18} color={colors.coolGray} />
                <Text color="$coolGray500">{property.location}</Text>
            </HStack>

            <Divider my="$4" />

            {/* details grid */}
            <HStack flexWrap="wrap" justifyContent="space-between" mb="$6">
                <VStack w="45%" mb="$4">
                    <Text size="xs" color="$coolGray400">Size</Text>
                    <Heading size="sm">{property.size}</Heading>
                </VStack>
                <VStack w="45%" mb="$4">
                    <Text size="xs" color="$coolGray400">Total Price</Text>
                    <Heading size="sm">KES {property.price.toLocaleString()}</Heading>
                </VStack>
                 <VStack w="45%" mb="$4">
                    <Text size="xs" color="$coolGray400">Balance</Text>
                    <Heading size="sm" color={property.balance > 0 ? colors.danger : colors.success}>
                        KES {property.balance.toLocaleString()}
                    </Heading>
                </VStack>
                 <VStack w="45%" mb="$4">
                    <Text size="xs" color="$coolGray400">Purchase Date</Text>
                    <Heading size="sm">Oct 12, 2023</Heading>
                </VStack>
            </HStack>

            {/* Actions */}
            <VStack space="md">
                <Button size="lg" variant="solid" bg={colors.primary} onPress={() => navigation.navigate("Payment Schedule", { property })}>
                    <ButtonText>Make Payment</ButtonText>
                </Button>
                <HStack space="md">
                    <Button size="md" variant="outline" flex={1} borderColor={colors.secondary} onPress={() => navigation.navigate("PropertyDocuments", { property })}>
                        <ButtonText color={colors.secondary}>View Documents</ButtonText>
                    </Button>
                    <Button size="md" variant="outline" flex={1} borderColor={colors.tertiary} onPress={() => {}}>
                         <ButtonText color={colors.tertiary}>Statement</ButtonText>
                    </Button>
                </HStack>
            </VStack>

        </Box>
      </ScrollView>
    </Screen>
  );
};

export default PropertyDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
