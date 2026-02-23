import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to bragforgood and start bragging about your good deeds.",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
