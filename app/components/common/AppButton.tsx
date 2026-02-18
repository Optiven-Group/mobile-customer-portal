import React from "react";
import { Button, ButtonText, ButtonSpinner, ButtonIcon } from "@gluestack-ui/themed";
import { DimensionValue } from "react-native";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "solid" | "outline" | "link";
  action?: "primary" | "secondary" | "positive" | "negative" | "default";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isDisabled?: boolean;
  isLoading?: boolean;
  leftIcon?: any;
  rightIcon?: any;
  mt?: any;
  mb?: any;
  ml?: any;
  mr?: any;
  width?: any;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = "solid",
  action = "primary",
  size = "md",
  isDisabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  mt,
  mb,
  ml,
  mr,
  width,
}) => {
  return (
    <Button
      size={size}
      variant={variant}
      action={action}
      isDisabled={isDisabled || isLoading}
      isFocusVisible={false}
      onPress={onPress}
      mt={mt}
      mb={mb}
      ml={ml}
      mr={mr}
      width={width}
    >
      {isLoading && <ButtonSpinner mr="$2" />}
      {leftIcon && <ButtonIcon as={leftIcon} mr="$2" />}
      <ButtonText>{title}</ButtonText>
      {rightIcon && <ButtonIcon as={rightIcon} ml="$2" />}
    </Button>
  );
};

export default AppButton;
