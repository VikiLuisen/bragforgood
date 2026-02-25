import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const photoMap: Record<string, string[]> = {
  "Sorted donations at the food bank": ["https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80"],
  "Baked 60 cookies": ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80"],
  "Rescued an injured pigeon": ["https://images.unsplash.com/photo-1555169062-013468b47731?w=800&q=80"],
  "Started a free basketball camp": ["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80"],
  "Biked to work every day": ["https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=800&q=80"],
  "clothing swap party": ["https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=80", "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80"],
  "Built and hung 5 birdhouses": ["https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=800&q=80"],
  "Lakeside cleanup at Mythenquai": ["https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80"],
  "Food bank needs volunteers": ["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"],
  "Paid for the next 5 people": ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80"],
  "Read stories to kids": ["https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80"],
};

async function main() {
  const deeds = await prisma.deed.findMany({
    where: { isExample: true },
    select: { id: true, title: true },
  });

  let updated = 0;
  for (const deed of deeds) {
    for (const [titleFragment, photos] of Object.entries(photoMap)) {
      if (deed.title.includes(titleFragment)) {
        await prisma.deed.update({
          where: { id: deed.id },
          data: { photoUrls: photos },
        });
        updated++;
        console.log(`  Updated: ${deed.title.slice(0, 50)}... (${photos.length} photo(s))`);
        break;
      }
    }
  }

  console.log(`\nDone! Updated ${updated} example deeds with photos.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
