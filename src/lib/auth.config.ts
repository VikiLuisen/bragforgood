import type { NextAuthConfig } from "next-auth";
import { ADMIN_EMAIL } from "@/lib/constants";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = ["/feed", "/deeds", "/profile", "/leaderboard", "/admin"];
      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/sign-in", nextUrl));
      }

      return true;
    },
    async jwt({ token, user, trigger, session: updateData }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
        token.isAdmin = user.email === ADMIN_EMAIL;
      }
      // When session.update({ name, image }) is called from client
      if (trigger === "update" && updateData) {
        if (updateData.name) token.name = updateData.name;
        if (updateData.image !== undefined) token.image = updateData.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.image = (token.image as string | null) ?? undefined;
        (session.user as unknown as Record<string, unknown>).isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  providers: [],
};
