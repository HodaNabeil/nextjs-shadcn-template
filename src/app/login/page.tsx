import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/components/login-form";
import { getSession } from "@/lib/auth";
import { safeCallbackUrl } from "@/lib/http/safe-callback-url";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your LearnHub account.",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  const { callbackUrl } = await searchParams;
  const redirectTo = safeCallbackUrl(callbackUrl);

  if (session?.user) {
    redirect(redirectTo);
  }

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
        <LoginForm callbackUrl={redirectTo} />
      </div>
    </div>
  );
}
