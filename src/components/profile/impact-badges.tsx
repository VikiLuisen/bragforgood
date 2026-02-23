import { DEED_CATEGORIES, IMPACT_BADGES } from "@/lib/constants";

interface ImpactBadgesProps {
  categoryCounts: Record<string, number>;
}

export function ImpactBadges({ categoryCounts }: ImpactBadgesProps) {
  const badges = Object.entries(categoryCounts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {badges.map(([category, count]) => {
        const config = DEED_CATEGORIES[category as keyof typeof DEED_CATEGORIES];
        const badge = IMPACT_BADGES[category];
        if (!config || !badge) return null;

        const label = count === 1 ? badge.singular : badge.plural;

        return (
          <span
            key={category}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${config.color}`}
          >
            {count} {label}
          </span>
        );
      })}
    </div>
  );
}
