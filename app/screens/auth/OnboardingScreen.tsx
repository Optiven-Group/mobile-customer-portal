import React, { useState, useRef } from "react";
import { StyleSheet, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Box, Center, Image, Text, VStack, HStack } from "@gluestack-ui/themed";
import Screen from "../../app-components/Screen";
import AppButton from "../../components/common/AppButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

const { width, height } = Dimensions.get("window");

type OnboardingScreenProps = NativeStackScreenProps<AuthStackParamList, "Onboarding">;

const slides = [
  {
    id: "1",
    title: "Welcome to Optiven",
    description: "Experience the joy of home ownership with our visible transformation.",
    image: require("../../../assets/logo.png"), // Placeholder for standard onboarding image
  },
  {
    id: "2",
    title: "Manage Your Properties",
    description: "Track your payments, view statements, and manage your property portfolio with ease.",
    image: require("../../../assets/logo.png"), 
  },
  {
    id: "3",
    title: "Seamless Communication",
    description: "Get real-time updates and meaningful engagement with us.",
    image: require("../../../assets/logo.png"),
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentIndex(roundIndex);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace("Login");
    }
  };

  const handleSkip = () => {
    navigation.replace("Login");
  };

  const renderItem = ({ item }: { item: typeof slides[0] }) => (
    <Box width={width} alignItems="center" px="$8" pt="$20">
      <Image
        alt={item.title}
        source={item.image}
        style={styles.image}
        resizeMode="contain"
      />
      <VStack space="md" mt="$10" alignItems="center">
        <Text size="2xl" bold textAlign="center" color="$textDark900">
          {item.title}
        </Text>
        <Text size="md" textAlign="center" color="$textLight500" px="$4">
          {item.description}
        </Text>
      </VStack>
    </Box>
  );

  return (
    <Screen style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        keyExtractor={(item) => item.id}
      />
      
      <Box position="absolute" bottom="$10" width="100%" px="$8">
        <HStack justifyContent="center" space="xs" mb="$8">
          {slides.map((_, index) => (
            <Box
              key={index}
              width={index === currentIndex ? 24 : 8}
              height={8}
              borderRadius="$full"
              bg={index === currentIndex ? "$primary500" : "$gray300"}
            />
          ))}
        </HStack>
        
        <VStack space="md">
            <AppButton
                title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
                onPress={handleNext}
            />
            {currentIndex < slides.length - 1 && (
                <AppButton
                    title="Skip"
                    variant="link"
                    onPress={handleSkip}
                    mt="$2"
                />
            )}
        </VStack>
      </Box>
    </Screen>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: width * 0.8,
    height: height * 0.3,
  },
});
