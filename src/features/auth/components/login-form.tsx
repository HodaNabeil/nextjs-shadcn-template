"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

import { loginAction } from "@/features/auth/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/login";
import { safeCallbackUrl } from "@/lib/http/safe-callback-url";
import {
  formatZodFieldErrors,
  toSingleFieldErrors,
} from "@/lib/http/validation";

type LoginFormProps = {
  callbackUrl?: string;
};

type FieldErrors = Partial<Record<keyof LoginInput, string>>;

export function LoginForm({ callbackUrl = "/" }: LoginFormProps) {
  const router = useRouter();
  const redirectTo = safeCallbackUrl(callbackUrl);
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    const parsed = loginSchema.safeParse({ email });

    if (!parsed.success) {
      setFieldErrors(toSingleFieldErrors(formatZodFieldErrors(parsed.error)));
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await loginAction({ email });

      if (!result.ok) {
        if (result.error.fields) {
          setFieldErrors(toSingleFieldErrors(result.error.fields));
        }

        toast.error(result.error.message);
        return;
      }

      toast.success("Welcome back! You are now signed in.");
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in to LearnHub</CardTitle>
        <CardDescription>
          Enter your email to access your courses and cart.
        </CardDescription>
      </CardHeader>

      <form onSubmit={(event) => void handleSubmit(event)} noValidate>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((current) => ({ ...current, email: undefined }));
                }
              }}
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            {fieldErrors.email ? (
              <p id="email-error" className="text-sm text-destructive">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn />
                Sign In
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register?callbackUrl=${encodeURIComponent(redirectTo)}`}
              className="font-medium text-primary hover:underline"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
