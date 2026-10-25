import { Task, FormSettings } from "./index";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  errorCode?: string;
  message?: string;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface TasksApiResponse extends ApiResponse<Task[]> {
  pagination?: PaginationMeta;
}

export interface FormSettingsApiResponse extends ApiResponse<FormSettings> {}
