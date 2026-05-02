/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { CohereClient } from 'cohere-ai';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class SearchService {
  private cohere: CohereClient;
  constructor(private readonly prisma: PrismaService) {
    this.cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });
  }

  private cleanText(text: string): string {
    return text.replace(/<[^>]*>/g, '').trim();
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      this.cleanText(text);
      console.log('Text sau khi làm sạch:', text);
      const embed = await this.cohere.embed({
        texts: [text],
        model: 'embed-multilingual-v3.0',
        inputType: 'search_document',
        embeddingTypes: ['float'],
      });

      return (embed.embeddings as { float: number[][] }).float[0];
    } catch (error) {
      console.error('Lỗi gọi Cohere SDK:', error);
      throw error;
    }
  }

  async findSimilarity(feedbackId: string, similarity_threshold: number = 0.7) {
    const originalData: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 
        fe.embedding::text as "embeddingText", 
        f."departmentId",
        f.subject,
        f.description
     FROM "FeedbackEmbeddings" as fe 
     JOIN "Feedbacks" as f ON fe."feedbackId" = f.id 
     WHERE fe."feedbackId" = $1::uuid`,
      feedbackId,
    );

    if (!originalData || originalData.length === 0) {
      throw new Error('Không tìm thấy feedback hoặc embedding.');
    }

    // Dữ liệu trả về từ ::text sẽ có dạng "[0.1,0.2,...]"
    const vectorString = originalData[0].embeddingText;
    const departmentId = originalData[0].departmentId;
    const originalSubject = originalData[0].subject;
    const originalDescription = originalData[0].description;

    if (!vectorString) {
      throw new Error('Dữ liệu embedding bị trống.');
    }

    // 2. Query tìm kiếm tương đồng
    // Lưu ý: $1 đã là chuỗi "[...]" nên chỉ cần ép kiểu ::vector trong SQL
    const similarFeedbacks: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT * FROM (
      SELECT
        fe."feedbackId",
        f.subject,
        f.description,
        1 - (fe.embedding <=> $1::vector) as similarity
      FROM "FeedbackEmbeddings" as fe
      JOIN "Feedbacks" as f ON fe."feedbackId" = f.id
      WHERE 
        f."departmentId" = $2::uuid 
        AND fe."feedbackId" != $3::uuid
    ) AS sub_query
    ORDER BY similarity DESC
    `,
      vectorString, // $1
      departmentId, // $2
      feedbackId, // $3
      similarity_threshold, // $4
    );

    // 3. Rerank kết quả bằng Cohere
    let afterRerank = [];
    if (similarFeedbacks.length > 0) {
      const query = this.cleanText(originalDescription);
      const documents = similarFeedbacks.map((f) =>
        this.cleanText(`${f.subject} ${f.description}`),
      );
      console.log('Query cho Rerank:', query);
      console.log('Documents cho Rerank:', documents);
      try {
        const rerankResponse = await this.cohere.rerank({
          model: 'rerank-multilingual-v3.0',
          query: query,
          documents: documents,
          topN: similarFeedbacks.length,
        });

        afterRerank = rerankResponse.results.map((result: any) => {
          return {
            ...similarFeedbacks[result.index],
            relevanceScore: result.relevanceScore,
          };
        });
      } catch (error) {
        console.error('Lỗi khi gọi Cohere Rerank:', error);
        afterRerank = similarFeedbacks; // Fallback nếu lỗi
      }
    }

    return {
      beforeRerank: similarFeedbacks,
      afterRerank: afterRerank,
    };
  }
}
