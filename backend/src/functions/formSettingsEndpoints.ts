import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getFormSettings, updateFormSettings } from "../services/formSettingsService";
import { withErrorHandler } from "../utils/errorHandler";
import { applyCORSHeaders } from "../middleware/corsMiddleware";
import { FormSettingsResponse, ApiResponse } from "../types";
import { FormSettings } from "../models/FormSettings";

const getFormSettingsHandler = withErrorHandler(async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const organizationId = request.query.get('organizationId') || "default-org";
    const settings = await getFormSettings(organizationId);
    
    const response: HttpResponseInit = { 
        status: 200, 
        jsonBody: { success: true, data: settings } as FormSettingsResponse
    };
    return applyCORSHeaders(request, response);
});

const updateFormSettingsHandler = withErrorHandler(async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const organizationId = request.query.get('organizationId') || "default-org";
    const body = await request.json();
    const settings = await updateFormSettings(organizationId, body);
    
    const response: HttpResponseInit = { 
        status: 200, 
        jsonBody: { success: true, data: settings } as FormSettingsResponse
    };
    return applyCORSHeaders(request, response);
});

app.http('GetFormSettings', { methods: ['GET'], authLevel: 'anonymous', route: 'form-settings', handler: getFormSettingsHandler });
app.http('UpdateFormSettings', { methods: ['PUT'], authLevel: 'anonymous', route: 'form-settings', handler: updateFormSettingsHandler });
