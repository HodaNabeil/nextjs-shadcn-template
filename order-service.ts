import { OrderStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export async function completeOrder(paymentId: string, paymentMethod: string) {
  const order = await prisma.order.findUnique({
    where: { paymentId },
    include: { items: true, user: true },
  });

  if (!order) {
    throw new Error(`Order with payment ID ${paymentId} not found`);
  }

  if (order.status === OrderStatus.COMPLETED) {
    return order;
  }

  return prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.COMPLETED, paymentMethod },
    });

    for (const item of order.items) {
      await tx.enrollment.create({
        data: {
          userId: order.userId,
          courseId: item.courseId,
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          userId: order.userId,
          courseId: item.courseId,
        },
      });
    }

    return updatedOrder;
  });
}
