import { cn } from "@/lib/utils";
import { getKarmaTier } from "@/lib/constants";

interface AvatarProps {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  karmaScore?: number;
  className?: string;
}

const gradients = [
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-red-500",
  "from-cyan-400 to-blue-500",
];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function Avatar({ name, image, size = "md", karmaScore, className }: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-16 w-16 text-lg",
  };

  const tier = karmaScore != null ? getKarmaTier(karmaScore) : null;
  const ringClass = tier?.ring || "";
  const glowClass = tier?.glow || "";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={cn(
          "rounded-full object-cover ring-2",
          ringClass || "ring-[var(--bg-card)]",
          glowClass,
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br text-white font-bold flex items-center justify-center ring-2 shadow-sm",
        getGradient(name),
        ringClass || "ring-[var(--bg-card)]",
        glowClass,
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
