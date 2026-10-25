import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from "../services/taskService";
import { withErrorHandler } from "../utils/errorHandler";
import { applyCORSHeaders } from "../middleware/corsMiddleware";
import { TasksResponse, ApiResponse } from "../types";
import { Task } from "../models/Task";

const getTasksHandler = withErrorHandler(async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const organizationId = request.query.get('organizationId') || undefined;
    const tasks = await getTasks(organizationId);
    
    const response: HttpResponseInit = { 
        status: 200, 
        jsonBody: { success: true, data: tasks } as TasksResponse
    };
    return applyCORSHeaders(request, response);
});

const getTaskHandler = withErrorHandler(async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const id = request.params.id;
    const task = await getTaskById(id);
    
    if (!task) {
        const notFoundResponse: HttpResponseInit = { status: 404, jsonBody: { success: false, message: "Task not found" } as ApiResponse };
        return applyCORSHeaders(request, notFoundResponse);
    }
    
    const response: HttpResponseInit = { 
        status: 200, 
        jsonBody: { success: true, data: task } as ApiResponse<Task>
    };
    return applyCORSHeaders(request, response);
});

const insertTaskHandler = withErrorHandler(async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const body = await request.json();
    const task = await createTask(body);
    
    const response: HttpResponseInit = { 
        status: 201, 
        jsonBody: { success: true, data: task } as ApiResponse<Task>
    };
    return applyCORSHeaders(request, response);
});

const updateTaskHandler = withErrorHandler(async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const id = request.params.id;
    const body = await request.json();
    const task = await updateTask(id, body);
    
    const response: HttpResponseInit = { 
        status: 200, 
        jsonBody: { success: true, data: task } as ApiResponse<Task>
    };
    return applyCORSHeaders(request, response);
});

const deleteTaskHandler = withErrorHandler(async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const id = request.params.id;
    await deleteTask(id);
    
    const response: HttpResponseInit = { status: 204 };
    return applyCORSHeaders(request, response);
});

app.http('GetTasks', { methods: ['GET'], authLevel: 'anonymous', route: 'tasks', handler: getTasksHandler });
app.http('GetTask', { methods: ['GET'], authLevel: 'anonymous', route: 'tasks/{id}', handler: getTaskHandler });
app.http('InsertTask', { methods: ['POST'], authLevel: 'anonymous', route: 'tasks', handler: insertTaskHandler });
app.http('UpdateTask', { methods: ['PUT'], authLevel: 'anonymous', route: 'tasks/{id}', handler: updateTaskHandler });
app.http('DeleteTask', { methods: ['DELETE'], authLevel: 'anonymous', route: 'tasks/{id}', handler: deleteTaskHandler });
