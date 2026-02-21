import React from "react";
import { StyleSheet, Dimensions, View, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Box, Text, VStack, HStack } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { LinearGradient } from "expo-linear-gradient";
import Screen from "../../app-components/Screen";

type OnboardingScreenProps = NativeStackScreenProps<AuthStackParamList, "Onboarding">;

const { width } = Dimensions.get("window");

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  return (
    <Screen style={styles.container}>
      {/* Main Image Overlay Screen */}
      <Box flex={1} bg="#1A1B22">
        <ImageBackground
          source={{ uri: "https://www.optiven.co.ke/wp-content/uploads/2026/02/ocean-view-ridge-gate.jpeg" }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Top Logo */}
          <Box position="absolute" top={40} alignSelf="center" zIndex={10}>
             <Image 
               source={require("../../../assets/logo.png")} 
               style={{ width: 140, height: 45, tintColor: "#FFFFFF" }}
               resizeMode="contain"
               alt="Optiven Logo"
             />
          </Box>

          {/* Strong Gradient Overlay for crisp Text Readability */}
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.75)", "#052e16"]}
            style={styles.gradient}
          />
          
          {/* Bottom Content Area */}
          <Box position="absolute" bottom={0} left={0} right={0} px="$6" pb="$12">
            <VStack space="xl">
              <VStack space="sm">
                <Text color="#FFFFFF" style={styles.welcomeText}>Welcome!</Text>
                <Text color="#E5E7EB" style={styles.descriptionText}>
                  Experience the joy of home ownership, easily accessible with a few simple taps.
                </Text>
              </VStack>
              
              <TouchableOpacity
                style={styles.startButton}
                activeOpacity={0.85}
                onPress={() => navigation.replace("Login")}
              >
                <Text style={styles.startButtonText}>Let's Start!</Text>
              </TouchableOpacity>
            </VStack>
          </Box>
        </ImageBackground>
      </Box>
    </Screen>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111", // Dark background for the whole screen
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    top: "10%", // Allow gradient to gradually take over more of the screen to smoothly anchor text
  },
  welcomeText: {
    fontSize: 42,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.9,
    paddingRight: 30, // Keep text from hitting the very edge like the design
  },
  startButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  startButtonText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "bold",
  },
});
