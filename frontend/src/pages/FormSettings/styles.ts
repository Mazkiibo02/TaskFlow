import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  container: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  mainLayout: {
    display: "flex",
    flex: 1,
    gap: "20px",
    minHeight: 0,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  
  // Panel Cards
  panelCard: {
    flex: 1,
    ...shorthands.padding("15px"),
    display: "flex",
    flexDirection: "column",
  },
  paletteCard: {
    width: "220px",
    ...shorthands.padding("15px"),
    backgroundColor: tokens.colorNeutralBackground2,
    overflowY: "auto",
  },
  panelTitle: {
    marginTop: 0,
    fontSize: "14px",
    color: tokens.colorNeutralForeground1,
  },
  panelSubtitle: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
    marginBottom: "12px",
  },

  // Palette Item
  paletteItem: {
    ...shorthands.padding("10px", "14px"),
    marginBottom: "10px",
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    cursor: "grab",
    userSelect: "none",
    touchAction: "none",
    fontSize: "14px",
    backgroundColor: tokens.colorNeutralBackground1,
  },
  paletteItemDragging: {
    backgroundColor: tokens.colorBrandBackground2,
    opacity: 0.5,
  },

  // Drop Slot
  dropSlot: {
    height: "100%",
    minHeight: "60px",
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    transitionProperty: "all",
    transitionDuration: "0.15s",
    transitionTimingFunction: "ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.02)",
    ...shorthands.border("1px", "dashed", tokens.colorNeutralStroke1),
  },
  dropSlotOver: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.border("2px", "dashed", tokens.colorBrandBackground),
  },
  dropSlotText: {
    fontSize: "12px",
    color: tokens.colorBrandForeground1,
  },

  // Canvas Item
  canvasItem: {
    ...shorthands.padding("10px"),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    display: "flex",
    gap: "8px",
    alignItems: "center",
    height: "100%",
    userSelect: "none",
    width: "100%",
    boxSizing: "border-box",
    minHeight: "60px",
    boxShadow: tokens.shadow2,
  },
  canvasItemDragging: {
    backgroundColor: tokens.colorNeutralBackground2,
    opacity: 0.4,
    boxShadow: "none",
  },
  dragHandle: {
    cursor: "grab",
    padding: "4px",
    color: tokens.colorNeutralForeground3,
    touchAction: "none",
  },
  itemContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  itemType: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
  },
  itemSpanToggle: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
    cursor: "pointer",
  },

  // Drop Zone
  dropZone: {
    flex: 1,
    minHeight: "300px",
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding("10px"),
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridAutoRows: "min-content",
    gap: "10px",
    alignContent: "start",
    overflowY: "auto",
  },

  // Form Preview
  previewContainer: {
    flex: 1,
    minHeight: "300px",
    ...shorthands.padding("20px"),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    overflowY: "auto",
  },
  previewEmpty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: tokens.colorNeutralForeground3,
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
  },
  previewField: {
    marginBottom: "16px",
  },
  previewLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    marginBottom: "4px",
  },
  previewInput: {
    width: "100%",
    ...shorthands.padding("8px", "10px"),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    fontSize: "13px",
    boxSizing: "border-box",
    backgroundColor: tokens.colorNeutralBackground1,
  },

  // Overlay
  overlayPalette: {
    ...shorthands.padding("10px", "14px"),
    ...shorthands.border("1px", "solid", tokens.colorBrandStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorBrandBackground2,
    fontSize: "14px",
    boxShadow: tokens.shadow16,
    cursor: "grabbing",
  },
  overlayCanvas: {
    ...shorthands.padding("10px"),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    fontSize: "14px",
    boxShadow: tokens.shadow16,
    opacity: 0.9,
  }
});
