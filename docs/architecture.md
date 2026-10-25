# System Architecture

## 1. High-Level Architecture
The application is a standard decoupled Web SPA communicating with a Serverless Backend over HTTP REST APIs.

```mermaid
graph TD
    Client[React SPA (frontend)] -->|REST API| Functions[Azure Functions (backend)]
    Functions -->|NoSQL Queries| CosmosDB[(Azure Cosmos DB)]
```

## 2. Technology Stack
### Frontend (`frontend`)
- **Framework:** React v18
- **Language:** TypeScript
- **Bundler:** Create React App (Webpack)
- **UI Library:** Fluent UI React v9 (`@fluentui/react-components`)
- **Drag and Drop:** `dnd-kit` (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`)
- **Routing:** React Router v6

### Backend (`backend`)
- **Framework:** Azure Functions App (Node.js)
- **Language:** TypeScript
- **Validation:** Zod
- **Database:** Azure Cosmos DB (SQL API)
- **Local Dev Database:** Azure Cosmos DB Emulator

## 3. Data Schema
### Form Settings Document (Cosmos DB)
```json
{
  "id": "tenant-form-settings",
  "organizationId": "default-org",
  "fields": [
    {
      "id": "field_1",
      "type": "text",
      "label": "Custom Text Field"
    }
  ]
}
```

### Task Document (Cosmos DB)
```json
{
  "id": "task_123",
  "title": "Implement API",
  "status": "In Progress",
  "organizationId": "default-org",
  "field_1": "Custom Value stored dynamically"
}
```

## 4. API Endpoints
- `GET /api/tasks` - List tasks
- `GET /api/tasks/{id}` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/form-settings` - Retrieve custom form layout
- `PUT /api/form-settings` - Save custom form layout
