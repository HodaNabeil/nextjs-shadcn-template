import { z } from "zod";

export const paymentIntentItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
});

export const paymentIntentSchema = z.object({
  clientSecret: z.string(),
  amount: z.number(),
  email: z.string(),
  items: z.array(paymentIntentItemSchema),
});

export const paymentIntentErrorSchema = z.object({
  error: z.string(),
});

export type PaymentIntent = z.output<typeof paymentIntentSchema>;
