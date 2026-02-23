import type { DeedCategory, ReactionType } from "@/lib/constants";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string | null;
  createdAt: string;
  karmaScore: number;
  deedCount: number;
}

export interface DeedWithAuthor {
  id: string;
  title: string;
  description: string;
  category: DeedCategory;
  photoUrl: string | null;
  location: string | null;
  isExample: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
    karmaScore?: number;
  };
  _count: {
    comments: number;
  };
  reactionCounts: Record<ReactionType, number>;
  userReactions: ReactionType[];
}

export interface CommentWithUser {
  id: string;
  body: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
}
