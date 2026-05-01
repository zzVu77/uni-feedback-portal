import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';

const prisma = new PrismaClient();

const genAI = new GoogleGenAI({
  apiKey: process.env.API_GEMINI_KEY,
});

async function embed(text: string) {
  const res = await genAI.models.embedContent({
    model: 'gemini-embedding-2-preview',
    contents: text,
  });

  return res.embeddings?.[0]?.values;
}

async function main() {
  console.log('🚀 Seeding departments...');
  const departments = await prisma.departments.findMany();

  for (const dept of departments) {
    const embedding = await embed(`${dept.name} - ${dept.description}`);
    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error(
        `Failed to generate embedding for department ${dept.id} (${dept.name}): embed() returned no values.`,
      );
    }
    const vectorString = `[${embedding.join(',')}]`;
    await prisma.$executeRaw`
    INSERT INTO "DepartmentEmbeddings"
    ("id", "departmentId", "embedding")
    VALUES (
      gen_random_uuid(),
      ${dept.id}::uuid,
      ${vectorString}::vector
    )
  `;

    console.log(`✅ ${dept.name}`);
  }

  console.log('🎉 Done');
}

main().finally(() => prisma.$disconnect());
