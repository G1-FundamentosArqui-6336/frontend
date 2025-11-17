import { z } from 'zod';

export const signInRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signInResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  token: z.string(),
  roles: z.array(z.string()),
});

export const signUpRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  roles: z.array(z.string()).optional(),
});

export const signUpResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  roles: z.array(z.string()),
});

export type SignInRequest = z.infer<typeof signInRequestSchema>;
export type SignInResponse = z.infer<typeof signInResponseSchema>;
export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
