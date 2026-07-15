import { CreditCard } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function CheckoutPaymentMethodTab() {
  return (
    <Badge variant="outline" className="h-8 gap-2 px-3 py-1.5 text-sm">
      <CreditCard className="size-4" />
      <span>بطاقة</span>
    </Badge>
  );
}
