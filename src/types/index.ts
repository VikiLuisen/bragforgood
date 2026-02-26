import type { DeedCategory, DeedType, ReactionType } from "@/lib/constants";

export interface UserProfile {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
  createdAt: string;
  karmaScore: number;
  deedCount: number;
}

export interface ParticipantInfo {
  id: string;
  message: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

export interface DeedWithAuthor {
  id: string;
  title: string;
  description: string;
  category: DeedCategory;
  photoUrls: string[];
  location: string | null;
  isExample: boolean;
  type: DeedType;
  eventDate: string | null;
  eventEndDate: string | null;
  meetingPoint: string | null;
  whatToBring: string | null;
  maxSpots: number | null;
  participantCount: number;
  isJoined: boolean;
  createdAt: string;
  averageRating?: number;
  ratingCount?: number;
  author: {
    id: string;
    name: string;
    image: string | null;
    email?: string;
    karmaScore?: number;
  };
  _count: {
    comments: number;
  };
  reactionCounts: Record<ReactionType, number>;
  userReactions: ReactionType[];
}

export interface RatingWithUser {
  id: string;
  score: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
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
