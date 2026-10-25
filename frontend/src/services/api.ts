import { Task, FormSettings } from "../types";
import { ApiResponse, TasksApiResponse, FormSettingsApiResponse } from "../types/api";

const API_BASE_URL = "http://localhost:7071/api"; 

const handleResponse = async <T>(res: Response): Promise<T> => {
    const json = await res.json() as ApiResponse<T>;
    if (!res.ok || json.success === false) {
        throw new Error(json.message || json.errorCode || "API request failed");
    }
    return (json.data !== undefined ? json.data : json) as T;
};

export const fetchTasks = async (organizationId?: string): Promise<Task[]> => {
    const url = new URL(`${API_BASE_URL}/tasks`);
    if (organizationId) url.searchParams.append("organizationId", organizationId);
    
    const res = await fetch(url.toString());
    return handleResponse<Task[]>(res);
};

export const fetchTask = async (id: string): Promise<Task> => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`);
    return handleResponse<Task>(res);
};

export const createTask = async (task: Task): Promise<Task> => {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    return handleResponse<Task>(res);
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    return handleResponse<Task>(res);
};

export const deleteTask = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
    });
    if (res.status !== 204) {
        return handleResponse<void>(res);
    }
};

export const fetchFormSettings = async (organizationId?: string): Promise<FormSettings> => {
    const url = new URL(`${API_BASE_URL}/form-settings`);
    if (organizationId) url.searchParams.append("organizationId", organizationId);
    
    const res = await fetch(url.toString());
    return handleResponse<FormSettings>(res);
};

export const updateFormSettings = async (settings: FormSettings, organizationId?: string): Promise<FormSettings> => {
    const url = new URL(`${API_BASE_URL}/form-settings`);
    if (organizationId) url.searchParams.append("organizationId", organizationId);
    
    const res = await fetch(url.toString(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
    });
    return handleResponse<FormSettings>(res);
};
