import { client } from '@/services/http/client';
import { signInRequestSchema, signInResponseSchema, signUpRequestSchema, signUpResponseSchema } from '@/core/dtos/auth.dto';

export async function signIn(email: string, password: string) {
  const body = signInRequestSchema.parse({ email, password });
  const res = await client.post('api/v1/authentication/sign-in', { json: body });
  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch (err) {
    throw new Error(`Invalid JSON response from auth sign-in endpoint (status ${res.status}): ${text}`);
  }

  if (!res.ok) {
    // Provide useful error including parsed body when possible
    const bodyStr = typeof json === 'object' ? JSON.stringify(json) : String(json);
    throw new Error(`Auth sign-in failed (status ${res.status}): ${bodyStr}`);
  }

  try {
    return signInResponseSchema.parse(json);
  } catch (e) {
    // Re-throw with more context to help debugging
    throw new Error(`Auth sign-in: response validation failed: ${(e as Error).message} — raw response: ${text}`);
  }
}

export async function signUp(payload: unknown) {
  const body = signUpRequestSchema.parse(payload);
  const res = await client.post('api/v1/authentication/sign-up', { json: body });
  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch (err) {
    throw new Error(`Invalid JSON response from auth sign-up endpoint (status ${res.status}): ${text}`);
  }

  if (!res.ok) {
    const bodyStr = typeof json === 'object' ? JSON.stringify(json) : String(json);
    throw new Error(`Auth sign-up failed (status ${res.status}): ${bodyStr}`);
  }

  try {
    return signUpResponseSchema.parse(json);
  } catch (e) {
    throw new Error(`Auth sign-up: response validation failed: ${(e as Error).message} — raw response: ${text}`);
  }
}
