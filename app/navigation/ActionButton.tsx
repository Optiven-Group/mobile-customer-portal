import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../utils/colors";
import { Box } from "@gluestack-ui/themed";

export default function ActionButton({
  onPress,
}: {
  onPress: (event: GestureResponderEvent) => void;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box style={styles.container}>
        <MaterialCommunityIcons
          name="plus-circle"
          color={colors.white}
          size={35}
        />
      </Box>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "green",
    height: 80,
    width: 80,
    borderRadius: 40,
    bottom: 32,
    borderColor: colors.white,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
