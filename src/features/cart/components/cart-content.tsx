"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Shield, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Course } from "@/features/courses/types/course";
import {
  CART_UPDATED_EVENT,
  fetchCart,
  formatPrice,
  getCartTotal,
  removeCourseFromCartClient,
} from "@/features/cart/utils/cart.client";

export function CartContent() {
  const [items, setItems] = useState<Course[]>([]);
  const [isReady, setIsReady] = useState(false);

  const syncCart = useCallback(async () => {
    try {
      const cart = await fetchCart();
      setItems(cart.items);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    void syncCart();

    const handleUpdate = () => {
      void syncCart();
    };

    window.addEventListener(CART_UPDATED_EVENT, handleUpdate);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleUpdate);
    };
  }, [syncCart]);

  const removeItem = async (courseId: string) => {
    await removeCourseFromCartClient(courseId);
    const cart = await fetchCart();
    setItems(cart.items);
  };

  const total = getCartTotal(items);

  if (!isReady) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading your cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="mx-auto max-w-lg border-dashed">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="size-5 text-muted-foreground" />
          </div>
          <CardTitle>Your cart is empty</CardTitle>
          <CardDescription>
            Browse the catalog and add courses to get started.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center border-t-0 bg-transparent">
          <Button render={<Link href="/courses" />} nativeButton={false}>
            Browse Courses
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
      <section aria-label="Cart items" className="space-y-4">
        {items.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <CardContent className="flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div>
                  <h2 className="text-lg font-medium text-foreground">
                    {course.title}
                  </h2>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-6 sm:flex-col sm:items-end sm:gap-4">
                <p className="font-mono text-xl font-semibold text-foreground">
                  ${formatPrice(course.price)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void removeItem(course.id)}
                  aria-label={`Remove ${course.title} from cart`}
                >
                  <Trash2 />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <aside className="lg:sticky lg:top-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              {items.length} {items.length === 1 ? "course" : "courses"} in your
              cart
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              {items.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="truncate text-muted-foreground">
                    {course.title}
                  </span>
                  <span className="shrink-0 font-mono font-medium text-foreground">
                    ${formatPrice(course.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Total
                </span>
                <span className="font-mono text-2xl font-semibold text-foreground">
                  ${formatPrice(total)}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3 border-t-0 bg-transparent">
            <Button size="lg" className="h-11 w-full text-base">
              <Shield className="size-5" />
              <Link href="/checkout" className="text-white">
                Proceed to Checkout
              </Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Secure checkout powered by industry-standard encryption
            </p>
          </CardFooter>
        </Card>
      </aside>
    </div>
  );
}
