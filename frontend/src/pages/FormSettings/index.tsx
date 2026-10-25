import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
} from "@dnd-kit/core";
import { Title2, Button, Spinner } from "@fluentui/react-components";
import { FormField } from "../../types";
import { fetchFormSettings, updateFormSettings } from "../../services/api";
import { Palette } from "./Palette";
import { DraggableCanvas } from "./DraggableCanvas";
import { FormPreview } from "./FormPreview";
import { useStyles } from "./styles";
import { useAppToast } from "../../contexts/ToastContext";

export const FormSettings: React.FC = () => {
  const styles = useStyles();
  const { showToast } = useAppToast();
  const [fields, setFields] = useState<FormField[]>([]);
  const [activeData, setActiveData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await fetchFormSettings("default-org");
      if (data?.fields) {
        setFields(data.fields);
        setSettingsId(data.id);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateFormSettings({ id: settingsId, organizationId: "default-org", fields });
      showToast("Settings saved successfully!", "success");
    } catch (error: any) {
      console.error("Failed to save:", error);
      showToast(error.message || "Failed to save settings.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveData(event.active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveData(null);
    if (!over) return;

    const aData = active.data.current;
    const overId = over.id as string;

    if (aData?.isPalette) {
      const newField: FormField = {
        id: `field_${Date.now()}`,
        type: aData.type,
        label: aData.label,
        colSpan: 1,
      };

      if (overId.startsWith("slot-")) {
        const [, c, r] = overId.split("-");
        newField.col = parseInt(c, 10);
        newField.row = parseInt(r, 10);
        setFields((prev) => [...prev, newField]);
      } else {
        const maxRow = fields.reduce((max, f) => Math.max(max, f.row ?? 0), -1);
        newField.col = 0;
        newField.row = maxRow + 1;
        setFields((prev) => [...prev, newField]);
      }
    } else {
      const fromId = aData?.fieldId as string;
      if (!fromId) return;

      if (overId.startsWith("slot-")) {
        const [, c, r] = overId.split("-");
        const newCol = parseInt(c, 10);
        const newRow = parseInt(r, 10);

        setFields((prev) =>
          prev.map((f) => {
            if (f.id === fromId) {
              const maxSpan = 2 - newCol;
              const newSpan = Math.min(f.colSpan || 1, maxSpan);
              return { ...f, col: newCol, row: newRow, colSpan: newSpan };
            }
            return f;
          })
        );
      }
    }
  };

  const handleRename = (id: string, val: string) =>
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, label: val } : f)));

  const handleDelete = (id: string) =>
    setFields((prev) => prev.filter((f) => f.id !== id));

  const handleChangeColSpan = (id: string) =>
    setFields((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const maxSpan = 2 - (f.col || 0);
          let nextSpan = (f.colSpan || 1) + 1;
          if (nextSpan > maxSpan) nextSpan = 1;
          return { ...f, colSpan: nextSpan };
        }
        return f;
      })
    );

  const activePaletteItem = activeData?.isPalette
    ? { label: activeData.label }
    : null;
  const activeCanvasField =
    !activeData?.isPalette && activeData?.fieldId
      ? fields.find((f) => f.id === activeData.fieldId)
      : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title2>Form Builder Settings</Title2>
        <Button appearance="primary" onClick={handleSave} disabled={isSaving || isLoading}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spinner label="Loading form settings..." />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className={styles.mainLayout}>
            <Palette />
            <DraggableCanvas
              fields={fields}
              onRename={handleRename}
              onDelete={handleDelete}
              onChangeColSpan={handleChangeColSpan}
            />
            <FormPreview fields={fields} />
          </div>
          <DragOverlay>
            {activePaletteItem && (
              <div className={styles.overlayPalette}>⠿ {activePaletteItem.label}</div>
            )}
            {activeCanvasField && (
              <div className={styles.overlayCanvas}>⠿ {activeCanvasField.label}</div>
            )}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};
