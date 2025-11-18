import { z } from "zod";

export const signInRequestSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signInResponseSchema = z.object({
  id: z.number(),
  email: z.email(),
  token: z.string(),
  roles: z.array(z.string()),
});

export const signUpRequestSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(60, "First name must be at most 60 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(60, "Last name must be at most 60 characters"),
  phone: z
    .string()
    .min(9, "Phone number must be at least 9 characters")
    .max(20, "Phone number must be at most 20 characters"),
  roles: z.array(z.string()).optional(),
});

export const signUpResponseSchema = z.object({
  id: z.number(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  roles: z.array(z.string()),
});

export type SignInRequest = z.infer<typeof signInRequestSchema>;
export type SignInResponse = z.infer<typeof signInResponseSchema>;
export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
