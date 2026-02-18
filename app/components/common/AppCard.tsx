import React, { ReactNode } from "react";
import { Box, Card } from "@gluestack-ui/themed";
import { DimensionValue } from "react-native";

interface AppCardProps {
  children: ReactNode;
  variant?: "elevated" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  m?: any;
  p?: any;
}

const AppCard: React.FC<AppCardProps> = ({
  children,
  variant = "elevated",
  size = "md",
  m = "$4",
  p = "$4",
}) => {
  return (
    <Card size={size} variant={variant} m={m} p={p}>
      {children}
    </Card>
  );
};

export default AppCard;
