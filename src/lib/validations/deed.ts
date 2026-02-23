import { z } from "zod";
import { DEED_CATEGORIES } from "@/lib/constants";

const categoryKeys = Object.keys(DEED_CATEGORIES) as [string, ...string[]];

export const createDeedSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters"),
  category: z.enum(categoryKeys, {
    message: "Please select a category",
  }),
  photoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  location: z.string().max(100).optional().or(z.literal("")),
});

export type CreateDeedInput = z.infer<typeof createDeedSchema>;
