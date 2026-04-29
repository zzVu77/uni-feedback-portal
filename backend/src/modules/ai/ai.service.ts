import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { toxicityPrompt, toxicKeywords } from './prompts/toxicity.prompt';
import { PrismaService } from '../prisma/prisma.service';
import { FeedbackStatus } from '@prisma/client';
import { AiDataContext } from '../feedbacks/dto/feedback-job-data.dto';
import { FeedbackDetail } from '../feedbacks/dto';
import { UpdateFeedbackDto } from '../feedbacks/dto/update-feedback.dto';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { departmentProposalPrompt } from './prompts/department-proposal.prompt';
import {
  safeParseJSON,
  DepartmentResponse,
  DepartmentCandidate,
} from './types/department-ai.dto';
@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async checkToxicity(
    description: string,
    data: AiDataContext,
    type: string,
  ): Promise<boolean> {
    if (description) {
      // check keywords for toxicity
      const toxicKeywordsList = toxicKeywords;
      const contentLower = description.toLowerCase();
      for (const keyword of toxicKeywordsList) {
        if (contentLower.includes(keyword)) {
          return true;
        }
      }
      const API_KEY = process.env.API_GEMINI_KEY || '';
      if (!API_KEY) {
        await this.handleFaultGeminiEvent(data, type);
        throw new Error('Google Gemini API key is not configured.');
      }
      const genAI = new GoogleGenAI({ apiKey: API_KEY });
      const prompt = toxicityPrompt(description);
      const model = genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      try {
        const responseText = (await model).text;
        const parsed = JSON.parse(responseText || '{"toxic": false}') as {
          toxic: boolean;
        };
        const isToxicAI = parsed.toxic;
        if (isToxicAI) {
          return true;
        }
      } catch {
        await this.handleFaultGeminiEvent(data, type);
        throw new Error('Error parsing AI response for toxicity check.');
      }
    }
    return false;
  }
  async handleFaultGeminiEvent(data: AiDataContext, type: string) {
    if (type === 'create') {
      const feedback = data as FeedbackDetail;
      await this.prisma.feedbacks.update({
        where: { id: feedback.id },
        data: {
          currentStatus: FeedbackStatus.AI_REVIEW_FAILED,
        },
        include: {
          department: {
            select: { id: true, name: true },
          },
          category: {
            select: { id: true, name: true },
          },
          statusHistory: {
            select: {
              status: true,
              message: true,
              note: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
          },
          forumPost: {
            select: { id: true },
          },
          forwardingLogs: {
            select: {
              id: true,
              message: true,
              createdAt: true,
              note: true,
              fromDepartment: { select: { id: true, name: true } },
              toDepartment: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    } else if (type === 'update') {
      const updateData = data as {
        feedbackId: string;
        updateData: UpdateFeedbackDto;
        actor: ActiveUserData;
      };
      const { feedbackId } = updateData;
      await this.prisma.feedbacks.update({
        where: { id: feedbackId },
        data: {
          currentStatus: FeedbackStatus.AI_REVIEW_FAILED,
        },
        include: {
          department: {
            select: { id: true, name: true },
          },
          category: {
            select: { id: true, name: true },
          },
          statusHistory: {
            select: {
              status: true,
              message: true,
              note: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
          },
          forumPost: {
            select: { id: true },
          },
          forwardingLogs: {
            select: {
              id: true,
              message: true,
              createdAt: true,
              note: true,
              fromDepartment: { select: { id: true, name: true } },
              toDepartment: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }
  }
  async departmentProposal(description: string): Promise<DepartmentResponse> {
    const API_KEY = process.env.API_GEMINI_KEY || '';
    if (!API_KEY) {
      throw new Error('Google Gemini API key is not configured.');
    }
    const genAI = new GoogleGenAI({ apiKey: API_KEY });

    const candidates = await this.searchDepartments(description);
    const prompt = departmentProposalPrompt(description, candidates);
    const model = genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    try {
      const responseText = (await model).text;
      const parsed = safeParseJSON(responseText || '{}');
      return parsed;
    } catch {
      throw new Error('Error parsing AI response for department proposal.');
    }
  }
  async embedDepartmentProposal(text: string) {
    const API_KEY = process.env.API_GEMINI_KEY || '';
    if (!API_KEY) {
      throw new Error('Google Gemini API key is not configured.');
    }
    const genAI = new GoogleGenAI({ apiKey: API_KEY });
    try {
      const res = await genAI.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: text,
      });
      return res.embeddings?.[0]?.values;
    } catch {
      throw new Error('Error generating department proposal embedding.');
    }
  }
  async searchDepartments(description: string) {
    const embedding = await this.embedDepartmentProposal(description);
    // const vector = `[${embedding?.join(',')}]`;
    const results = await this.prisma.$queryRawUnsafe(
      `
      SELECT d.id, d.name, d.description,
         1 - (de.embedding <=> $1::vector) AS similarity
      FROM "Departments" d
      JOIN "DepartmentEmbeddings" de ON d.id = de."departmentId"
      ORDER BY de.embedding <=> $1::vector
      LIMIT 4
    `,
      embedding,
    );

    return results as DepartmentCandidate[];
  }
}
