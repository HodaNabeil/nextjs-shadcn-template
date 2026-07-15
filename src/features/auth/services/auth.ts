import { prisma } from "@/lib/db/prisma";

export class AuthServiceError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AuthServiceError";
    this.code = code;
  }
}

export async function findUserForLogin(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function registerUser(data: { email: string; name: string }) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AuthServiceError(
      "EMAIL_EXISTS",
      "An account with this email already exists",
    );
  }

  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
    },
  });
}
