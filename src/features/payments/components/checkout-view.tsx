"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { formatPrice } from "@/features/cart/utils/cart.client";
import CheckoutForm from "@/features/payments/components/checkout-form";
import { usePaymentIntent } from "@/features/payments/hooks/use-payment-intent";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export function CheckoutView() {
  const { data, isPending, error } = usePaymentIntent();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          الدفع الآمن 🔒
        </h1>
        {data ? (
          <p className="text-gray-600">
            إجمالي المبلغ المطلوب سداده: ${formatPrice(data.amount)}
          </p>
        ) : null}
      </div>

      {error ? (
        <div className="max-w-md mx-auto text-center text-red-600">
          {error.message}
        </div>
      ) : null}

      {data?.clientSecret && stripePromise ? (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: data.clientSecret }}
        >
          <CheckoutForm email={data.email} />
        </Elements>
      ) : !error && isPending ? (
        <div className="text-center text-gray-500">
          جاري تجهيز بوابة الدفع الآمنة...
        </div>
      ) : null}
    </div>
  );
}
