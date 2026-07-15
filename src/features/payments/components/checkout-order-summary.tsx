import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/features/cart/utils/cart.client";
import type { PaymentIntent } from "@/features/payments/types/payment-intent";

type CheckoutOrderSummaryProps = {
  items: PaymentIntent["items"];
  amount: number;
};

const PERKS = ["Lifetime Access", "Certificate"];

export function CheckoutOrderSummary({
  items,
  amount,
}: CheckoutOrderSummaryProps) {
  const discount = 0;
  const subtotal = amount + discount;

  return (
    <aside className="lg:sticky lg:top-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">ملخص الطلب</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <p className="font-medium text-foreground">{item.title}</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {PERKS.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>
          ))}

          <Separator />

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">السعر</span>
              <span className="font-mono text-foreground" dir="ltr">
                ${formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">الخصم</span>
              <span className="font-mono text-foreground" dir="ltr">
                ${formatPrice(discount)}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-foreground">الإجمالي</span>
              <span
                className="font-mono text-lg font-semibold text-foreground"
                dir="ltr"
              >
                ${formatPrice(amount)}
              </span>
            </div>
          </div>

          <CardDescription className="text-xs leading-relaxed">
            بإتمام عملية الشراء، فإنك توافق على شروط الاستخدام وسياسة الخصوصية
            الخاصة بنا.
          </CardDescription>

          <Card className="bg-muted/50 py-(--card-spacing) shadow-none ring-0">
            <CardContent className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                ضمان استرداد الأموال لمدة 30 يومًا
              </p>
              <CardDescription className="text-xs leading-relaxed">
                هل أنت غير راضٍ؟ يمكنك استرداد المبلغ بالكامل خلال 30 يومًا،
                بكل بساطة!
              </CardDescription>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </aside>
  );
}
