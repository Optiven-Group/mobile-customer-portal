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
  MakePayment: {
    payment: InstallmentSchedule;
    property: Property;
  };
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
