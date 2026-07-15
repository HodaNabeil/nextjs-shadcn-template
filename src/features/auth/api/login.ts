import { AuthError } from "next-auth";

import { loginSchema } from "@/features/auth/schemas/login";
import { signIn } from "@/lib/auth";
import {
  apiError,
  apiSuccess,
  invalidJsonResponse,
  rateLimitedResponse,
  validationErrorResponse,
} from "@/lib/http/response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const AUTH_RATE_LIMIT = 10;
const AUTH_RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(
    `login:${getClientIp(request)}`,
    AUTH_RATE_LIMIT,
    AUTH_RATE_WINDOW_MS,
  );

  if (!rateLimit.success) {
    return rateLimitedResponse();
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return invalidJsonResponse();
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      redirect: false,
    });

    return apiSuccess({});
  } catch (error) {
    if (error instanceof AuthError) {
      return apiError(
        "INVALID_CREDENTIALS",
        "Invalid email or password. Check your credentials or create an account.",
        401,
      );
    }

    throw error;
  }
}
