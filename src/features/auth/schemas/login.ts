import { z } from "zod";

import { emailField } from "@/features/auth/schemas/fields";

export const loginSchema = z.object({
  email: emailField,
});

export type LoginInput = z.input<typeof loginSchema>;
export type LoginData = z.output<typeof loginSchema>;
