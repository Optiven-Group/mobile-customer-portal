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

// Project interface
export interface Project {
  project_id: number;
  name: string;
  epr_id: string;
  // other fields
}

// Property interface
export interface Property {
  lead_file_no: string;
  plot_number: string;
  // other fields
}

// Receipt interface
export interface Receipt {
  id: number;
  receipt_no: string;
  date_posted: string;
  project_name: string;
  plot_no: string;
  amount_lcy: number;
  // other fields
}
