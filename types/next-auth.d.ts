import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    token: string;
    role: string;
  }

  interface Session {
    accessToken: string;
    user: {
      id: string;
      role: string;
    } & DefaultSession;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string;
    role: string;
  }
}
