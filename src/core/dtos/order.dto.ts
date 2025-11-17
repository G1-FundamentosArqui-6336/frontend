import { z } from 'zod';

export const orderSchema = z.object({
  id: z.number(),
  clientId: z.number(),
  addressLine: z.string(),
  city: z.string(),
  country: z.string(),
  postalCode: z.string(),
  referenceLatitude: z.number().nullable().optional(),
  referenceLongitude: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  weightKg: z.number(),
  orderStatus: z.string(),
});

export const createOrderSchema = z.object({
  clientId: z.number(),
  addressLine: z.string(),
  city: z.string(),
  country: z.string(),
  postalCode: z.string(),
  referenceLatitude: z.number().nullable().optional(),
  referenceLongitude: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  weightKg: z.number(),
});

export const completeOrderSchema = z.object({
  routeId: z.number(),
  photoUrl: z.string(),
  receiverName: z.string(),
  signatureData: z.string(),
});

export type OrderDTO = z.infer<typeof orderSchema>;
export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type CompleteOrderDTO = z.infer<typeof completeOrderSchema>;
