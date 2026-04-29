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
    const embedding = (await embed(
      `${dept.name} - ${dept.description}`,
    )) as number[];
    const vectorString = `[${embedding.join(',')}]`;
    // await prisma.$executeRaw`
    //     INSERT INTO departments (id, name, description, embedding)
    //     VALUES (${dept.id}, ${dept.name}, ${dept.description}, ${vectorString}::vector)
    //     ON CONFLICT (id) DO NOTHING
    //   `;
    // await prisma.departmentEmbeddings.create({
    //   data:{
    //     departmentId: dept.id,
    //     name: dept.name,
    //     description: dept.description,
    //     embedding: vectorString,
    //   }
    // })
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
