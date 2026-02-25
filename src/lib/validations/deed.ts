import { z } from "zod";
import { DEED_CATEGORIES } from "@/lib/constants";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

const categoryKeys = Object.keys(DEED_CATEGORIES) as [string, ...string[]];

export const createDeedSchema = z.object({
  title: z
    .string()
    .transform(stripHtml)
    .pipe(z.string().min(3, "Title must be at least 3 characters").max(150, "Title must be at most 150 characters")),
  description: z
    .string()
    .transform(stripHtml)
    .pipe(z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be at most 2000 characters")),
  category: z.enum(categoryKeys, {
    message: "Please select a category",
  }),
  photoUrls: z.array(z.string().url("Invalid URL").refine((url) => {
    try { return ["https:", "http:"].includes(new URL(url).protocol); }
    catch { return false; }
  }, "Only HTTP/HTTPS URLs allowed")).max(5, "Maximum 5 photos").optional().default([]),
  location: z.string().max(100).optional().or(z.literal("")),
  type: z.enum(["BRAG", "CALL_TO_ACTION"]).default("BRAG"),
  eventDate: z.string().optional().or(z.literal("")),
  eventEndDate: z.string().optional().or(z.literal("")),
  meetingPoint: z.string().max(200, "Meeting point must be at most 200 characters").optional().or(z.literal("")),
  whatToBring: z.string().max(500, "What to bring must be at most 500 characters").optional().or(z.literal("")),
  maxSpots: z.coerce.number().int().positive("Must be a positive number").max(500, "Maximum 500 spots").optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.type === "CALL_TO_ACTION") {
    if (!data.eventDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Event date is required for a Call to Action",
        path: ["eventDate"],
      });
    } else {
      const eventDate = new Date(data.eventDate);
      if (isNaN(eventDate.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid event date",
          path: ["eventDate"],
        });
      } else if (eventDate <= new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Event date must be in the future",
          path: ["eventDate"],
        });
      }
    }

    if (!data.meetingPoint) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Meeting point is required for a Call to Action",
        path: ["meetingPoint"],
      });
    }

    if (data.eventEndDate) {
      const endDate = new Date(data.eventEndDate);
      const startDate = data.eventDate ? new Date(data.eventDate) : null;
      if (isNaN(endDate.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid end date",
          path: ["eventEndDate"],
        });
      } else if (startDate && endDate <= startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date",
          path: ["eventEndDate"],
        });
      }
    }
  }
});

export type CreateDeedInput = z.infer<typeof createDeedSchema>;
