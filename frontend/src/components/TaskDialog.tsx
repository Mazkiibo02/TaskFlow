import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  Input,
  Label,
  Dropdown,
  Option
} from "@fluentui/react-components";
import { Task, FormSettings } from "../types";
import { createTask, updateTask } from "../services/api";
import { useAppToast } from "../contexts/ToastContext";

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  taskToEdit?: Task | null;
  onSave: (task: Task) => void;
  formSettings?: FormSettings | null;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({ isOpen, onOpenChange, taskToEdit, onSave, formSettings }) => {
  const { showToast } = useAppToast();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"To Do" | "In Progress" | "Done">("To Do");
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when opened with new/edit task
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setStatus(taskToEdit.status as any);
        setCustomFields(taskToEdit.customFields || {});
      } else {
        setTitle("");
        setStatus("To Do");
        setCustomFields({});
      }
    }
  }, [isOpen, taskToEdit]);

  const handleSave = async () => {
    if (!title.trim()) return;
    
    // Minimal Validation for required dynamic fields could go here

    const taskData: Task = {
      ...(taskToEdit || { organizationId: "default-org" }),
      title,
      status,
      customFields
    } as Task;
    
    try {
      setIsSaving(true);
      if (taskToEdit && taskToEdit.id) {
        await updateTask(taskToEdit.id, taskData);
      } else {
        await createTask(taskData);
      }
      onSave(taskData); // trigger reload
      onOpenChange(false);
      showToast(taskToEdit && taskToEdit.id ? "Task updated successfully" : "Task created successfully", "success");
    } catch (error: any) {
      console.error("Failed to save task", error);
      showToast(error.message || "Failed to save task.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(e, data) => onOpenChange(data.open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{taskToEdit ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogContent style={{ display: "flex", flexDirection: "column", gap: "15px", paddingTop: "10px" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Label required>Task Title</Label>
              <Input 
                value={title} 
                onChange={(e, data) => setTitle(data.value)} 
                placeholder="Enter task title..." 
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Label>Status</Label>
              <Dropdown
                value={status}
                onOptionSelect={(e, data) => setStatus(data.optionValue as any)}
              >
                <Option value="To Do">To Do</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Done">Done</Option>
              </Dropdown>
            </div>

            {/* Part 2: Custom dynamic fields rendered based on formSettings */}
            {(() => {
              if (!formSettings || !formSettings.fields || formSettings.fields.length === 0) return null;
              
              const fields = formSettings.fields;
              const maxRow = fields.reduce((max, f) => Math.max(max, f.row ?? 0), -1);
              const totalRows = Math.max(1, maxRow + 1);

              const gridCells = [];
              for (let r = 0; r < totalRows; r++) {
                for (let c = 0; c < 2; c++) {
                  const field = fields.find(f => (f.row ?? 0) === r && (f.col ?? 0) === c);
                  
                  if (field) {
                    const span = field.colSpan || 1;
                    gridCells.push(
                      <div key={field.id} style={{ display: "flex", flexDirection: "column", gap: "5px", gridColumn: `span ${span}` }}>
                        <Label>{field.label}</Label>
                        {field.type === 'text' || field.type === 'email' ? (
                          <Input 
                            type={field.type}
                            value={customFields[field.id] || ""}
                            onChange={(e, data) => setCustomFields(prev => ({...prev, [field.id]: data.value}))}
                          />
                        ) : field.type === 'date' || field.type === 'datetime' ? (
                          <Input 
                            type={field.type === 'datetime' ? "datetime-local" : "date"}
                            value={customFields[field.id] || ""}
                            onChange={(e, data) => setCustomFields(prev => ({...prev, [field.id]: data.value}))}
                          />
                        ) : null}
                      </div>
                    );
                    c += (span - 1);
                  } else {
                    const overlapped = fields.some(f => 
                      (f.row ?? 0) === r && 
                      (f.col ?? 0) < c && 
                      ((f.col ?? 0) + (f.colSpan || 1) - 1) >= c
                    );
                    if (!overlapped) {
                        gridCells.push(<div key={`empty-${c}-${r}`} />);
                    }
                  }
                }
              }

              return (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px 10px" }}>
                  {gridCells}
                </div>
              );
            })()}

          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary" disabled={isSaving}>Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary" onClick={handleSave} disabled={!title.trim() || isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
