"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { LanguageSelector } from "@/components/layout/language-selector";
import { useTranslation } from "@/lib/useTranslation";
import { DEED_CATEGORIES, REACTION_CONFIG } from "@/lib/constants";
import type { ReactionType, DeedCategory } from "@/lib/constants";
import { formatDate, formatEventDate } from "@/lib/utils";

interface PreviewDeed {
  id: string;
  title: string;
  description: string;
  category: DeedCategory;
  type: string;
  authorName: string;
  authorImage: string | null;
  createdAt: string;
  photoUrls: string[];
  location: string | null;
  eventDate: string | null;
  meetingPoint: string | null;
  commentCount: number;
  participantCount: number;
  totalReactions: number;
  reactionCounts: Record<ReactionType, number>;
  isExample: boolean;
}

interface LandingContentProps {
  previewDeeds: PreviewDeed[];
}

const reactionTypes = Object.keys(REACTION_CONFIG) as ReactionType[];

export function LandingContent({ previewDeeds }: LandingContentProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-glow flex flex-col">
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full relative z-10">
        <Logo size="md" href="/" />
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Link
            href="/sign-in"
            className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {t("nav.signIn")}
          </Link>
        </div>
      </nav>

      <main className="flex-1 px-6 relative z-10">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto pt-16 sm:pt-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-dim)] border border-[rgba(52,211,153,0.2)] text-[var(--accent)] text-xs font-semibold mb-10 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            {t("landing.newKind")}
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.05]">
            {t("landing.bragging").split("bragging?")[0]}
            <br />
            <span className="text-gradient">{t("landing.bragging").includes("bragging?") ? "bragging?" : t("landing.bragging").split("\n").pop()}</span>
          </h1>

          <p className="text-2xl sm:text-3xl font-bold text-[var(--text-secondary)] mt-4">
            {t("landing.forGood")}
          </p>

          <p className="text-base text-[var(--text-tertiary)] mt-6 max-w-md mx-auto leading-relaxed">
            {t("landing.hero")}
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-12">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--accent)] text-[#0a0a0b] font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-[rgba(52,211,153,0.25)] hover:shadow-xl hover:shadow-[rgba(52,211,153,0.35)]"
            >
              {t("landing.startBragging")}
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center px-8 py-3.5 rounded-full border border-[var(--border-light)] text-[var(--text-secondary)] font-semibold text-sm hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-all hover:bg-[var(--accent-dim)]"
            >
              {t("landing.alreadyBrag")}
            </Link>
          </div>
        </div>

        {/* Feed Preview */}
        {previewDeeds.length > 0 && (
          <div className="max-w-2xl mx-auto mt-20 mb-12 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                {t("landing.seeWhat")}
              </h2>
              <p className="text-sm text-[var(--text-tertiary)] mt-1">
                {t("landing.realPosts")}
              </p>
            </div>

            <div className="space-y-3">
              {previewDeeds.map((deed) => {
                const isCTA = deed.type === "CALL_TO_ACTION";
                const catConfig = DEED_CATEGORIES[deed.category];

                return (
                  <Link
                    key={deed.id}
                    href="/sign-up"
                    className={`block card p-5 hover:border-[var(--accent)] transition-all group ${isCTA ? "border-l-4 border-l-sky-500" : ""}`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {deed.authorName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                            {deed.authorName}
                          </span>
                          <span className="text-[11px] text-[var(--text-tertiary)]">{formatDate(deed.createdAt)}</span>
                          {deed.isExample && (
                            <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] border border-[rgba(52,211,153,0.15)]">
                              {t("deed.example")}
                            </span>
                          )}
                          {isCTA && (
                            <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/20">
                              {t("deed.callToAction")}
                            </span>
                          )}
                        </div>

                        <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mt-1.5 leading-snug group-hover:text-[var(--accent)] transition-colors">
                          {deed.title}
                        </h3>
                        <p className="text-[13px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                          {deed.description}
                        </p>

                        {isCTA && deed.eventDate && (
                          <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)]">
                            <svg className="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatEventDate(deed.eventDate)}</span>
                            {deed.meetingPoint && (
                              <>
                                <svg className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{deed.meetingPoint}</span>
                              </>
                            )}
                          </div>
                        )}

                        {deed.photoUrls.length > 0 && (
                          <div className={`mt-3 gap-1.5 ${deed.photoUrls.length === 1 ? "" : "grid grid-cols-2"}`}>
                            {deed.photoUrls.slice(0, 2).map((url, i) => (
                              <div key={i} className="rounded-xl overflow-hidden relative">
                                <img
                                  src={url}
                                  alt={`${deed.title} photo ${i + 1}`}
                                  className={`w-full object-cover ${deed.photoUrls.length === 1 ? "max-h-48" : "h-28"}`}
                                />
                                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-3">
                          {catConfig && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${catConfig.color}`}>
                              {catConfig.label}
                            </span>
                          )}
                          {!isCTA && deed.location && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-tertiary)]">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {deed.location}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--border)]">
                          {deed.totalReactions > 0 && (
                            <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                              {reactionTypes
                                .filter((type) => deed.reactionCounts[type] > 0)
                                .slice(0, 3)
                                .map((type) => REACTION_CONFIG[type].emoji)
                                .join("")}
                              {" "}{deed.totalReactions}
                            </span>
                          )}
                          {isCTA && deed.participantCount > 0 && (
                            <span className="text-[11px] text-sky-400 font-medium">
                              {t("deed.signedUpCount", { count: deed.participantCount })}
                            </span>
                          )}
                          <span className="text-[11px] text-[var(--text-tertiary)]">
                            {deed.commentCount} {deed.commentCount === 1 ? t("deed.comment") : t("deed.comments")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--accent)] text-[#0a0a0b] font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-[rgba(52,211,153,0.25)] hover:shadow-xl hover:shadow-[rgba(52,211,153,0.35)]"
              >
                {t("landing.joinCommunity")}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-xs text-[var(--text-tertiary)] mt-3">
                {t("landing.freeToJoin")}
              </p>
            </div>
          </div>
        )}

        {/* Social proof */}
        <div className="flex items-center justify-center gap-3 pb-12">
          <div className="flex -space-x-2.5">
            {["from-emerald-400 to-teal-500", "from-blue-400 to-indigo-500", "from-purple-400 to-pink-500", "from-amber-400 to-orange-500", "from-rose-400 to-red-500"].map((gradient, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} border-2 border-[var(--bg)] flex items-center justify-center text-white text-[9px] font-bold shadow-lg`}
              >
                {["AM", "MC", "LC", "RP", "SD"][i]}
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--text-tertiary)] font-medium">
            {t("landing.shameless")}
          </p>
        </div>
      </main>
    </div>
  );
}
