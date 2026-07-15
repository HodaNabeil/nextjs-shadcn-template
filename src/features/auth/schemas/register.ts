import { z } from "zod";

import { emailField, nameField } from "@/features/auth/schemas/fields";

export const registerSchema = z.object({
  email: emailField,
  name: nameField,
});

export type RegisterInput = z.input<typeof registerSchema>;
export type RegisterData = z.output<typeof registerSchema>;
