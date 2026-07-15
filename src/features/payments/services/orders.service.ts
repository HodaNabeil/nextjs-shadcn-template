import "server-only";

import { OrderStatus } from "@prisma/client";

import {
  clearCartForUser,
  getCartCoursesForUser,
  getCartTotal,
  toStripeAmount,
} from "@/features/cart/services/cart.service";
import { prisma } from "@/lib/db/prisma";

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

export async function completeOrder(orderId: string, paymentId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return null;
  }

  if (order.status === OrderStatus.COMPLETED) {
    return order;
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.COMPLETED,
        paymentId,
      },
    }),
    prisma.enrollment.createMany({
      data: order.items.map((item) => ({
        userId: order.userId,
        courseId: item.courseId,
      })),
      skipDuplicates: true,
    }),
    prisma.cartItem.deleteMany({
      where: { userId: order.userId },
    }),
  ]);

  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
}

export async function failOrder(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.FAILED },
  });
}

export { toStripeAmount };
