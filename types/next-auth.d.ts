import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    ID: string;
    email: string;
    token: string;
    role: string;
  }

  interface Session {
    accessToken: string;
    user: {
      ID: string;
      role: string;
    } & DefaultSession;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string;
    ID: string;
    role: string;
  }
}
