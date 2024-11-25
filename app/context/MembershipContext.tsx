import React, { createContext, useState, useContext, ReactNode } from "react";

type MembershipContextType = {
  membershipTier: string;
  setMembershipTier: (tier: string) => void;
};

const MembershipContext = createContext<MembershipContextType | undefined>(
  undefined
);

export const MembershipProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [membershipTier, setMembershipTier] = useState<string>("Sapphire"); // Default tier

  return (
    <MembershipContext.Provider value={{ membershipTier, setMembershipTier }}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = (): MembershipContextType => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error("useMembership must be used within a MembershipProvider");
  }
  return context;
};
