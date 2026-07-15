import { NextResponse } from "next/server";

import { toStripeAmount } from "@/features/cart/services/cart.service";
import { createOrderFromCart } from "@/features/payments/services/orders.service";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const order = await createOrderFromCart(session.user.id);

    if (!order) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const courseIds = order.items.map((item) => item.courseId);
    const amount = toStripeAmount(order.amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      receipt_email: user.email,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
        email: user.email,
        courseIds: JSON.stringify(courseIds),
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: paymentIntent.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: order.amount,
      email: user.email,
      items: order.items.map(({ course }) => ({
        id: course.id,
        title: course.title,
        price: course.price,
      })),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 },
    );
  }
}
