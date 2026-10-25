import { HttpRequest, HttpResponseInit } from "@azure/functions";

// Compares incoming origin against whitelist to prevent cross-origin exploitation
export function applyCORSHeaders(
  request: HttpRequest,
  response: HttpResponseInit
): HttpResponseInit {
  const origin = request.headers.get("origin");
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map(o => o.trim());

  if (origin && allowedOrigins.includes(origin)) {
    return {
      ...response,
      headers: {
        ...response.headers,
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    };
  }

  return response;
}
