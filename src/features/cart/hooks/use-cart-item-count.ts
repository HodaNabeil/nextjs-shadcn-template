"use client";

import { useEffect, useSyncExternalStore } from "react";

import { CART_UPDATED_EVENT, fetchCart } from "@/features/cart/utils/cart.client";

let cartItemCount = 0;
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot() {
  return cartItemCount;
}

function notifySubscribers() {
  for (const listener of listeners) {
    listener();
  }
}

async function loadCartItemCount() {
  try {
    const cart = await fetchCart();
    cartItemCount = cart.items.length;
  } catch {
    cartItemCount = 0;
  }

  notifySubscribers();
}

export function useCartItemCount(): number {
  const count = useSyncExternalStore(subscribe, getSnapshot, () => 0);

  useEffect(() => {
    void loadCartItemCount();

    const handleUpdate = () => {
      void loadCartItemCount();
    };

    window.addEventListener(CART_UPDATED_EVENT, handleUpdate);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  return count;
}
