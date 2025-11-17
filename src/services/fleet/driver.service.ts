import { client } from '@/services/http/client';
import { driverSchema, createDriverSchema, driverRouteSchema, type DriverDTO, type CreateDriverDTO, type DriverRouteDTO } from '@/core/dtos/driver.dto';

export async function fetchDrivers(): Promise<DriverDTO[]> {
  const res = await client.get('api/v1/drivers');
  const json = await res.json();
  return driverSchema.array().parse(json);
}

export async function createDriver(payload: CreateDriverDTO): Promise<DriverDTO> {
  const body = createDriverSchema.parse(payload);
  const res = await client.post('api/v1/drivers', { json: body });
  const json = await res.json();
  return driverSchema.parse(json);
}

export async function getDriverById(driverId: number): Promise<DriverDTO> {
  const res = await client.get(`api/v1/drivers/${driverId}`);
  const json = await res.json();
  return driverSchema.parse(json);
}

export async function fetchDriverRoutes(driverId: number): Promise<DriverRouteDTO[]> {
  const res = await client.get(`api/v1/drivers/${driverId}/routes`);
  const json = await res.json();
  return driverRouteSchema.array().parse(json);
}
