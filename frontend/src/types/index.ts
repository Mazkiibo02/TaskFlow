export interface Task {
  id?: string;
  title: string;
  description?: string;
  status: "To Do" | "In Progress" | "Done";
  organizationId?: string;
  [key: string]: any; // Allow custom fields
}

export interface FormField {
  id: string;
  type: "text" | "date" | "datetime" | "email";
  label: string;
  col?: number; // 0, 1, or 2 (for a 3-column layout)
  row?: number; // 0, 1, 2...
  colSpan?: number; // 1, 2, or 3
}

export interface FormSettings {
  id?: string;
  organizationId?: string;
  fields: FormField[];
}
