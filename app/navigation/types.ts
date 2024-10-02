export type OverviewStackParamList = {
  Home: undefined;
  Properties: undefined;
  "Payment Schedule": {
    property: Property;
  };
  "View Receipts": {
    property: Property;
  };
  "Sales Agreement": undefined;
  "Select Property for Statements": undefined;
  "View Statements": {
    property: Property;
  };
  "Project Selection": undefined;
  "Property Selection": {
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
