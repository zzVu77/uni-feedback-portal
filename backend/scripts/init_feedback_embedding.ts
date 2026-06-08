/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fs from 'fs/promises';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const embeddings = JSON.parse(
    await fs.readFile('./seed/feedback_embeddings.json', 'utf8'),
  );

  console.log(`Found ${embeddings.length} embeddings`);

  for (const item of embeddings) {
    const vectorString = `[${item.embedding.join(',')}]`;

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "FeedbackEmbeddings"
      ("id","feedbackId", "embedding")
      VALUES (gen_random_uuid(),$1::uuid, $2::vector)
      ON CONFLICT ("feedbackId")
      DO UPDATE SET
        "embedding" = EXCLUDED."embedding"
      `,
      item.feedbackId,
      vectorString,
    );
  }

  console.log(`Seeded ${embeddings.length} embeddings`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
