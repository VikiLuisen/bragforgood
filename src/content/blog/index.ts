import type { BlogPost } from "./types";
import { helpersHigh } from "./helpers-high";
import { lonelinessEpidemic } from "./loneliness-epidemic";
import { neuroscienceOfKindness } from "./neuroscience-of-kindness";

export const blogPosts: BlogPost[] = [
  helpersHigh,
  lonelinessEpidemic,
  neuroscienceOfKindness,
].sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export type { BlogPost, ContentBlock, Citation } from "./types";
