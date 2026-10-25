import { getTasksContainer } from "../config/cosmos";
import { Task, TaskSchema } from "../models/Task";
import { AppError } from "../utils/errorHandler";

interface QueryParameter {
  name: string;
  value: string | number | boolean | null;
}

export const getTasks = async (organizationId?: string): Promise<Task[]> => {
    const container = await getTasksContainer();
    
    let query = "SELECT * FROM c";
    const parameters: QueryParameter[] = [];

    if (organizationId) {
        query += " WHERE c.organizationId = @orgId";
        parameters.push({ name: "@orgId", value: organizationId });
    }

    const { resources } = await container.items.query({ query, parameters }).fetchAll();
    return resources;
};

export const getTaskById = async (id: string): Promise<Task | null> => {
    const container = await getTasksContainer();
    try {
        const { resource } = await container.item(id, id).read();
        return resource as Task | null;
    } catch (e: any) {
        if (e.code === 404) return null;
        throw e;
    }
};

export const createTask = async (taskData: unknown): Promise<Task> => {
    const validatedData = TaskSchema.parse(taskData);
    const container = await getTasksContainer();
    const { resource } = await container.items.create(validatedData);
    return resource as Task;
};

export const updateTask = async (id: string, taskData: unknown): Promise<Task> => {
    const validatedData = TaskSchema.parse(taskData);
    const container = await getTasksContainer();
    
    const existing = await getTaskById(id);
    if (!existing) {
        throw new AppError(404, "TASK_NOT_FOUND", "Task not found");
    }

    // Upsert or replace
    const { resource } = await container.item(id, id).replace({ ...existing, ...validatedData });
    return resource as Task;
};

export const deleteTask = async (id: string): Promise<void> => {
    const container = await getTasksContainer();
    try {
        await container.item(id, id).delete();
    } catch (e: any) {
        if (e.code !== 404) {
            throw e;
        }
    }
};
