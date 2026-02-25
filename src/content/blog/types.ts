export interface Citation {
  authors: string;
  year: number;
  title: string;
  journal: string;
  doi?: string;
  url?: string;
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: 2 | 3 }
  | { type: "citation"; citation: Citation; context: string }
  | { type: "pullQuote"; text: string; attribution?: string }
  | { type: "list"; items: string[]; ordered?: boolean };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  readingTimeMinutes: number;
  tags: string[];
  content: ContentBlock[];
  references: Citation[];
}
