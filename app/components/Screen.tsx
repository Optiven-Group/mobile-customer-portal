import React, { ReactNode } from "react";
import { StyleSheet, SafeAreaView, ViewStyle } from "react-native";
import Constants from "expo-constants";
import { Box } from "@gluestack-ui/themed";

interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle;
}

const Screen: React.FC<ScreenProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <Box>{children}</Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
});

export default Screen;
