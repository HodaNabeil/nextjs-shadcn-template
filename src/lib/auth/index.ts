import type { Session } from "next-auth";

export type { Session };

export { handlers, auth, signIn, signOut, getSession } from "./config";
export type { AuthUser } from "./types";
