# Product Requirements Document (PRD)

## 1. Project Overview
**Name:** TaskFlow - Enterprise Task & Dynamic Form Platform
**Goal:** A modern full-stack Single-Page Application (SPA) for task management featuring a rich data grid with Fluent UI v9 and a drag-and-drop form schema builder powered by dnd-kit and Azure Cosmos DB.

## 2. Requirements

### Module 1: Enterprise Task Management (Core Workflows)
- **Task List Page:**
  - Display tasks in a List or Table view.
  - Features: Filtering, Searching, and Pagination.
  - Inline editing or editing from the list/table.
  - Delete tasks.
  - Change task status (e.g., To Do, In Progress, Done).
- **Task Dialog (Add/Edit):**
  - A modal dialog opened by a button click containing the task form.
  - Must respect dynamic fields configured in Part 2.

### Module 2: Customizable Form Engine (Dynamic Schema Builder)
- **Form Setting Page:**
  - A settings page dedicated to customizing the task form.
  - Must closely mimic the UI of `demo.bpmn.io/form` (left palette, center drop zone).
  - Uses Drag-and-Drop (`dnd-kit`) to place fields.
- **Dynamic Fields Features:**
  - Add new fields to the end of the form.
  - Supported Field Types: Text, Date, Date and Time, Email.
  - Fields can be renamed (label customization).
  - Layout limits: Up to 2 columns of fields per row, unlimited rows.
- **Integration:**
  - The customized form structure must apply universally to all tasks.
  - The Task List and Add/Edit Task Dialog must render the dynamic fields.

## 3. Out of Scope
- User authentication and authorization (assumed anonymous or single-tenant unless specified).
- Complex workflows beyond simple status changes.
