import { Task } from "../models/Task";
import { FormSettings } from "../models/FormSettings";

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

export interface TasksResponse extends ApiResponse<Task[]> {
  pagination?: PaginationMeta;
}

export interface FormSettingsResponse extends ApiResponse<FormSettings> {}
