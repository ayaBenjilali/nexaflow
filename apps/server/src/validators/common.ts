import { z } from "zod";
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
export const registerSchema = loginSchema.extend({ name: z.string().min(2) });
export const customerSchema = z.object({ name: z.string().min(2), company: z.string().min(2), email: z.string().email(), phone: z.string().min(7).optional(), segment: z.string().optional(), value: z.number().optional() });
export const leadSchema = z.object({ name: z.string().min(2), company: z.string().min(2), email: z.string().email(), phone: z.string().optional(), source: z.string().optional(), estimatedValue: z.number().optional(), notes: z.string().optional() });
export const dealUpdateSchema = z.object({ stage: z.enum(["NEW","QUALIFIED","PROPOSAL","NEGOTIATION","WON","LOST"]).optional(), probability: z.number().min(0).max(100).optional() });
export const taskUpdateSchema = z.object({ status: z.enum(["TODO","IN_PROGRESS","REVIEW","COMPLETED"]).optional(), priority: z.enum(["LOW","MEDIUM","HIGH","URGENT"]).optional() });
export const parseBody = <T>(schema: z.ZodSchema<T>, body: unknown) => schema.parse(body);
