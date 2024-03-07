import {
  Avatar,
  AvatarFallbackText,
  Box,
  Divider,
  VStack,
  ChevronRightIcon,
  Icon,
} from "@gluestack-ui/themed";
import Screen from "../components/Screen";
import { Text } from "@gluestack-ui/themed";
import { StyleSheet, TouchableHighlight } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../utils/colors";

const AccountScreen = () => {
  return (
    <Screen>
      <VStack>
        <Box style={styles.avatarContainer}>
          <Avatar bgColor="$green700" size="lg" borderRadius="$full">
            <AvatarFallbackText>Kasili Wachiye</AvatarFallbackText>
          </Avatar>
          <Box ml="$4">
            <Text bold>Kasili Wachiye</Text>
            <Text size="sm">wachiye25@gmail.com</Text>
          </Box>
        </Box>
        <Divider mt="$2" />
        <TouchableHighlight
          underlayColor={colors.light}
          onPress={() => console.log("Signed out")}
        >
          <Box style={styles.logoutContainer} py="$2">
            <Box style={styles.iconContainer}>
              <Avatar bgColor="$red600" size="lg" borderRadius="$full">
                <MaterialCommunityIcons
                  name={"logout"}
                  color={"white"}
                  size={20}
                />
              </Avatar>
              <Text ml="$4" bold>
                Logout
              </Text>
            </Box>
            <Box ml="$4">
              <Icon as={ChevronRightIcon} size="lg" color="black" />
            </Box>
          </Box>
        </TouchableHighlight>
      </VStack>
    </Screen>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  avatarContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  logoutContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});