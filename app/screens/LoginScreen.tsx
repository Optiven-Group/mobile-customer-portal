import { StyleSheet } from "react-native";
import {
  Box,
  Button,
  ButtonText,
  Center,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Image,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import Screen from "../components/Screen";

const LoginScreen = () => {
  return (
    <Screen style={styles.container}>
      <Center>
        <Box width="$4/5">
          <Image
            alt="logo"
            style={styles.logo}
            source={require("../../assets/logo.png")}
            mb="$8"            
          />
          <FormControl
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            isRequired={true}
          >
            <FormControlLabel mb="$1">
              <FormControlLabelText size="md">Email</FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField type="text" />
            </Input>
          </FormControl>
          <FormControl
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            isRequired={true}
            mt="$2"
          >
            <FormControlLabel mb="$1">
              <FormControlLabelText size="md">Pin</FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField type="password" keyboardType="number-pad" maxLength={4} />
            </Input>
          </FormControl>
          <Button
            variant="solid"
            action="positive"
            mt="$4"
            size="lg"
            onPress={() => console.log("logged in")}
          >
            <ButtonText size="md">Login</ButtonText>
          </Button>
          <Box style={styles.forgotPasswordBtn}>
            <Button
              size="md"
              variant="link"
              action="primary"
              onPress={() => console.log("forgot pin")}
            >
              <ButtonText>Forgot Pin</ButtonText>
            </Button>
          </Box>
        </Box>
      </Center>
    </Screen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  logo: {
    alignSelf: "center",
    width: "100%",
  },
  forgotPasswordBtn: {
    alignSelf: "flex-start",
  },
});
