import type { Course } from "@/features/courses/types/course";

export const CART_UPDATED_EVENT = "payment-template-cart-updated";

function notifyCartUpdated(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

type CartResponse = {
  items: Course[];
  total: number;
};

export async function fetchCart(): Promise<CartResponse> {
  const response = await fetch("/api/cart", { cache: "no-store" });

  if (response.status === 401) {
    return { items: [], total: 0 };
  }

  if (!response.ok) {
    throw new Error("Failed to load cart");
  }

  return response.json();
}

export async function addCourseToCartClient(courseId: string): Promise<"added" | "unauthorized"> {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId }),
  });

  if (response.status === 401) {
    return "unauthorized";
  }

  if (!response.ok) {
    throw new Error("Failed to add course to cart");
  }

  notifyCartUpdated();
  return "added";
}

export async function removeCourseFromCartClient(courseId: string): Promise<void> {
  const response = await fetch("/api/cart", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId }),
  });

  if (!response.ok) {
    throw new Error("Failed to remove course from cart");
  }

  notifyCartUpdated();
}

export function getCartTotal(items: Pick<Course, "price">[]): number {
  return items.reduce((sum, course) => sum + course.price, 0);
}

export function formatPrice(amount: number): string {
  return amount.toFixed(2);
}
