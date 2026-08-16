import type { Response } from "express";
export class ApiError extends Error { constructor(public status: number, message: string, public code = "ERROR", public details?: unknown) { super(message); } }
export const ok = <T>(res: Response, data: T, meta?: Record<string, unknown>) => res.json({ success: true, data, meta });
export const created = <T>(res: Response, data: T) => res.status(201).json({ success: true, data });
