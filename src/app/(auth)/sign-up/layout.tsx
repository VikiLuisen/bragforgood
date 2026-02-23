import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Join bragforgood — the only place where showing off makes the world better.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
