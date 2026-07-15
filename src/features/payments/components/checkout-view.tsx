"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Cairo } from "next/font/google";
import { Lock } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import CheckoutForm from "@/features/payments/components/checkout-form";
import { CheckoutOrderSummary } from "@/features/payments/components/checkout-order-summary";
import { usePaymentIntent } from "@/features/payments/hooks/use-payment-intent";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export function CheckoutView() {
  const { data, isPending, error } = usePaymentIntent();

  return (
    <div
      className={`${cairo.variable} min-h-full bg-background font-[family-name:var(--font-cairo)] text-foreground`}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
        <header className="mb-10">
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            <Lock className="size-7 shrink-0" />
            الدفع الآمن
          </h1>
        </header>

        {error ? (
          <Card>
            <CardContent className="py-6 text-center text-destructive">
              {error.message}
            </CardContent>
          </Card>
        ) : null}

        {data?.clientSecret && stripePromise ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: data.clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#171717",
                    colorBackground: "#ffffff",
                    colorText: "#0a0a0a",
                    colorDanger: "#dc2626",
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <CheckoutForm
                email={data.email}
                amount={data.amount}
                items={data.items}
              />
            </Elements>

            <CheckoutOrderSummary items={data.items} amount={data.amount} />
          </div>
        ) : !error && isPending ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              جاري تجهيز بوابة الدفع الآمنة...
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
