import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card } from "@fluentui/react-components";
import { useStyles } from "./styles";

export const PaletteItem = ({ type, label }: { type: string; label: string }) => {
  const styles = useStyles();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, label, isPalette: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${styles.paletteItem} ${isDragging ? styles.paletteItemDragging : ""}`}
    >
      ⠿ {label}
    </div>
  );
};

export const Palette: React.FC = () => {
  const styles = useStyles();
  const PALETTE_ITEMS = [
    { type: "text", label: "Text Field" },
    { type: "date", label: "Date Field" },
    { type: "datetime", label: "Date & Time Field" },
    { type: "email", label: "Email Field" },
  ];

  return (
    <Card className={styles.paletteCard}>
      <h3 className={styles.panelTitle}>Components</h3>
      <p className={styles.panelSubtitle}>Drag to add to form</p>
      {PALETTE_ITEMS.map((item) => (
        <PaletteItem key={item.type} type={item.type} label={item.label} />
      ))}
    </Card>
  );
};
