import "server-only";

import { prisma } from "@/lib/db/prisma";

import type { Course } from "@/features/courses/types/course";

export async function getCourses(): Promise<Course[]> {
  return prisma.course.findMany({
    orderBy: { title: "asc" },
  });
}

export async function getCourseById(id: string): Promise<Course | null> {
  return prisma.course.findUnique({
    where: { id },
  });
}
