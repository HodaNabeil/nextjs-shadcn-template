"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { registerAction } from "@/features/auth/actions/auth";
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
import {
  registerSchema,
  type RegisterInput,
} from "@/features/auth/schemas/register";
import { safeCallbackUrl } from "@/lib/http/safe-callback-url";
import {
  formatZodFieldErrors,
  toSingleFieldErrors,
} from "@/lib/http/validation";

type RegisterFormProps = {
  callbackUrl?: string;
};

type FieldErrors = Partial<Record<keyof RegisterInput, string>>;

export function RegisterForm({ callbackUrl = "/" }: RegisterFormProps) {
  const router = useRouter();
  const redirectTo = safeCallbackUrl(callbackUrl);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    const parsed = registerSchema.safeParse({ email, name });

    if (!parsed.success) {
      setFieldErrors(toSingleFieldErrors(formatZodFieldErrors(parsed.error)));
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await registerAction({ email, name });

      if (!result.ok) {
        if (result.error.fields) {
          setFieldErrors(toSingleFieldErrors(result.error.fields));
        }

        toast.error(result.error.message);
        return;
      }

      toast.success("Account created. You are now signed in.");
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
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Register to save your cart and enroll in courses.
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (fieldErrors.name) {
                  setFieldErrors((current) => ({ ...current, name: undefined }));
                }
              }}
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
            />
            {fieldErrors.name ? (
              <p id="name-error" className="text-sm text-destructive">
                {fieldErrors.name}
              </p>
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus />
                Create Account
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(redirectTo)}`}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
