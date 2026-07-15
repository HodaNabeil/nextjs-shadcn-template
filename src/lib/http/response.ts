import { NextResponse } from "next/server";
import type { z } from "zod";

import { formatZodFieldErrors, getFirstZodError } from "@/lib/http/validation";

export type ApiErrorBody = {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
};

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiErrorBody };

export type ApiSuccessResponse<T> = { ok: true; data: T };
export type ApiErrorResponse = { ok: false; error: ApiErrorBody };
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data } satisfies ApiSuccessResponse<T>, init);
}

export function apiError(
  code: string,
  message: string,
  status: number,
  fields?: Record<string, string[]>,
) {
  return NextResponse.json(
    {
      ok: false,
      error: { code, message, ...(fields ? { fields } : {}) },
    } satisfies ApiErrorResponse,
    { status },
  );
}

export function validationErrorResponse(error: z.ZodError) {
  return apiError(
    "VALIDATION_ERROR",
    getFirstZodError(error),
    400,
    formatZodFieldErrors(error),
  );
}

export function invalidJsonResponse() {
  return apiError("INVALID_JSON", "Request body must be valid JSON", 400);
}

export function rateLimitedResponse() {
  return apiError(
    "RATE_LIMITED",
    "Too many attempts. Please try again later.",
    429,
  );
}
