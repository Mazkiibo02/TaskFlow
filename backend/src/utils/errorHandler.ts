import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ZodError } from "zod";

/**
 * Custom error class for handling known business exceptions safely
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

type AzureHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;

export function withErrorHandler(handler: AzureHandler): AzureHandler {
    return async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        try {
            return await handler(request, context);
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(String(error));
            
            // Strip potential sensitive data from error object before logging to centralized monitoring
            context.error("Execution failed:", { 
                message: err.message, 
                stack: err.stack,
                url: request.url 
            });

            if (err instanceof ZodError) {
                return {
                    status: 400,
                    jsonBody: { 
                        success: false, 
                        message: "Validation Error", 
                        details: err.errors 
                    }
                };
            }

            if (err instanceof AppError) {
                return { 
                    status: err.statusCode, 
                    jsonBody: { 
                        success: false, 
                        errorCode: err.errorCode,
                        message: err.message 
                    } 
                };
            }

            // Always mask internal server errors to prevent stack trace or database implementation details leakage
            return { 
                status: 500, 
                jsonBody: { success: false, message: "An unexpected error occurred processing your request." }
            };
        }
    };
}
