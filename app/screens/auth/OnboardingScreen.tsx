import React, { useState, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  TouchableOpacity,
} from "react-native";
import {
  Box,
  Center,
  Image,
  Text,
  VStack,
  HStack,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../../app-components/Screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

const { width, height } = Dimensions.get("window");

type OnboardingScreenProps = NativeStackScreenProps<AuthStackParamList, "Onboarding">;

const slides = [
  {
    id: "1",
    title: "Welcome to Optiven",
    description: "Experience the joy of home ownership with our visible transformation.",
    icon: "home-city" as const,
    color: "#388E3C",
  },
  {
    id: "2",
    title: "Manage Your Properties",
    description: "Track your payments, view statements, and manage your property portfolio with ease.",
    icon: "chart-line" as const,
    color: "#1B5E20",
  },
  {
    id: "3",
    title: "Seamless Communication",
    description: "Get real-time updates and meaningful engagement with us.",
    icon: "message-text-outline" as const,
    color: "#4CAF50",
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setCurrentIndex(Math.round(index));
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
    <Box width={width} alignItems="center" px="$8" justifyContent="center" style={{ paddingTop: height * 0.12 }}>
      {/* Icon Circle */}
      <Box style={[styles.iconCircle, { backgroundColor: item.color + "15" }]}>
        <MaterialCommunityIcons name={item.icon} size={60} color={item.color} />
      </Box>

      {/* Logo */}
      <Image
        alt="Optiven"
        source={require("../../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <VStack space="md" mt="$8" alignItems="center">
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
      </VStack>
    </Box>
  );

  return (
    <Screen style={styles.container}>
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />

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
        {/* Dots */}
        <HStack justifyContent="center" space="xs" mb="$8">
          {slides.map((_, index) => (
            <Box
              key={index}
              width={index === currentIndex ? 28 : 8}
              height={8}
              borderRadius="$full"
              bg={index === currentIndex ? "#388E3C" : "#C8E6C9"}
            />
          ))}
        </HStack>

        {/* Buttons */}
        <VStack space="md">
          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.nextButtonText}>
              {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>

          {currentIndex < slides.length - 1 && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
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
    backgroundColor: "#F5FBF6",
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.06,
  },
  circle1: {
    width: width * 1.0,
    height: width * 1.0,
    backgroundColor: "#4CAF50",
    top: -width * 0.5,
    right: -width * 0.3,
  },
  circle2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: "#81C784",
    bottom: -width * 0.15,
    left: -width * 0.2,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1B5E20",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  slideDescription: {
    fontSize: 15,
    color: "#66BB6A",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  nextButton: {
    backgroundColor: "#388E3C",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },
});
