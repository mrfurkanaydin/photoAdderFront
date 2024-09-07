import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/login`,
            {
              email: credentials?.email,
              password: credentials?.password
            }
          );

          const data = res.data;
          
          if (data.user && data.token) {
            return { ...data.user, token: data.token };
          } else {
            return null;
          }
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/signin",
    error: "/auth/error"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token;
        token.ID = user.ID;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      if (session?.user) session.user.role = token.role;
      if (session?.user) session.user.ID = token.ID;
      return session;
    }
    // async redirect({ url, baseUrl }) {
    //   if (url.startsWith(baseUrl)) return url;
    //   // if (url.startsWith("/uploads")) return url; // uploads oturum yönlendirmesi
    //   // if (url.startsWith("/customer")) return "/customer"; // customer oturum yönlendirmesi
    //   return baseUrl;
    // }
  },
  session: {
    strategy: "jwt",
    maxAge: 1800,
    updateAge: 0
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 30
  },
  secret: process.env.NEXTAUTH_SECRET
};
