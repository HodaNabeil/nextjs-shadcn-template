import { NextResponse } from "next/server";

import {
  completeOrder,
  completeOrderByPaymentId,
  failOrder,
} from "@/features/payments/services/orders.service";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 },
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Webhook signature verification failed:`, err.message);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 },
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await completeOrder(orderId, paymentIntent.id);
    } else {
      await completeOrderByPaymentId(paymentIntent.id);
    }

    console.log(
      `Payment Intent Succeeded for amount: ${paymentIntent.amount}`,
    );
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await failOrder(orderId);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
