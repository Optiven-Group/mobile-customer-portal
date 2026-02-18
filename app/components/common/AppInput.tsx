import React from "react";
import {
  Input,
  InputField,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  AlertCircleIcon,
} from "@gluestack-ui/themed";

interface AppInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: "text" | "password";
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  mt?: string | number;
  mb?: string | number;
  isRequired?: boolean;
}

const AppInput: React.FC<AppInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = "text",
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  size = "md",
  mt,
  mb,
  isRequired = false,
}) => {
  return (
    <FormControl
      isInvalid={isInvalid}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      size={size}
      mt={mt}
      mb={mb}
    >
      {label && (
        <FormControlLabel mb="$1">
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      )}
      <Input>
        <InputField
          type={type}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
      </Input>
      {isInvalid && errorMessage && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{errorMessage}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};

export default AppInput;
