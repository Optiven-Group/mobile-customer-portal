// Auth Stack Param List
export type AuthStackParamList = {
  Login: undefined;
  VerifyUser: undefined;
  VerifyOTP: undefined;
  CreatePassword: undefined;
  ForgotPassword: undefined;
};

// Account Stack Param List
export type AccountStackParamList = {
  Account: undefined;
  Deals: undefined;
  LoyaltyProgramInfo: undefined;
  PersonalDetails: undefined;
  EditDetails: {
    name: string;
    email: string;
    phone: string;
  };
};

// InstallmentSchedule Interface
export interface InstallmentSchedule {
  is_id: number;
  due_date: string;
  installment_amount: string;
  paid: string;
}

// Root Stack Param List
export type RootStackParamList = {
  Main: undefined;
  StripePayment: {
    payment: InstallmentSchedule;
    property: Property;
  };
  PaymentMethod: { payment: InstallmentSchedule; property: Property };
  MpesaPayment: { payment: InstallmentSchedule; property: Property };
  Settings: undefined;
  Support: undefined;
  Refer: undefined;
  Notifications: undefined;
};

// Overview Stack Param List
export type OverviewStackParamList = {
  Home: undefined;
  "Payment Schedule": {
    property: Property;
  };
  "View Receipts": {
    property: Property;
  };
  "Sales Agreement": undefined;
  "View Statements": {
    property: Property;
  };
  "Project Selection": undefined;
  "Property Selection": {
    project: Project;
  };
  "Project Selection for Payment": undefined;
  "Property Selection for Payment": {
    project: Project;
  };
  "Project Selection for Statements": undefined;
  "Property Selection for Statements": {
    project: Project;
  };
};

// Project Interface
export interface Project {
  project_id: number;
  name: string;
  epr_id: string;
}

// Property Interface
export interface Property {
  lead_file_no: string;
  plot_number: string;
  code: string;
}

// Receipt Interface
export interface Receipt {
  id: number;
  receipt_no: string;
  date_posted: string;
  project_name: string;
  plot_no: string;
  amount_lcy: number;
}

export type ReferralStackParamList = {
  ReferralHome: undefined;
  HowItWorks: undefined;
  ReferSomeone: { project: Project };
  FeaturedProjects: undefined;
  ReferralProgress: undefined;
};

export interface Project {
  project_id: number;
  name: string;
  epr_id: string;
  description: string;
  banner: string;
  is_featured: boolean;
}
