import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { formatPrice } from "@/features/cart/utils/cart.client";
import { getCourses } from "@/features/courses/services/courses.service";

export const metadata: Metadata = {
  title: "Course Catalog",
  description: "Browse modern tech courses and level up your skills.",
};

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Course Catalog
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Modern tech courses to help you build, ship, and scale with
            confidence.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </CardHeader>

              <CardContent className="mt-auto">
                <p className="font-mono text-lg font-semibold text-foreground">
                  ${formatPrice(course.price)}
                </p>
              </CardContent>

              <CardFooter className="mt-auto">
                <AddToCartButton courseId={course.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
