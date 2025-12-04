import { client } from '@/services/http/client';
import {
  incidentSummarySchema,
  incidentDetailSchema,
  assignResponsibleSchema,
  incidentEventSchema,
  type IncidentSummaryDTO,
  type IncidentDetailDTO,
  type AssignResponsibleDTO,
  type IncidentEventDTO,
} from '@/core/dtos/incident.dto';
import { userSchema, type UserDTO } from '@/core/dtos/user.dto';

class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function parseJson(res: Response) {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

async function handleResponse<T>(res: Response, schema: { parse: (input: unknown) => T }) {
  const json = await parseJson(res);
  if (!res.ok) {
    const message = (json as { message?: string } | undefined)?.message ?? 'Request failed';
    throw new ApiError(res.status, message, json);
  }
  return schema.parse(json);
}

export async function listIncidents(): Promise<IncidentSummaryDTO[]> {
  const res = await client.get('api/incidents');
  return handleResponse(res, incidentSummarySchema.array());
}

export async function getIncident(id: string): Promise<IncidentDetailDTO> {
  const res = await client.get(`api/incidents/${id}`);
  return handleResponse(res, incidentDetailSchema);
}

export async function assignResponsibleUser(incidentId: string, payload: AssignResponsibleDTO): Promise<IncidentDetailDTO> {
  const body = assignResponsibleSchema.parse(payload);
  const res = await client.patch(`api/incidents/${incidentId}/assign-responsible`, { json: body });
  return handleResponse(res, incidentDetailSchema);
}

export async function searchUsers(query: string): Promise<UserDTO[]> {
  const res = await client.get(`api/users?query=${encodeURIComponent(query)}`);
  const json = await parseJson(res);
  if (!res.ok) {
    const message = (json as { message?: string } | undefined)?.message ?? 'Failed to search users';
    throw new ApiError(res.status, message, json);
  }
  return userSchema.array().parse(json ?? []);
}

export async function publishIncidentEvent(event: IncidentEventDTO) {
  const payload = incidentEventSchema.parse({
    ...event,
    timestamp: event.timestamp ?? new Date().toISOString(),
  });
  try {
    const res = await client.post('api/events', { json: { type: 'IncidentResponsibleUserAssigned', ...payload } });
    if (!res.ok) {
      const json = await parseJson(res);
      // Non-blocking: log to console for observability without breaking UI flow.
      console.warn('Failed to publish incident event', res.status, json);
    }
  } catch (err) {
    console.warn('Failed to publish incident event', err);
  }
}

export { ApiError };
