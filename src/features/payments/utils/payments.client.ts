import {
  paymentIntentErrorSchema,
  paymentIntentSchema,
} from "@/features/payments/schemas/payment-intent";
import type { PaymentIntent } from "@/features/payments/types/payment-intent";
import { getFirstZodError } from "@/lib/http/validation";

export async function createPaymentIntent(): Promise<PaymentIntent> {
  const response = await fetch("/api/create-payment-intent", {
    method: "POST",
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error("Failed to create payment intent");
  }

  const data: unknown = await response.json();

  if (!response.ok) {
    const parsedError = paymentIntentErrorSchema.safeParse(data);
    throw new Error(
      parsedError.success
        ? parsedError.data.error
        : "Failed to create payment intent",
    );
  }

  const parsed = paymentIntentSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(getFirstZodError(parsed.error));
  }

  return parsed.data;
}
