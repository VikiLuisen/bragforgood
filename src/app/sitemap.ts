import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.bragforgood.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/sign-in`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/sign-up`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/impressum`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const deeds = await prisma.deed.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const deedPages: MetadataRoute.Sitemap = deeds.map((deed) => ({
    url: `${baseUrl}/deeds/${deed.id}`,
    lastModified: deed.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...deedPages];
}
