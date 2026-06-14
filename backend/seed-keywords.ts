import { PrismaClient } from '@prisma/client';
import { toxicKeywords } from './src/modules/ai/prompts/toxicity.prompt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding toxic keywords...');
  for (const keyword of toxicKeywords) {
    await prisma.toxicKeyword.upsert({
      where: { keyword },
      update: {},
      create: { keyword },
    });
  }
  console.log(`Seeded ${toxicKeywords.length} keywords.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
