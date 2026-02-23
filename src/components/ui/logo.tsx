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
      <CrownIcon className={iconSizes[size]} />
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

function CrownIcon({ className }: { className?: string }) {
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
      {/* Crown body */}
      <path
        d="M5 22L8 10L13 16L16 6L19 16L24 10L27 22H5Z"
        fill="url(#bragGrad)"
        opacity="0.9"
        filter="url(#bragGlow)"
      />
      {/* Crown base band */}
      <rect
        x="5"
        y="22"
        width="22"
        height="4"
        rx="1.5"
        fill="url(#bragGrad)"
        opacity="0.7"
        filter="url(#bragGlow)"
      />
      {/* Crown jewels */}
      <circle cx="10" cy="19" r="1.5" fill="#0f1117" opacity="0.5" />
      <circle cx="16" cy="17" r="1.5" fill="#0f1117" opacity="0.5" />
      <circle cx="22" cy="19" r="1.5" fill="#0f1117" opacity="0.5" />
    </svg>
  );
}
