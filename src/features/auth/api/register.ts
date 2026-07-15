import { AuthError } from "next-auth";

import { registerSchema } from "@/features/auth/schemas/register";
import { AuthServiceError, registerUser } from "@/features/auth/services/auth";
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
    `register:${getClientIp(request)}`,
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

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  try {
    await registerUser(parsed.data);

    await signIn("credentials", {
      email: parsed.data.email,
      redirect: false,
    });

    return apiSuccess({});
  } catch (error) {
    if (error instanceof AuthServiceError && error.code === "EMAIL_EXISTS") {
      return apiError("EMAIL_EXISTS", error.message, 409, {
        email: [error.message],
      });
    }

    if (error instanceof AuthError) {
      return apiError(
        "SIGN_IN_FAILED",
        "Account created but sign in failed. Please try logging in.",
        500,
      );
    }

    throw error;
  }
}
