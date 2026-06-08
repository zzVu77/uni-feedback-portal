import fs from 'fs/promises';
import { PrismaClient } from '@prisma/client';
import { CohereClient } from 'cohere-ai';

const prisma = new PrismaClient();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await cohere.embed({
    texts: [stripHtml(text)],
    model: 'embed-multilingual-v3.0',
    inputType: 'search_document',
    embeddingTypes: ['float'],
  });

  return (response.embeddings as { float: number[][] }).float[0];
}

async function main() {
  const feedbacks = await prisma.feedbacks.findMany({
    where: {
      currentStatus: {
        in: ['PENDING', 'IN_PROGRESS'],
      },
    },
    select: {
      id: true,
      subject: true,
      description: true,
    },
  });

  const results = [];

  for (const feedback of feedbacks) {
    const text = `${feedback.subject ?? ''}\n${feedback.description ?? ''}`;

    console.log(`Embedding ${feedback.id}...`);

    const embedding = await generateEmbedding(text);

    results.push({
      feedbackId: feedback.id,
      subject: feedback.subject,
      description: feedback.description,
      embedding,
    });
  }

  await fs.writeFile(
    './seed/feedback_embeddings.json',
    JSON.stringify(results, null, 2),
  );

  console.log(`Generated ${results.length} embeddings`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
