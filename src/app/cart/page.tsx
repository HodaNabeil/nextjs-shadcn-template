import type { Metadata } from "next";
import Link from "next/link";

import { CartContent } from "@/features/cart/components/cart-content";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your selected courses and proceed to secure checkout.",
};

export default function CartPage() {
  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Review your selected courses, adjust your order, and continue to
              secure checkout when you&apos;re ready.
            </p>
          </div>

          <Button
            variant="outline"
            render={<Link href="/courses" />}
            nativeButton={false}
          >
            Continue Shopping
          </Button>
        </header>

        <CartContent />
      </div>
    </div>
  );
}
