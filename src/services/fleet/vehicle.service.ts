import { client } from '@/services/http/client';
import { vehicleSchema, createVehicleSchema, type VehicleDTO, type CreateVehicleDTO } from '@/core/dtos/vehicle.dto';

export async function fetchVehicles(): Promise<VehicleDTO[]> {
  const res = await client.get('api/v1/vehicles');
  const json = await res.json();
  return vehicleSchema.array().parse(json);
}

export async function getVehicleById(id: number): Promise<VehicleDTO> {
  const res = await client.get(`api/v1/vehicles/${id}`);
  const json = await res.json();
  return vehicleSchema.parse(json);
}

export async function createVehicle(payload: CreateVehicleDTO): Promise<VehicleDTO> {
  const body = createVehicleSchema.parse(payload);
  const res = await client.post('api/v1/vehicles', { json: body });
  const json = await res.json();
  return vehicleSchema.parse(json);
}
