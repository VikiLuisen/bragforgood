import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null;

        // Rate limit login attempts by email
        const email = (credentials.email as string).toLowerCase();
        if (!rateLimit(`signin:${email}`, 10, 900000)) {
          logger.warn("auth.login_failed", { email, reason: "rate_limited" });
          throw new Error("Too many login attempts. Try again in 15 minutes.");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Dummy bcrypt compare to prevent timing-based account enumeration
          await bcrypt.compare(credentials.password as string, "$2a$12$000000000000000000000000000000000000000000000000000000");
          logger.warn("auth.login_failed", { email, reason: "invalid_credentials" });
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!passwordMatch) {
          logger.warn("auth.login_failed", { email, reason: "invalid_credentials" });
          return null;
        }

        logger.info("auth.login_success", { userId: user.id });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});
