import { z } from "zod";

export function formatZodFieldErrors(
  error: z.ZodError,
): Record<string, string[]> {
  const flattened = error.flatten().fieldErrors;

  return Object.fromEntries(
    Object.entries(flattened).filter(
      (entry): entry is [string, string[]] =>
        Array.isArray(entry[1]) && entry[1].length > 0,
    ),
  );
}

export function toSingleFieldErrors(
  fields: Record<string, string[]>,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, messages] of Object.entries(fields)) {
    if (messages[0]) {
      result[key] = messages[0];
    }
  }

  return result;
}

export function getFirstZodError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Validation failed";
}
