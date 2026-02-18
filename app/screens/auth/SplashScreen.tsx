import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, Easing, View, Dimensions } from "react-native";
import { Box, Center, Image, Text } from "@gluestack-ui/themed";
import Screen from "../../app-components/Screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import Constants from "expo-constants";

const { width } = Dimensions.get("window");

type SplashScreenProps = NativeStackScreenProps<AuthStackParamList, "Splash">;

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Text slide-up after logo
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // Subtle pulse on logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate after splash
    const timer = setTimeout(() => {
      navigation.replace("Onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Screen style={styles.container}>
      {/* Decorative circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />

      <Center flex={1}>
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }],
          }}
        >
          <Image
            alt="Optiven Logo"
            source={require("../../../assets/logo.png")}
            style={styles.logo}
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <Text style={styles.brand}>OPTIVEN</Text>
          <Text style={styles.tagline}>Inspiring Possibilities</Text>
        </Animated.View>
      </Center>

      {/* Bottom version */}
      <Animated.View style={[styles.footer, { opacity: textOpacity }]}>
        <Text style={styles.version}>
          v{Constants.expoConfig?.version || "2.0.31"}
        </Text>
      </Animated.View>
    </Screen>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8F5E9",
  },

  // Decorative background circles
  circle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.12,
  },
  circle1: {
    width: width * 1.2,
    height: width * 1.2,
    backgroundColor: "#A5D6A7",
    top: -width * 0.4,
    right: -width * 0.3,
  },
  circle2: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: "#C8E6C9",
    bottom: -width * 0.2,
    left: -width * 0.25,
  },
  circle3: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: "#81C784",
    top: "45%",
    right: -width * 0.15,
  },

  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },

  brand: {
    fontSize: 28,
    fontWeight: "300",
    letterSpacing: 12,
    color: "#1B5E20",
  },
  tagline: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 3,
    color: "#5A0000",
    marginTop: 6,
  },

  footer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  version: {
    fontSize: 11,
    color: "#66BB6A",
    letterSpacing: 1,
  },
});
