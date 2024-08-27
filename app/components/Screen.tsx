import React, { ReactNode } from "react";
import { StyleSheet, SafeAreaView, ViewStyle } from "react-native";
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
    flex: 1,
  },
});

export default Screen;
