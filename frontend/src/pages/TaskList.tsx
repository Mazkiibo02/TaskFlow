import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableCellLayout,
  Title2,
  Button,
  Input,
  Dropdown,
  Option,
  Badge,
  Spinner,
} from "@fluentui/react-components";
import { Task, FormSettings } from "../types";
import { TaskDialog } from "../components/TaskDialog";
import { fetchTasks, deleteTask, fetchFormSettings } from "../services/api";
import { useAppToast } from "../contexts/ToastContext";
import { useDebounce } from "../hooks/useDebounce";

export const TaskList: React.FC = () => {
  const { showToast } = useAppToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formSettings, setFormSettings] = useState<FormSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTerm = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Reset to first page when filtering to prevent empty views on out-of-bounds pages
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, debouncedSearchTerm]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [fetchedTasks, fetchedSettings] = await Promise.all([
        fetchTasks("default-org"),
        fetchFormSettings("default-org")
      ]);
      setTasks(fetchedTasks);
      setFormSettings(fetchedSettings);
    } catch (error) {
      showToast("Failed to load data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const openAddDialog = () => {
    setTaskToEdit(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setTaskToEdit(task);
    setIsDialogOpen(true);
  };

  const removeTask = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
      showToast("Task deleted successfully", "success");
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      showToast(err.message || "Failed to delete task", "error");
    }
  };

  const handleSaveTask = () => loadData();

  const customFormFields = useMemo(() => {
    return formSettings?.fields || [];
  }, [formSettings?.fields]);

  // Cosmos DB local emulation lacks native offset pagination, using client-side slicing
  const { paginatedResults, totalPages, totalCount } = useMemo(() => {
    const filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const startIndex = (currentPage - 1) * pageSize;
    return {
      paginatedResults: filtered.slice(startIndex, startIndex + pageSize),
      totalPages: Math.ceil(filtered.length / pageSize) || 1,
      totalCount: filtered.length
    };
  }, [tasks, debouncedSearchTerm, statusFilter, currentPage, pageSize]);

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title2>Task Management</Title2>
        <Button appearance="primary" onClick={openAddDialog}>Add New Task</Button>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Input 
          placeholder="Search tasks by title" 
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value)}
          aria-label="Search tasks by title"
          style={{ minWidth: "250px" }}
        />
        <Dropdown
          placeholder="Filter by Status"
          value={statusFilter}
          onOptionSelect={(_, data) => setStatusFilter(data.optionValue as string)}
          aria-label="Filter tasks by status"
        >
          <Option value="All">All Statuses</Option>
          <Option value="To Do">To Do</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Done">Done</Option>
        </Dropdown>
      </div>

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
          <Spinner label="Loading tasks..." />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Title</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                {customFormFields.map(field => (
                  <TableHeaderCell key={field.id}>{field.label}</TableHeaderCell>
                ))}
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResults.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <TableCellLayout>{task.title}</TableCellLayout>
                  </TableCell>
                  <TableCell>
                    <TableCellLayout>
                      <Badge
                        color={
                          task.status === "Done" ? "success" : 
                          task.status === "In Progress" ? "warning" : 
                          task.status === "To Do" ? "informative" : "informative"
                        }
                      >
                        {task.status}
                      </Badge>
                    </TableCellLayout>
                  </TableCell>
                  
                  {customFormFields.map(field => {
                     const customVal = task.customFields ? task.customFields[field.id] : "";
                     return (
                       <TableCell key={field.id}>
                         <TableCellLayout>{String(customVal || "-")}</TableCellLayout>
                       </TableCell>
                     );
                  })}

                  <TableCell>
                    <Button appearance="subtle" onClick={() => openEditDialog(task)}>Edit</Button>
                    <Button appearance="subtle" style={{ color: "red" }} onClick={() => removeTask(task.id!)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedResults.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3 + customFormFields.length} style={{ textAlign: "center", padding: "20px" }}>
                    {debouncedSearchTerm 
                      ? `No tasks match "${debouncedSearchTerm}"` 
                      : statusFilter !== "All" 
                      ? `No tasks with status "${statusFilter}"`
                      : "No tasks found. Create one to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalCount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
              <span>Showing {paginatedResults.length} of {totalCount} tasks</span>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  aria-label={`Go to previous page (currently on page ${currentPage})`}
                >
                  Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  aria-label={`Go to next page (currently on page ${currentPage} of ${totalPages})`}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <TaskDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        taskToEdit={taskToEdit} 
        onSave={handleSaveTask} 
        formSettings={formSettings}
      />
    </div>
  );
};

