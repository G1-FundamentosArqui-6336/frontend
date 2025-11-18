import { z } from "zod";

export const driverSchema = z.object({
  id: z.number(),
  licenceNumber: z.string(),
  driverStatus: z.string(),
});

export const createDriverSchema = z.object({
  licenceNumber: z
    .string()
    .min(1, "Licence number is required")
    .min(9, "Licence number must be at least 9 characters")
    .max(10, "Licence number must be at most 10 characters"),
});

export const routeRefSchema = z.object({
  orderId: z.number(),
});

export const driverRouteSchema = z.object({
  id: z.number(),
  title: z.string(),
  vehicleId: z.number(),
  driverId: z.number(),
  ordersIds: routeRefSchema.array(),
  finishedOrderIds: routeRefSchema.array(),
  routeStatus: z.string(),
});

export type DriverDTO = z.infer<typeof driverSchema>;
export type CreateDriverDTO = z.infer<typeof createDriverSchema>;
export type DriverRouteDTO = z.infer<typeof driverRouteSchema>;
