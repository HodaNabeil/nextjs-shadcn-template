import { z } from "zod";

export function normalizeEmail(email: string): string {
  return email.normalize("NFKC").trim().toLowerCase();
}

const stringOrEmpty = (value: unknown) =>
  typeof value === "string" ? value : "";

export const emailField = z.preprocess(
  stringOrEmpty,
  z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform(normalizeEmail),
);

export const nameField = z.preprocess(
  stringOrEmpty,
  z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
);
