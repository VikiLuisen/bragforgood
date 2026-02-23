import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-16">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[var(--text-tertiary)]">
          <Link href="/impressum" className="hover:text-[var(--accent)] transition-colors">
            Impressum
          </Link>
          <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[var(--accent)] transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-[var(--accent)] transition-colors">
            Contact
          </Link>
        </div>
        <p className="text-center text-[10px] text-[var(--text-tertiary)] mt-4 opacity-60">
          &copy; {new Date().getFullYear()} bragforgood
        </p>
      </div>
    </footer>
  );
}
