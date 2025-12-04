import { z } from "zod";

const idAsStringSchema = z.union([z.string(), z.number()]).transform((value) => String(value));

export const incidentSummarySchema = z.object({
  id: idAsStringSchema,
  title: z.string(),
  status: z.string(),
  responsibleUserId: idAsStringSchema.nullish(),
});

export const incidentDetailSchema = incidentSummarySchema
  .extend({
    description: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  })
  .passthrough();

export const assignResponsibleSchema = z.object({
  newResponsibleUserId: idAsStringSchema,
});

export const incidentEventSchema = z.object({
  incidentId: idAsStringSchema,
  oldResponsibleUserId: idAsStringSchema.nullish(),
  newResponsibleUserId: idAsStringSchema,
  changedBy: idAsStringSchema.nullish(),
  reason: z.string().optional(),
  timestamp: z.string().optional(),
});

export type IncidentSummaryDTO = z.infer<typeof incidentSummarySchema>;
export type IncidentDetailDTO = z.infer<typeof incidentDetailSchema>;
export type AssignResponsibleDTO = z.infer<typeof assignResponsibleSchema>;
export type IncidentEventDTO = z.infer<typeof incidentEventSchema>;
