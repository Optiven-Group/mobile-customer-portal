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
  Account: undefined;
};

export type OverviewStackParamList = {
  Home: undefined;
  Properties: undefined;
  "Payment Schedule": {
    property: Property;
  };
  "View Receipts": undefined;
  "Sales Agreement": undefined;
  "Select Property for Statements": undefined;
  "View Statements": {
    property: Property;
  };
};

// Define the Property interface
export interface Property {
  lead_file_no: string;
  plot_number: string;
}
