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

const RegisterScreen = () => {
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
              <FormControlLabelText size="xs">Full Name</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField type="text" />
            </Input>
          </FormControl>
          <FormControl
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            isRequired={true}
          >
            <FormControlLabel mb="$1">
              <FormControlLabelText size="xs">Email</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField type="text" />
            </Input>
          </FormControl>
          <FormControl
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            isRequired={true}
            mt="$1"
          >
            <FormControlLabel mb="$1">
              <FormControlLabelText size="xs">Password</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField type="password" />
            </Input>
          </FormControl>
          <FormControl
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            isRequired={true}
            mt="$1"
          >
            <FormControlLabel mb="$1">
              <FormControlLabelText size="xs">
                Confirm Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField type="password" />
            </Input>
          </FormControl>
          <Button
            variant="solid"
            action="primary"
            isDisabled={false}
            isFocusVisible={false}
            mt="$4"
          >
            <ButtonText>Login</ButtonText>
          </Button>
        </Box>
      </Center>
    </Screen>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  logo: {
    alignSelf: "center",
  },
});
