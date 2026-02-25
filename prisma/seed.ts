import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.report.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.deed.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 12);

  // Create users
  const anna = await prisma.user.create({
    data: {
      name: "Anna Meier",
      email: "anna@example.com",
      hashedPassword: password,
      bio: "Urban gardener & sustainability enthusiast from Zurich",
    },
  });

  const marco = await prisma.user.create({
    data: {
      name: "Marco Bianchi",
      email: "marco@example.com",
      hashedPassword: password,
      bio: "Software engineer who loves helping neighbors",
    },
  });

  const lisa = await prisma.user.create({
    data: {
      name: "Lisa Chen",
      email: "lisa@example.com",
      hashedPassword: password,
      bio: "Volunteering is my love language",
    },
  });

  const raj = await prisma.user.create({
    data: {
      name: "Raj Patel",
      email: "raj@example.com",
      hashedPassword: password,
      bio: "Teaching kids to code, one workshop at a time",
    },
  });

  const sophie = await prisma.user.create({
    data: {
      name: "Sophie Dubois",
      email: "sophie@example.com",
      hashedPassword: password,
      bio: "Animal shelter volunteer & cat mom",
    },
  });

  const tom = await prisma.user.create({
    data: {
      name: "Tom Wilson",
      email: "tom@example.com",
      hashedPassword: password,
      bio: "Trail runner & nature cleaner",
    },
  });

  // Create deeds with realistic timestamps (staggered over the past week)
  const now = Date.now();
  const hour = 3600000;

  const deed1 = await prisma.deed.create({
    data: {
      title: "Cleaned up 3 bags of trash from the lake shore",
      description:
        "Spent the morning at Lake Zurich with a few friends. We filled 3 large bags with plastic bottles, cigarette butts, and random packaging. The shoreline looks pristine now. If everyone picked up just one piece of trash a day, imagine the difference.",
      category: "ENVIRONMENT",
      location: "Lake Zurich, Switzerland",
      photoUrls: [ "https://images.unsplash.com/photo-1758599669062-13f35df6b3ab?w=800&q=80"],
      isExample: true,
      authorId: anna.id,
      createdAt: new Date(now - 2 * hour),
    },
  });

  const deed2 = await prisma.deed.create({
    data: {
      title: "Fixed my elderly neighbor's leaking faucet",
      description:
        "Mrs. Mueller mentioned her kitchen faucet had been dripping for weeks and she couldn't afford a plumber. Took me 30 minutes and a new washer. She made me tea and told me stories about the neighborhood from the 1960s. Best trade ever.",
      category: "HELPING_NEIGHBORS",
      location: "Wiedikon, Zurich",
      photoUrls: [ "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"],
      isExample: true,
      authorId: marco.id,
      createdAt: new Date(now - 5 * hour),
    },
  });

  const deed3 = await prisma.deed.create({
    data: {
      title: "Organized a free coding workshop for refugee teens",
      description:
        "Partnered with a local community center to teach 12 teenagers the basics of HTML and CSS. They built their first web pages in 3 hours! One kid said 'I didn't know I could make things on the internet.' That one sentence made my whole month.",
      category: "MENTORING",
      location: "Community Center, Altstetten",
      isExample: true,
      authorId: raj.id,
      createdAt: new Date(now - 8 * hour),
    },
  });

  const deed4 = await prisma.deed.create({
    data: {
      title: "Fostered 2 kittens until they found forever homes",
      description:
        "The animal shelter was overwhelmed so I took in two 8-week-old kittens. Three weeks of bottle feeding, litter training, and endless cuddles later — both found amazing families. Foster parenting pets is the most rewarding thing I do.",
      category: "ANIMAL_WELFARE",
      location: "Zurich Animal Shelter",
      photoUrls: [ "https://images.unsplash.com/photo-1559235038-1b0fadf76f78?w=800&q=80"],
      isExample: true,
      authorId: sophie.id,
      createdAt: new Date(now - 12 * hour),
    },
  });

  const deed5 = await prisma.deed.create({
    data: {
      title: "Left positive sticky notes on every car in the parking garage",
      description:
        "Wrote 47 handwritten notes with little messages like 'You matter', 'Have an amazing day', and 'Someone is proud of you'. Left one on every windshield in the garage. I know it's small but maybe someone needed to read that today.",
      category: "RANDOM_KINDNESS",
      location: "Parking garage, Oerlikon",
      photoUrls: [ "https://images.unsplash.com/photo-1568219557405-376e23e4f7cf?w=800&q=80"],
      isExample: true,
      authorId: lisa.id,
      createdAt: new Date(now - 1 * hour),
    },
  });

  const deed6 = await prisma.deed.create({
    data: {
      title: "Picked up litter during my entire 15km trail run",
      description:
        "Combined my morning run with a cleanup — it's called plogging! Carried a bag the entire route through Uetliberg. Filled it completely. Running is better when it has a purpose beyond fitness.",
      category: "ENVIRONMENT",
      location: "Uetliberg Trail, Zurich",
      photoUrls: [ "https://images.unsplash.com/photo-1702449414685-1ed9316b7253?w=800&q=80"],
      isExample: true,
      authorId: tom.id,
      createdAt: new Date(now - 24 * hour),
    },
  });

  const deed7 = await prisma.deed.create({
    data: {
      title: "Cooked meals for 5 families at the community kitchen",
      description:
        "Every Sunday I volunteer at the community kitchen. Today we prepared lentil soup, fresh bread, and fruit salads for 5 families. Cooking for others fills my heart in a way nothing else does.",
      category: "VOLUNTEERING",
      location: "Gemeinschaftskueche, Zurich",
      photoUrls: [ "https://images.unsplash.com/photo-1762994576926-b8268190a2c9?w=800&q=80"],
      isExample: true,
      authorId: lisa.id,
      createdAt: new Date(now - 30 * hour),
    },
  });

  const deed8 = await prisma.deed.create({
    data: {
      title: "Helped a lost tourist find their hotel at 11pm",
      description:
        "Walking home after dinner, I saw someone looking completely lost near Hauptbahnhof with a dead phone. Walked with them 20 minutes to their hotel. Turns out they were from Japan visiting Switzerland for the first time. We exchanged instagrams!",
      category: "RANDOM_KINDNESS",
      location: "Hauptbahnhof, Zurich",
      isExample: true,
      authorId: marco.id,
      createdAt: new Date(now - 36 * hour),
    },
  });

  const deed9 = await prisma.deed.create({
    data: {
      title: "Planted 20 native wildflower seedlings in the community garden",
      description:
        "Our community garden had an empty plot so I filled it with native Swiss wildflowers — cornflowers, poppies, and chamomile. They'll bloom in spring and support local pollinators. Can't wait to see the bees.",
      category: "ENVIRONMENT",
      location: "Community Garden, Seefeld",
      photoUrls: [ "https://images.unsplash.com/photo-1759422261399-3370e715b70f?w=800&q=80"],
      isExample: true,
      authorId: anna.id,
      createdAt: new Date(now - 48 * hour),
    },
  });

  const deed10 = await prisma.deed.create({
    data: {
      title: "Tutored a high school student in math for free for 3 months",
      description:
        "My neighbor's daughter was struggling with calculus and her family couldn't afford a tutor. We met every Saturday morning for 3 months. She just got her results back — she passed with flying colors! Proudest moment.",
      category: "MENTORING",
      location: "Zurich",
      isExample: true,
      authorId: raj.id,
      createdAt: new Date(now - 56 * hour),
    },
  });

  const deed11 = await prisma.deed.create({
    data: {
      title: "Walked dogs at the animal shelter all weekend",
      description:
        "The shelter dogs need exercise and socialization to be adoptable. Spent both Saturday and Sunday walking 8 different dogs. One of them, a shy German Shepherd mix named Bruno, finally started wagging his tail on our third walk together.",
      category: "ANIMAL_WELFARE",
      location: "Tierheim Zurich",
      photoUrls: [ "https://images.unsplash.com/photo-1683536816488-5cd8f78f7bbe?w=800&q=80"],
      isExample: true,
      authorId: sophie.id,
      createdAt: new Date(now - 72 * hour),
    },
  });

  const deed12 = await prisma.deed.create({
    data: {
      title: "Shoveled snow from 4 neighbors' driveways before they woke up",
      description:
        "Woke up at 5:30am to heavy snowfall. Grabbed my shovel and cleared the walkways for the elderly couples on our street. By the time they opened their doors, the paths were clear. No one knows it was me and I love that.",
      category: "HELPING_NEIGHBORS",
      location: "Witikon, Zurich",
      photoUrls: [ "https://images.unsplash.com/photo-1483385573908-0a2108937c4a?w=800&q=80"],
      isExample: true,
      authorId: tom.id,
      createdAt: new Date(now - 96 * hour),
    },
  });

  // Add reactions
  const allDeeds = [deed1, deed2, deed3, deed4, deed5, deed6, deed7, deed8, deed9, deed10, deed11, deed12];
  const allUsers = [anna, marco, lisa, raj, sophie, tom];
  const reactionTypes = ["INSPIRED", "THANK_YOU", "AMAZING", "KEEP_GOING"];

  for (const deed of allDeeds) {
    // Each deed gets 2-5 random reactions from different users
    const numReactions = 2 + Math.floor(Math.random() * 4);
    const shuffledUsers = allUsers
      .filter((u) => u.id !== deed.authorId)
      .sort(() => Math.random() - 0.5)
      .slice(0, numReactions);

    for (const user of shuffledUsers) {
      const type = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];
      await prisma.reaction.create({
        data: {
          type,
          userId: user.id,
          deedId: deed.id,
        },
      });
    }
  }

  // Add comments
  const comments = [
    { deedId: deed1.id, userId: marco.id, body: "This is amazing! Lake Zurich deserves this kind of care." },
    { deedId: deed1.id, userId: lisa.id, body: "I want to join next time! Can you post when you're going again?" },
    { deedId: deed2.id, userId: anna.id, body: "Those stories must have been incredible. Kindness comes back in unexpected ways." },
    { deedId: deed3.id, userId: sophie.id, body: "This is the kind of mentoring that changes lives. Keep going, Raj!" },
    { deedId: deed3.id, userId: marco.id, body: "Would love to help with the next workshop. I can teach JavaScript!" },
    { deedId: deed3.id, userId: lisa.id, body: "That quote from the kid gave me chills. This is why representation matters." },
    { deedId: deed4.id, userId: anna.id, body: "Foster parents are heroes. Thank you for giving them a safe space." },
    { deedId: deed5.id, userId: raj.id, body: "Small acts of kindness ripple further than we think. Love this." },
    { deedId: deed5.id, userId: tom.id, body: "I found one of these on my car once! Made my entire week." },
    { deedId: deed6.id, userId: anna.id, body: "Plogging is genius. Running + cleaning = double win." },
    { deedId: deed6.id, userId: lisa.id, body: "You carried a full bag for 15km?! That's dedication." },
    { deedId: deed8.id, userId: raj.id, body: "This is what makes Zurich special. We look out for each other." },
    { deedId: deed9.id, userId: tom.id, body: "Can't wait to see them bloom! Pollinators need all the help they can get." },
    { deedId: deed10.id, userId: anna.id, body: "Three months of your time. That's a real investment in someone's future." },
    { deedId: deed11.id, userId: lisa.id, body: "Bruno is going to find his home because of you." },
    { deedId: deed12.id, userId: sophie.id, body: "The fact that you did it anonymously makes it even more beautiful." },
    { deedId: deed12.id, userId: raj.id, body: "Secret acts of kindness are the purest form of good." },
  ];

  for (const comment of comments) {
    await prisma.comment.create({ data: comment });
  }

  console.log("Seed complete! Created:");
  console.log(`  - ${allUsers.length} users`);
  console.log(`  - ${allDeeds.length} deeds`);
  console.log(`  - ${comments.length} comments`);
  console.log(`  - Multiple reactions`);
  console.log("\nYou can sign in with any user's email and password: password123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
