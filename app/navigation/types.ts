export type AuthStackParamList = {
  Login: undefined;
  VerifyUser: undefined;
  VerifyOTP: {
    customerNumber?: string;
    email: string;
    forResetPassword?: boolean;
  };
  CreatePassword: {
    customerNumber?: string;
    email: string;
    otp: string;
    forResetPassword?: boolean;
  };
  ForgotPassword: undefined;
  ResetPassword: {
    email: string;
  };
};
