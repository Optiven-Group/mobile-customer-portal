export type AuthStackParamList = {
  Login: undefined;
  VerifyUser: undefined;
  VerifyOTP: { customerNumber: string; email: string };
  CreatePassword: { email: string; otp: string };
};
