"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CheckoutFormProps = {
  email: string;
};

export default function CheckoutForm({ email }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !email) return;

    setLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
        receipt_email: email,
        payment_method_data: {
          billing_details: {
            email,
          },
        },
      },
    });

    if (error) {
      setErrorMessage(error.message || "حدث خطأ غير متوقع.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100"
    >
      <div className="mb-4 space-y-2">
        <Label htmlFor="checkout-email">البريد الإلكتروني</Label>
        <Input
          id="checkout-email"
          type="email"
          name="email"
          autoComplete="email"
          readOnly
          value={email}
          dir="ltr"
          className="bg-muted cursor-not-allowed"
        />
      </div>

      <div className="mb-4">
        <PaymentElement
          options={{
            fields: {
              billingDetails: {
                email: "never",
              },
            },
          }}
        />
      </div>

      <button
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2.5 rounded-lg transition disabled:opacity-50"
      >
        {loading ? "جاري معالجة الدفع..." : "ادفع الآن"}
      </button>

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          {errorMessage}
        </div>
      )}
    </form>
  );
}
