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
  // other account related screens
};

// InstallmentSchedule Interface
export interface InstallmentSchedule {
  is_id: number;
  due_date: string;
  installment_amount: string;
  paid: string;
  // Add any other fields as needed
}

// Root Stack Param List
export type RootStackParamList = {
  Main: undefined;
  MakePayment: {
    payment?: InstallmentSchedule;
    property?: Property;
  };
  Settings: undefined;
  Support: undefined;
};

// Existing Overview Stack Param List
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
  // Receipts Flow
  "Project Selection": undefined;
  "Property Selection": {
    project: Project;
  };
  // Payment Schedule Flow
  "Project Selection for Payment": undefined;
  "Property Selection for Payment": {
    project: Project;
  };
  // Statements Flow
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
  // other fields
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
  // other fields
}
