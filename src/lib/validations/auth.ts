import { z } from "zod";

// Strip HTML tags to prevent XSS
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

export const signUpSchema = z
  .object({
    name: z.string().transform(stripHtml).pipe(z.string().min(2, "Name must be at least 2 characters").max(50)),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: z.string().transform(stripHtml).pipe(z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters")),
  bio: z.string().transform(stripHtml).pipe(z.string().max(200, "Bio must be at most 200 characters")).optional().or(z.literal("")),
  image: z.string().url().nullable().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
