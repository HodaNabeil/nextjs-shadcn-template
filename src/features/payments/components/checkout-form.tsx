"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { AlertCircle, Check, Lock } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/features/cart/utils/cart.client";
import { CheckoutOrderItems } from "@/features/payments/components/checkout-order-items";
import { CheckoutPaymentMethodTab } from "@/features/payments/components/checkout-payment-method-tab";
import type { PaymentIntent } from "@/features/payments/types/payment-intent";

type CheckoutFormProps = {
  email: string;
  amount: number;
  items: PaymentIntent["items"];
};

export default function CheckoutForm({
  email,
  amount,
  items,
}: CheckoutFormProps) {
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
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle className="text-lg font-semibold">معلومات الدفع</CardTitle>
        <CheckoutPaymentMethodTab />
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CheckoutOrderItems items={items} />

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="checkout-email">البريد الإلكتروني</Label>
            <Input
              id="checkout-email"
              type="email"
              name="email"
              autoComplete="email"
              readOnly
              value={email}
              dir="ltr"
              className="cursor-not-allowed bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label>بيانات البطاقة</Label>
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

          <Button
            type="submit"
            disabled={!stripe || loading}
            size="lg"
            className="h-11 w-full text-base"
          >
            <Lock className="size-4" />
            {loading ? "جاري معالجة الدفع..." : `ادفع $${formatPrice(amount)}`}
          </Button>

          {errorMessage ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Check className="size-3.5 text-green-600" />
            <span>بياناتك مشفرة</span>
          </div>

          <CardDescription className="text-center">
            Powered by{" "}
            <span className="font-semibold text-foreground">Stripe</span>
          </CardDescription>
        </form>
      </CardContent>
    </Card>
  );
}
