import { DEED_CATEGORIES, type DeedCategory } from "@/lib/constants";

interface CategoryBadgeProps {
  category: DeedCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = DEED_CATEGORIES[category];
  if (!config) return null;

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config.color}`}>
      {config.label}
    </span>
  );
}
