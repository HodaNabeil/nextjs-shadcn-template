import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/features/cart/utils/cart.client";
import type { PaymentIntent } from "@/features/payments/types/payment-intent";

type CheckoutOrderItemsProps = {
  items: PaymentIntent["items"];
};

export function CheckoutOrderItems({ items }: CheckoutOrderItemsProps) {
  const courseLabel =
    items.length === 1 ? "1 من الدورات" : `${items.length} من الدورات`;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-foreground">
        تفاصيل الطلب ({courseLabel})
      </h2>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id}>
            {index > 0 ? <Separator className="mb-4" /> : null}

            <div className="flex items-start gap-4">
              <div
                aria-hidden
                className="size-16 shrink-0 rounded-md bg-gradient-to-br from-indigo-100 to-violet-200"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-foreground">
                  {item.title}
                </p>
              </div>

              <div className="shrink-0 text-left" dir="ltr">
                <p className="font-mono text-sm font-semibold text-foreground">
                  ${formatPrice(item.price)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
