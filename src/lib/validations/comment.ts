import { z } from "zod";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

export const createCommentSchema = z.object({
  body: z
    .string()
    .transform(stripHtml)
    .pipe(z.string().min(1, "Comment cannot be empty").max(500, "Comment must be at most 500 characters")),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
