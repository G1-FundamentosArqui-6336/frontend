import { z } from 'zod';

export const routeRefSchema = z.object({ orderId: z.number() });

export const routeSchema = z.object({
  id: z.number(),
  title: z.string(),
  vehicleId: z.number().nullable().optional(),
  driverId: z.number().nullable().optional(),
  ordersIds: routeRefSchema.array(),
  finishedOrderIds: routeRefSchema.array(),
  routeStatus: z.string(),
});

export const createRouteSchema = z.object({ title: z.string() });
export const addOrderSchema = routeRefSchema;
export const assignVehicleSchema = z.object({ vehicleId: z.number() });
export const assignDriverSchema = z.object({ driverId: z.number() });

export type RouteDTO = z.infer<typeof routeSchema>;
export type CreateRouteDTO = z.infer<typeof createRouteSchema>;
export type AddOrderDTO = z.infer<typeof addOrderSchema>;
export type AssignVehicleDTO = z.infer<typeof assignVehicleSchema>;
export type AssignDriverDTO = z.infer<typeof assignDriverSchema>;
