import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/features/auth/components/register-form";
import { getSession } from "@/lib/auth";
import { safeCallbackUrl } from "@/lib/http/safe-callback-url";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your LearnHub account.",
};

type RegisterPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const session = await getSession();
  const { callbackUrl } = await searchParams;
  const redirectTo = safeCallbackUrl(callbackUrl);

  if (session?.user) {
    redirect(redirectTo);
  }

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
        <RegisterForm callbackUrl={redirectTo} />
      </div>
    </div>
  );
}
