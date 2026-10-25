import React from "react";
import { Card } from "@fluentui/react-components";
import { FormField } from "../../types";
import { useStyles } from "./styles";

export const FormPreview = ({ fields }: { fields: FormField[] }) => {
  const styles = useStyles();

  const renderPreviewInput = (field: FormField) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className={styles.previewField}>
            <label className={styles.previewLabel}>{field.label}</label>
            <input
              type="text"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className={styles.previewInput}
              readOnly
            />
          </div>
        );
      case "email":
        return (
          <div key={field.id} className={styles.previewField}>
            <label className={styles.previewLabel}>{field.label}</label>
            <input
              type="email"
              placeholder="name@example.com"
              className={styles.previewInput}
              readOnly
            />
          </div>
        );
      case "date":
        return (
          <div key={field.id} className={styles.previewField}>
            <label className={styles.previewLabel}>{field.label}</label>
            <input type="date" className={styles.previewInput} readOnly />
          </div>
        );
      case "datetime":
        return (
          <div key={field.id} className={styles.previewField}>
            <label className={styles.previewLabel}>{field.label}</label>
            <input type="datetime-local" className={styles.previewInput} readOnly />
          </div>
        );
      default:
        return (
          <div key={field.id} className={styles.previewField}>
            <label className={styles.previewLabel}>{field.label}</label>
            <input type="text" className={styles.previewInput} readOnly />
          </div>
        );
    }
  };

  const maxRow = fields.reduce((max, f) => Math.max(max, f.row ?? 0), -1);
  const totalRows = Math.max(1, maxRow + 1);

  const previewCells = [];
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < 2; c++) {
      const fieldInCell = fields.find(
        (f) => (f.row ?? 0) === r && (f.col ?? 0) === c
      );

      if (fieldInCell) {
        const span = fieldInCell.colSpan || 1;
        previewCells.push(
          <div
            key={`preview-${fieldInCell.id}`}
            style={{ gridColumn: `span ${span}` }}
          >
            {renderPreviewInput(fieldInCell)}
          </div>
        );
        c += span - 1;
      } else {
        const overlapped = fields.some(
          (f) =>
            (f.row ?? 0) === r &&
            (f.col ?? 0) < c &&
            (f.col ?? 0) + (f.colSpan || 1) - 1 >= c
        );
        if (!overlapped) {
          previewCells.push(<div key={`empty-${c}-${r}`} />);
        }
      }
    }
  }

  return (
    <Card className={styles.panelCard}>
      <h3 className={styles.panelTitle}>Form Preview</h3>
      <p className={styles.panelSubtitle}>Live preview of your form</p>
      <div className={styles.previewContainer}>
        {fields.length === 0 ? (
          <div className={styles.previewEmpty}>
            <span style={{ fontSize: "32px", marginBottom: "8px" }}>👁️</span>
            <span style={{ fontSize: "14px" }}>Form preview will appear here</span>
          </div>
        ) : (
          <div className={styles.previewGrid}>{previewCells}</div>
        )}
      </div>
    </Card>
  );
};
