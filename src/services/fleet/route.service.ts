import { client } from '@/services/http/client';
import { routeSchema, createRouteSchema, addOrderSchema, assignVehicleSchema, assignDriverSchema, type RouteDTO, type CreateRouteDTO, type AddOrderDTO, type AssignVehicleDTO, type AssignDriverDTO } from '@/core/dtos/route.dto';

export async function fetchRoutes(): Promise<RouteDTO[]> {
  const res = await client.get('api/v1/routes');
  const json = await res.json();
  return routeSchema.array().parse(json);
}

export async function createRoute(payload: CreateRouteDTO): Promise<RouteDTO> {
  const body = createRouteSchema.parse(payload);
  const res = await client.post('api/v1/routes', { json: body });
  const json = await res.json();
  return routeSchema.parse(json);
}

export async function addOrderToRoute(routeId: number, payload: AddOrderDTO): Promise<RouteDTO> {
  const body = addOrderSchema.parse(payload);
  const res = await client.post(`api/v1/routes/${routeId}/orders`, { json: body });
  const json = await res.json();
  return routeSchema.parse(json);
}

export async function assignVehicle(routeId: number, payload: AssignVehicleDTO): Promise<RouteDTO> {
  const body = assignVehicleSchema.parse(payload);
  const res = await client.patch(`api/v1/routes/${routeId}/vehicle`, { json: body });
  const json = await res.json();
  return routeSchema.parse(json);
}

export async function assignDriver(routeId: number, payload: AssignDriverDTO): Promise<RouteDTO> {
  const body = assignDriverSchema.parse(payload);
  const res = await client.patch(`api/v1/routes/${routeId}/driver`, { json: body });
  const json = await res.json();
  return routeSchema.parse(json);
}

export async function markRouteInProgress(routeId: number): Promise<RouteDTO> {
  const res = await client.patch(`api/v1/routes/${routeId}/in-progress`);
  const json = await res.json();
  return routeSchema.parse(json);
}

export async function getRouteById(routeId: number): Promise<RouteDTO> {
  const res = await client.get(`api/v1/routes/${routeId}`);
  const json = await res.json();
  return routeSchema.parse(json);
}
