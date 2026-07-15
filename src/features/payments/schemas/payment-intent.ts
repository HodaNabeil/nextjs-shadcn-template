import { z } from "zod";

export const paymentIntentSchema = z.object({
  clientSecret: z.string(),
  amount: z.number(),
  email: z.string(),
});

export const paymentIntentErrorSchema = z.object({
  error: z.string(),
});

export type PaymentIntent = z.output<typeof paymentIntentSchema>;
