import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("password123", 12);

  // Create new example users
  const maya = await prisma.user.create({
    data: {
      name: "Maya Johnson",
      email: "maya@example.com",
      hashedPassword: password,
      bio: "Neighborhood organizer & proud plant mom",
    },
  });

  const luca = await prisma.user.create({
    data: {
      name: "Luca Rossi",
      email: "luca@example.com",
      hashedPassword: password,
      bio: "Cyclist, baker, and community kitchen regular",
    },
  });

  const nina = await prisma.user.create({
    data: {
      name: "Nina Kovacs",
      email: "nina@example.com",
      hashedPassword: password,
      bio: "Vet student who can't say no to a stray",
    },
  });

  const sam = await prisma.user.create({
    data: {
      name: "Sam Okonkwo",
      email: "sam@example.com",
      hashedPassword: password,
      bio: "Youth basketball coach & mentoring advocate",
    },
  });

  const now = Date.now();
  const hour = 3600000;

  // Fetch existing example users for cross-reactions
  const existingUsers = await prisma.user.findMany({
    where: { email: { endsWith: "@example.com" } },
    select: { id: true },
  });

  const newDeeds: { id: string; authorId: string }[] = [];

  // Deed 1 - Maya - VOLUNTEERING
  newDeeds.push(await prisma.deed.create({
    data: {
      title: "Sorted donations at the food bank for 6 hours straight",
      description:
        "Our local food bank got a massive delivery and needed hands. Spent my Saturday sorting canned goods, fresh produce, and hygiene items. We packed 200+ family boxes. My back hurts but my heart is full.",
      category: "VOLUNTEERING",
      location: "Tafel Zurich",
      photoUrls: ["https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80"],
      isExample: true,
      authorId: maya.id,
      createdAt: new Date(now - 3 * hour),
    },
  }));

  // Deed 2 - Luca - RANDOM_KINDNESS
  newDeeds.push(await prisma.deed.create({
    data: {
      title: "Baked 60 cookies and left them in the office kitchen",
      description:
        "Monday mornings are tough so I spent my Sunday evening baking chocolate chip cookies for the entire office. Left them with a note: 'You're doing great. Have a cookie.' Three colleagues said it made their day.",
      category: "RANDOM_KINDNESS",
      location: "Zurich",
      photoUrls: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80"],
      isExample: true,
      authorId: luca.id,
      createdAt: new Date(now - 6 * hour),
    },
  }));

  // Deed 3 - Nina - ANIMAL_WELFARE
  newDeeds.push(await prisma.deed.create({
    data: {
      title: "Rescued an injured pigeon and brought it to the wildlife center",
      description:
        "Found a pigeon with a broken wing near the train station. Most people walked past. Wrapped it gently in my scarf, took the tram to the wildlife rehab center. They said it'll recover in 2 weeks. Little victories.",
      category: "ANIMAL_WELFARE",
      location: "Zurich HB",
      isExample: true,
      authorId: nina.id,
      createdAt: new Date(now - 9 * hour),
    },
  }));

  // Deed 4 - Sam - MENTORING
  newDeeds.push(await prisma.deed.create({
    data: {
      title: "Started a free basketball camp for kids in the neighborhood",
      description:
        "Every Saturday morning, 15 kids from the neighborhood now show up at the court. We practice dribbling, teamwork, and life skills. One kid told me it's the only thing he looks forward to all week. That hit different.",
      category: "MENTORING",
      location: "Sportplatz Hardau, Zurich",
      photoUrls: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80"],
      isExample: true,
      authorId: sam.id,
      createdAt: new Date(now - 14 * hour),
    },
  }));

  // Deed 5 - Maya - HELPING_NEIGHBORS
  newDeeds.push(await prisma.deed.create({
    data: {
      title: "Organized a neighborhood tool-sharing library",
      description:
        "Nobody needs to own a drill they use twice a year. Set up a shared tool cabinet in our building's basement. 12 households chipped in tools and now everyone has access to everything from hammers to sewing machines.",
      category: "HELPING_NEIGHBORS",
      location: "Kreis 4, Zurich",
      isExample: true,
      authorId: maya.id,
      createdAt: new Date(now - 20 * hour),
    },
  }));

  // Deed 6 - Luca - ENVIRONMENT
  newDeeds.push(await prisma.deed.create({
    data: {
      title: "Biked to work every day this month instead of driving",
      description:
        "Committed to zero car commutes for February. Rain, snow, didn't matter. 22 work days, 440km total on the bike. Saved roughly 88kg of CO2. My legs are stronger and my mornings are so much better now.",
      category: "ENVIRONMENT",
      location: "Zurich",
      photoUrls: ["https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=800&q=80"],
      isExample: true,
      authorId: luca.id,
      createdAt: new Date(now - 28 * hour),
    },
  }));

  // Deed 7 - Nina - VOLUNTEERING
  newDeeds.push(await prisma.deed.create({
    data: {
      title: "Read stories to kids at the children's hospital",
      description:
        "Volunteered at the children's ward for the afternoon. Read stories, did funny voices, and made paper airplanes. One girl who hadn't smiled in days started laughing at my terrible dragon impression. I'll be back next week.",
      category: "VOLUNTEERING",
      location: "Kinderspital Zurich",
      isExample: true,
      authorId: nina.id,
      createdAt: new Date(now - 34 * hour),
    },
  }));

  // Deed 8 - Sam - RANDOM_KINDNESS
  newDeeds.push(await prisma.deed.create({
    data: {
      title: "Paid for the next 5 people's coffee at the café",
      description:
        "Had a great week so I told the barista to put the next 5 orders on my tab. Sat in the corner and watched people's confused, happy faces when they found out their coffee was free. Pure joy. Cost me 30 CHF, worth a million.",
      category: "RANDOM_KINDNESS",
      location: "Café Zurich",
      isExample: true,
      authorId: sam.id,
      createdAt: new Date(now - 40 * hour),
    },
  }));

  // Deed 9 - Maya - ENVIRONMENT
  newDeeds.push(await prisma.deed.create({
    data: {
      title: "Organized a clothing swap party, zero waste, full wardrobes",
      description:
        "Invited 20 friends to bring clothes they don't wear anymore. Everyone left with 'new' outfits and we donated the leftovers to a refugee center. Why buy new when you can swap?",
      category: "ENVIRONMENT",
      location: "Zurich",
      photoUrls: ["https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=80", "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80"],
      isExample: true,
      authorId: maya.id,
      createdAt: new Date(now - 50 * hour),
    },
  }));

  // Deed 10 - Luca - HELPING_NEIGHBORS
  newDeeds.push(await prisma.deed.create({
    data: {
      title: "Taught my 78-year-old neighbor how to video call her grandkids",
      description:
        "Mrs. Keller's grandkids live in Canada and she'd never done a video call. Spent an hour setting up WhatsApp on her tablet and showing her how it works. She called them right away and started crying happy tears. I almost lost it too.",
      category: "HELPING_NEIGHBORS",
      location: "Oerlikon, Zurich",
      isExample: true,
      authorId: luca.id,
      createdAt: new Date(now - 60 * hour),
    },
  }));

  // Deed 11 - Sam - MENTORING
  newDeeds.push(await prisma.deed.create({
    data: {
      title: "Helped a teenager write their first job application",
      description:
        "My neighbor's son was stressed about applying for an apprenticeship. Sat down with him for 2 hours, helped with his CV and practiced the interview. He got the callback! Next week we're doing a mock interview round 2.",
      category: "MENTORING",
      location: "Zurich",
      isExample: true,
      authorId: sam.id,
      createdAt: new Date(now - 70 * hour),
    },
  }));

  // Deed 12 - Nina - ANIMAL_WELFARE
  newDeeds.push(await prisma.deed.create({
    data: {
      title: "Built and hung 5 birdhouses in the park",
      description:
        "Spring is coming and birds need nesting spots. Spent the weekend building birdhouses from reclaimed wood and hung them in the local park. Already spotted a great tit checking one out this morning!",
      category: "ANIMAL_WELFARE",
      location: "Irchelpark, Zurich",
      photoUrls: ["https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=800&q=80"],
      isExample: true,
      authorId: nina.id,
      createdAt: new Date(now - 80 * hour),
    },
  }));

  // Add reactions
  const reactionTypes = ["INSPIRED", "THANK_YOU", "AMAZING", "KEEP_GOING"];

  for (const deed of newDeeds) {
    const numReactions = 3 + Math.floor(Math.random() * 4);
    const shuffledUsers = existingUsers
      .filter((u) => u.id !== deed.authorId)
      .sort(() => Math.random() - 0.5)
      .slice(0, numReactions);

    for (const user of shuffledUsers) {
      const type = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];
      try {
        await prisma.reaction.create({
          data: { type, userId: user.id, deedId: deed.id },
        });
      } catch {
        // Skip duplicate reactions
      }
    }
  }

  // Add comments
  const newUsers = [maya, luca, nina, sam];
  const commentTexts = [
    "This is so inspiring! We need more people like you.",
    "Love this! Small actions, big impact.",
    "You just motivated me to do something good today.",
    "This made my day! Keep it up!",
    "The world needs more of this energy.",
    "Incredible dedication. Respect!",
    "This is what community looks like.",
    "Wow, I want to do something like this too!",
    "You're making a real difference. Thank you!",
    "This is the content I signed up for!",
  ];

  for (let i = 0; i < newDeeds.length; i++) {
    // Each deed gets 1-2 comments from random users
    const numComments = 1 + Math.floor(Math.random() * 2);
    const commenters = newUsers
      .filter((u) => u.id !== newDeeds[i].authorId)
      .sort(() => Math.random() - 0.5)
      .slice(0, numComments);

    for (const commenter of commenters) {
      const text = commentTexts[Math.floor(Math.random() * commentTexts.length)];
      await prisma.comment.create({
        data: { body: text, userId: commenter.id, deedId: newDeeds[i].id },
      });
    }
  }

  console.log("Added new examples:");
  console.log(`  - ${newUsers.length} new users`);
  console.log(`  - ${newDeeds.length} new deeds`);
  console.log(`  - Multiple reactions and comments`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
