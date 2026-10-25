import React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Button, Card, Input } from "@fluentui/react-components";
import { FormField } from "../../types";
import { useStyles } from "./styles";

const DropSlot = ({ col, row }: { col: number; row: number }) => {
  const styles = useStyles();
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${col}-${row}` });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.dropSlot} ${isOver ? styles.dropSlotOver : ""}`}
    >
      {isOver && <span className={styles.dropSlotText}>Drop here</span>}
    </div>
  );
};

const CanvasItem = ({
  field,
  onRename,
  onDelete,
  onChangeColSpan,
}: {
  field: FormField;
  onRename: (id: string, val: string) => void;
  onDelete: (id: string) => void;
  onChangeColSpan: (id: string) => void;
}) => {
  const styles = useStyles();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `canvas-${field.id}`,
    data: { fieldId: field.id, isPalette: false },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`${styles.canvasItem} ${isDragging ? styles.canvasItemDragging : ""}`}
    >
      <span {...attributes} {...listeners} className={styles.dragHandle}>
        ⠿
      </span>
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <span className={styles.itemType}>{field.type}</span>
          <span
            className={styles.itemSpanToggle}
            onClick={(e) => {
              e.stopPropagation();
              onChangeColSpan(field.id);
            }}
          >
            Span: {field.colSpan || 1} col(s) (Click to change)
          </span>
        </div>
        <Input
          value={field.label}
          onChange={(e, data) => onRename(field.id, data.value)}
          onClick={(e) => e.stopPropagation()}
          size="small"
        />
      </div>
      <Button
        appearance="transparent"
        size="small"
        style={{ color: "#ef4444", minWidth: 0 }}
        onClick={() => onDelete(field.id)}
      >
        ✕
      </Button>
    </div>
  );
};

export const DraggableCanvas = ({
  fields,
  onRename,
  onDelete,
  onChangeColSpan,
}: {
  fields: FormField[];
  onRename: (id: string, val: string) => void;
  onDelete: (id: string) => void;
  onChangeColSpan: (id: string) => void;
}) => {
  const styles = useStyles();
  const maxRow = fields.reduce((max, f) => Math.max(max, f.row ?? 0), -1);
  const totalRows = Math.max(3, maxRow + 2); // Always have at least 3 rows

  const gridCells = [];
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < 2; c++) {
      const fieldInCell = fields.find(f => (f.row ?? 0) === r && (f.col ?? 0) === c);

      if (fieldInCell) {
        const span = fieldInCell.colSpan || 1;
        gridCells.push(
          <div key={`field-${fieldInCell.id}`} style={{ gridColumn: `span ${span}` }}>
            <CanvasItem
              field={fieldInCell}
              onRename={onRename}
              onDelete={onDelete}
              onChangeColSpan={onChangeColSpan}
            />
          </div>
        );
        c += span - 1;
      } else {
        const overlapped = fields.some(
          f =>
            (f.row ?? 0) === r &&
            (f.col ?? 0) < c &&
            (f.col ?? 0) + (f.colSpan || 1) - 1 >= c
        );
        if (!overlapped) {
          gridCells.push(<DropSlot key={`slot-${c}-${r}`} col={c} row={r} />);
        }
      }
    }
  }

  return (
    <Card className={styles.panelCard}>
      <h3 className={styles.panelTitle}>Form Definition</h3>
      <p className={styles.panelSubtitle}>Drag to empty slots. Click span to resize.</p>
      <div className={styles.dropZone}>{gridCells}</div>
    </Card>
  );
};
