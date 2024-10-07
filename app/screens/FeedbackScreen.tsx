import { StyleSheet } from "react-native";
import {
  FormControlLabel,
  Image,
  Center,
  Box,
  FormControl,
  Button,
  ButtonText,
  FormControlLabelText,
  Textarea,
  TextareaInput,
} from "@gluestack-ui/themed";
import Screen from "../app-components/Screen";

const FeedbackScreen = () => {
  return (
    <Screen style={styles.container}>
      <Center>
        <Box width="$4/5">
          <Image
            alt="logo"
            style={styles.logo}
            source={require("../../assets/icon.png")}
            mb="$4"
          />
          <FormControl
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            isRequired={true}
          >
            <FormControlLabel mb="$1">
              <FormControlLabelText size="sm">Feedback</FormControlLabelText>
            </FormControlLabel>

            <Textarea>
              <TextareaInput placeholder="Your text goes here..." />
            </Textarea>
          </FormControl>
          <Button
            variant="solid"
            action="positive"
            isDisabled={false}
            isFocusVisible={false}
            mt="$4"
            size="lg"
            onPress={() => console.log("feedback submitted")}
          >
            <ButtonText size="sm">Submit</ButtonText>
          </Button>
        </Box>
      </Center>
    </Screen>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  logo: {
    alignSelf: "center",
  },
});
