import { z } from 'zod';

export const vehicleSchema = z.object({
  id: z.number(),
  plateNumber: z.string(),
  capacityKg: z.number(),
  vehicleStatus: z.string(),
});

export const createVehicleSchema = z.object({
  plateNumber: z.string(),
  capacityKg: z.number(),
});

export type VehicleDTO = z.infer<typeof vehicleSchema>;
export type CreateVehicleDTO = z.infer<typeof createVehicleSchema>;
