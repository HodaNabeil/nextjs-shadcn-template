import "server-only";

import type { Course } from "@/features/courses/types/course";
import { prisma } from "@/lib/db/prisma";

export async function getCartCoursesForUser(userId: string): Promise<Course[]> {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { id: "asc" },
  });

  return items.map((item) => item.course);
}

export async function addCourseToCart(
  userId: string,
  courseId: string,
): Promise<void> {
  await prisma.cartItem.upsert({
    where: {
      userId_courseId: { userId, courseId },
    },
    create: { userId, courseId },
    update: {},
  });
}

export async function removeCourseFromCart(
  userId: string,
  courseId: string,
): Promise<void> {
  await prisma.cartItem.deleteMany({
    where: { userId, courseId },
  });
}

export async function clearCartForUser(userId: string): Promise<void> {
  await prisma.cartItem.deleteMany({
    where: { userId },
  });
}

export function getCartTotal(items: Pick<Course, "price">[]): number {
  return items.reduce((sum, course) => sum + course.price, 0);
}

export function formatPrice(amount: number): string {
  return amount.toFixed(2);
}

export function toStripeAmount(amount: number): number {
  return Math.round(amount * 100);
}
