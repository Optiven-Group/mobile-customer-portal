import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AddIcon,
  Box,
  Menu,
  MenuItem,
  MenuItemLabel,
  Icon,
  SettingsIcon,
  ExternalLinkIcon,
} from "@gluestack-ui/themed";
import colors from "../utils/colors";

interface ActionButtonProps {
  onPress: () => void;
}

export default function ActionButton({ onPress }: ActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View>
      <Menu
        placement="top left"
        trigger={({ ...triggerProps }) => (
          <TouchableOpacity {...triggerProps} onPress={toggleMenu}>
            <Box style={styles.container}>
              <MaterialCommunityIcons
                name="plus-circle"
                color={colors.white}
                size={32}
              />
            </Box>
          </TouchableOpacity>
        )}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <MenuItem key="Payment" textValue="Payment">
          <Icon as={ExternalLinkIcon} size="sm" mr="$2" />
          <MenuItemLabel size="sm">Make Payment</MenuItemLabel>
        </MenuItem>
        <MenuItem key="Settings" textValue="Settings">
          <Icon as={SettingsIcon} size="sm" mr="$2" />
          <MenuItemLabel size="sm">Settings</MenuItemLabel>
        </MenuItem>
        <MenuItem key="More" textValue="More">
          <Icon as={AddIcon} size="sm" mr="$2" />
          <MenuItemLabel size="sm">More</MenuItemLabel>
        </MenuItem>
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "green",
    height: 64,
    width: 64,
    borderRadius: 40,
    bottom: Platform.OS === "android" ? 15 : 10,
    borderColor: colors.white,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
