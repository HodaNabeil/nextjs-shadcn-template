import "server-only";

import type { Prisma } from "@prisma/client";

import { getResend } from "@/lib/resend";

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    user: true;
    items: { include: { course: true } };
  };
}>;

export async function sendOrderConfirmationEmails(order: OrderWithDetails) {
  const resend = getResend();

  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping confirmation email");
    return;
  }

  const userName = order.user.name ?? "عزيزي/عزيزتي";

  try {
    await Promise.all(
      order.items.map((item) =>
        resend.emails.send({
          from: "IthraCode Academy <academy@ithracode.tech>",
          to: order.user.email,
          subject: `تهانينا! تم تفعيل كورس: ${item.course.title} 🎉`,
          html: `<p>مرحباً ${userName}، تم استقبال مدفوعاتك بنجاح. يمكنك الآن الدخول للمنصة ومشاهدة الكورس فوراً!</p>`,
        }),
      ),
    );
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
}
