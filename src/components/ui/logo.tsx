import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Logo({ href = "/feed", size = "md", className }: LogoProps) {
  const sizes = {
    sm: "text-base gap-1.5",
    md: "text-lg gap-2",
    lg: "text-2xl gap-2.5",
    xl: "text-4xl gap-3",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
    xl: "w-10 h-10",
  };

  const content = (
    <span className={cn("inline-flex items-center font-bold tracking-tight", sizes[size], className)}>
      <BragIcon className={iconSizes[size]} />
      <span>
        brag<span className="text-gradient">forgood</span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

function BragIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bragGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <filter id="bragGlow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Raised fist */}
      <path
        d="M14 24V18M18 24V18M11 18V12C11 11 11.5 10 13 10C14.5 10 15 11 15 12V8C15 7 15.5 6 17 6C18.5 6 19 7 19 8V12C19 11 19.5 10 21 10C22.5 10 23 11 23 12V18C23 22 20 24 17 24H15C12 24 11 22 11 18Z"
        fill="url(#bragGrad)"
        opacity="0.9"
        filter="url(#bragGlow)"
      />
      {/* Sparkle top-left */}
      <path
        d="M8 8L9 6L10 8L9 10Z"
        fill="url(#bragGrad)"
        opacity="0.6"
        filter="url(#bragGlow)"
      />
      {/* Sparkle top-right */}
      <path
        d="M24 6L25 4L26 6L25 8Z"
        fill="url(#bragGrad)"
        opacity="0.5"
        filter="url(#bragGlow)"
      />
      {/* Sparkle left */}
      <path
        d="M6 14L7 12L8 14L7 16Z"
        fill="url(#bragGrad)"
        opacity="0.4"
        filter="url(#bragGlow)"
      />
    </svg>
  );
}
