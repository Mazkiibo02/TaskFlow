import { z } from "zod";

// Input validation done via Zod schema parsing
// If dangerouslySetInnerHTML is used for rich text rendering in future,
// install isomorphic-dompurify and apply sanitization before storing

export const TaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title required").max(255, "Title too long"),
  description: z.string().max(5000, "Description too long").optional(),
  status: z.enum(["To Do", "In Progress", "Done"]).default("To Do"),
  organizationId: z.string().optional(), // Used for multi-tenant, if any
  // Allow any other dynamic fields
}).catchall(z.any());

export type Task = z.infer<typeof TaskSchema>;
