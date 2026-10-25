import { z } from "zod";

// Input validation done via Zod schema parsing
// If dangerouslySetInnerHTML is used for rich text rendering in future,
// install isomorphic-dompurify and apply sanitization before storing

export const FieldSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "date", "datetime", "email"]),
  label: z.string().min(1, "Label required").max(100, "Label too long"),
  col: z.number().optional(),
  row: z.number().optional(),
  colSpan: z.number().optional(),
});

export const FormSettingsSchema = z.object({
  id: z.string().optional(), // usually single document for the organization or tenant
  organizationId: z.string().optional(),
  fields: z.array(FieldSchema).default([]),
});

export type Field = z.infer<typeof FieldSchema>;
export type FormSettings = z.infer<typeof FormSettingsSchema>;
