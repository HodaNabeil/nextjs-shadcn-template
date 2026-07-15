"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addCourseToCartClient, fetchCart } from "@/features/cart/utils/cart.client";

type AddToCartButtonProps = {
  courseId: string;
};

export function AddToCartButton({ courseId }: AddToCartButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCart()
      .then((cart) => {
        setIsAdded(cart.items.some((item) => item.id === courseId));
      })
      .finally(() => setIsLoading(false));
  }, [courseId]);

  const handleClick = async () => {
    const result = await addCourseToCartClient(courseId);

    if (result === "unauthorized") {
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    setIsAdded(true);
  };

  return (
    <Button
      className="w-full"
      onClick={() => void handleClick()}
      disabled={isAdded || isLoading}
    >
      {isAdded ? (
        <>
          <Check />
          Added to Cart
        </>
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
}
