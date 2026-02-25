import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Use existing example users
  const maya = await prisma.user.findFirst({ where: { email: "maya@example.com" } });
  const sam = await prisma.user.findFirst({ where: { email: "sam@example.com" } });

  if (!maya || !sam) {
    console.error("Example users not found. Run add-examples.ts first.");
    process.exit(1);
  }

  const now = Date.now();
  const hour = 3600000;
  const day = 24 * hour;

  // CTA 1 - Maya - ENVIRONMENT - Beach cleanup this Saturday
  const cta1 = await prisma.deed.create({
    data: {
      title: "Beach cleanup at Mythenquai — let's make it shine!",
      description:
        "The lakeside is full of trash after the warm weekend. I'm organizing a group cleanup this Saturday morning. Last time we were 8 people and filled 12 bags in 2 hours. Let's beat that record! All ages welcome, bring your friends. I'll have extra gloves and bags.",
      category: "ENVIRONMENT",
      type: "CALL_TO_ACTION",
      eventDate: new Date(now + 5 * day),
      eventEndDate: new Date(now + 5 * day + 3 * hour),
      meetingPoint: "Strandbad Mythenquai entrance, Zurich",
      whatToBring: "Reusable gloves, water bottle, sunscreen. I'll bring trash bags and pickers.",
      maxSpots: 25,
      photoUrls: ["https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80"],
      isExample: true,
      authorId: maya.id,
      createdAt: new Date(now - 2 * hour),
    },
  });

  // CTA 2 - Sam - VOLUNTEERING - Weekend food drive
  const cta2 = await prisma.deed.create({
    data: {
      title: "Food bank needs volunteers this Sunday — who's in?",
      description:
        "Tafel Zurich just got a huge donation and needs help sorting and packing. We're talking canned goods, fresh produce, and hygiene products for 300+ families. It's real, hands-on work and it feels amazing. No experience needed — just show up and we'll get it done together.",
      category: "VOLUNTEERING",
      type: "CALL_TO_ACTION",
      eventDate: new Date(now + 6 * day),
      eventEndDate: new Date(now + 6 * day + 6 * hour),
      meetingPoint: "Tafel Zurich, Rautistrasse 33",
      whatToBring: "Comfortable shoes, a good mood. Lunch is provided!",
      maxSpots: 20,
      photoUrls: ["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"],
      isExample: true,
      authorId: sam.id,
      createdAt: new Date(now - 5 * hour),
    },
  });

  // Add some participants from other example users
  const allExampleUsers = await prisma.user.findMany({
    where: { email: { endsWith: "@example.com" } },
    select: { id: true },
  });

  const otherUsers = allExampleUsers.filter((u) => u.id !== maya.id && u.id !== sam.id);

  // Add participants to CTA 1
  for (const user of otherUsers.slice(0, 2)) {
    await prisma.participant.create({
      data: {
        userId: user.id,
        deedId: cta1.id,
        message: user.id === otherUsers[0]?.id ? "I'll bring extra trash bags!" : "Count me in, love the lakeside!",
      },
    });
  }

  // Add participants to CTA 2
  for (const user of otherUsers.slice(0, 3)) {
    await prisma.participant.create({
      data: {
        userId: user.id,
        deedId: cta2.id,
        message: user.id === otherUsers[0]?.id
          ? "Did this last month, it's so rewarding"
          : user.id === otherUsers[1]?.id
            ? "Bringing my roommate along!"
            : null,
      },
    });
  }

  // Add some reactions
  const reactionTypes = ["INSPIRED", "THANK_YOU", "AMAZING", "KEEP_GOING"];
  for (const deed of [cta1, cta2]) {
    const reactors = allExampleUsers
      .filter((u) => u.id !== deed.authorId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    for (const user of reactors) {
      const type = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];
      try {
        await prisma.reaction.create({
          data: { type, userId: user.id, deedId: deed.id },
        });
      } catch {
        // skip duplicates
      }
    }
  }

  console.log("Added 2 Call to Action examples:");
  console.log(`  - ${cta1.title}`);
  console.log(`  - ${cta2.title}`);
  console.log("  - With participants, reactions");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
