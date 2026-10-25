# UI/UX & Component Design

## 1. Visual Language
The application uses **Fluent UI React v9**. All components (Buttons, Inputs, Dialogs, Tables) should map to their Fluent UI v9 equivalents to maintain a Microsoft-like enterprise aesthetic.

## 2. Layout Structure
A shell layout consisting of a top navigation bar to switch between the two main pages:
- `/` -> Task Management Page
- `/settings` -> Form Settings Page

## 3. Page Designs

### 3.1 Task Management Page (Part 1)
- **Header:** Title ("Task Management") and a primary "Add Task" button.
- **Table:** 
  - Standard columns: Title, Status, Actions (Edit/Delete).
  - Dynamic columns: Columns for every custom field configured in Form Settings.
  - Controls: Search bar, Status Filter dropdown, Pagination controls.
- **Task Dialog:**
  - A `Dialog` component.
  - Form fields map dynamically to the `FormSettings` array fetched from the backend.
  - Footer with "Save" and "Cancel" buttons.

### 3.2 Form Settings Page (Part 2)
- **Inspiration:** `demo.bpmn.io/form`
- **Layout Grid:** 2-column CSS Grid or Flexbox.
  - **Left Panel (20-30% width):** The "Palette" or "Toolbox".
    - Draggable source items: Text, Date, Date and Time, Email.
  - **Right Panel (70-80% width):** The "Canvas" or "Drop Zone".
    - An area where dropped items become form fields.
    - Fields are arranged in rows (up to 2 columns max per row).
    - Each dropped field has an editable label (Inline text edit or a config popover).
- **Drag and Drop Mechanics (`dnd-kit`):**
  - Use `DndContext` wrapping the entire page.
  - Palette items use `useDraggable`.
  - Canvas uses `useDroppable` and `SortableContext` (to allow reordering).
  - Items in the canvas use `useSortable`.

## 4. State Management
- React Context or standard local state (`useState`, `useEffect`) will be sufficient given the small scope.
- State for `tasks` (Array of objects).
- State for `formSettings` (Object containing array of fields).
