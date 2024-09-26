export type MembershipTier =
  | "Platinum"
  | "Gold"
  | "Silver"
  | "Bronze"
  | "Sapphire";

export const tierColors: Record<MembershipTier, string> = {
  Platinum: "#E5E4E2", // Light Silver
  Gold: "#FFD700",
  Silver: "#C0C0C0",
  Bronze: "#CD7F32",
  Sapphire: "#0F52BA",
};
