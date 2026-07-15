import "server-only";

import { OrderStatus, type Prisma } from "@prisma/client";

import {
  getCartCoursesForUser,
  getCartTotal,
  toStripeAmount,
} from "@/features/cart/services/cart.service";
import { prisma } from "@/lib/db/prisma";

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    user: true;
    items: { include: { course: true } };
  };
}>;

async function sendOrderConfirmationEmails(order: OrderWithDetails) {
  const { sendOrderConfirmationEmails: sendEmails } = await import(
    "./order-email.service"
  );

  await sendEmails(order);
}

async function finalizeOrder(
  order: OrderWithDetails,
  paymentId: string,
  paymentMethod: string,
) {
  if (order.status === OrderStatus.COMPLETED) {
    return order;
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.COMPLETED,
        paymentId,
        paymentMethod,
      },
    });

    await tx.enrollment.createMany({
      data: order.items.map((item) => ({
        userId: order.userId,
        courseId: item.courseId,
      })),
      skipDuplicates: true,
    });

    for (const item of order.items) {
      await tx.cartItem.deleteMany({
        where: {
          userId: order.userId,
          courseId: item.courseId,
        },
      });
    }

    return updatedOrder;
  });

  await sendOrderConfirmationEmails(order);

  return updatedOrder;
}

export async function createOrderFromCart(userId: string) {
  const cartCourses = await getCartCoursesForUser(userId);

  if (cartCourses.length === 0) {
    return null;
  }

  const amount = getCartTotal(cartCourses);

  return prisma.order.create({
    data: {
      userId,
      amount,
      status: OrderStatus.PENDING,
      paymentMethod: "STRIPE",
      items: {
        create: cartCourses.map((course) => ({
          courseId: course.id,
        })),
      },
    },
    include: {
      items: {
        include: { course: true },
      },
    },
  });
}

export async function completeOrder(
  orderId: string,
  paymentId: string,
  paymentMethod = "STRIPE",
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: { include: { course: true } },
    },
  });

  if (!order) {
    return null;
  }

  return finalizeOrder(order, paymentId, paymentMethod);
}

export async function completeOrderByPaymentId(
  paymentId: string,
  paymentMethod = "STRIPE",
) {
  const order = await prisma.order.findUnique({
    where: { paymentId },
    include: {
      user: true,
      items: { include: { course: true } },
    },
  });

  if (!order) {
    return null;
  }

  return finalizeOrder(order, paymentId, paymentMethod);
}

export async function failOrder(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.FAILED },
  });
}

export { toStripeAmount };
