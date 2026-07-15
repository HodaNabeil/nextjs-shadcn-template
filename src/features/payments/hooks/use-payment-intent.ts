"use client";

import { useQuery } from "@tanstack/react-query";

import { paymentIntentKeys } from "@/features/payments/keys/payment-intent.keys";
import type { PaymentIntent } from "@/features/payments/types/payment-intent";
import { createPaymentIntent } from "@/features/payments/utils/payments.client";

export function usePaymentIntent() {
  return useQuery<PaymentIntent, Error>({
    queryKey: paymentIntentKeys.all,
    queryFn: createPaymentIntent,
    staleTime: Infinity,
    retry: false,
  });
}
