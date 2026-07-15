"use server";

import { headers } from "next/headers";
import { AuthError } from "next-auth";
import type { ZodError } from "zod";

import { loginSchema } from "@/features/auth/schemas/login";
import { registerSchema } from "@/features/auth/schemas/register";
import { AuthServiceError, registerUser } from "@/features/auth/services/auth";
import { signIn } from "@/lib/auth";
import type { ActionResult } from "@/lib/http/response";
import {
  formatZodFieldErrors,
  getFirstZodError,
} from "@/lib/http/validation";
import { checkRateLimit } from "@/lib/rate-limit";

const AUTH_RATE_LIMIT = 10;
const AUTH_RATE_WINDOW_MS = 60_000;

async function getRateLimitKey(action: string): Promise<string> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip")?.trim() ??
    "unknown";

  return `${action}:${ip}`;
}

function validationFailure<T>(error: ZodError): ActionResult<T> {
  return {
    ok: false,
    error: {
      code: "VALIDATION_ERROR",
      message: getFirstZodError(error),
      fields: formatZodFieldErrors(error),
    },
  };
}

export async function loginAction(
  input: unknown,
): Promise<ActionResult<Record<string, never>>> {
  const rateLimit = checkRateLimit(
    await getRateLimitKey("login"),
    AUTH_RATE_LIMIT,
    AUTH_RATE_WINDOW_MS,
  );

  if (!rateLimit.success) {
    return {
      ok: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many attempts. Please try again later.",
      },
    };
  }

  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      redirect: false,
    });

    return { ok: true, data: {} };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message:
            "Invalid email or password. Check your credentials or create an account.",
        },
      };
    }

    throw error;
  }
}

export async function registerAction(
  input: unknown,
): Promise<ActionResult<Record<string, never>>> {
  const rateLimit = checkRateLimit(
    await getRateLimitKey("register"),
    AUTH_RATE_LIMIT,
    AUTH_RATE_WINDOW_MS,
  );

  if (!rateLimit.success) {
    return {
      ok: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many attempts. Please try again later.",
      },
    };
  }

  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    await registerUser(parsed.data);

    await signIn("credentials", {
      email: parsed.data.email,
      redirect: false,
    });

    return { ok: true, data: {} };
  } catch (error) {
    if (error instanceof AuthServiceError && error.code === "EMAIL_EXISTS") {
      return {
        ok: false,
        error: {
          code: "EMAIL_EXISTS",
          message: error.message,
          fields: { email: [error.message] },
        },
      };
    }

    throw error;
  }
}
