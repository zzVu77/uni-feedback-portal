import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TriggerGithubActionDto } from './dto/trigger-action.dto';

@Injectable()
export class GithubActionService {
  constructor(private configService: ConfigService) {}

  async triggerWorkflow(dto: TriggerGithubActionDto) {
    const token = this.configService.get<string>('GITHUB_PAT');

    if (!token) {
      throw new HttpException(
        'GITHUB_PAT is not configured in the environment variables.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { owner, repo, workflowId, ref, inputs } = dto;
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'uni-feedback-portal',
        },
        body: JSON.stringify({
          ref: ref,
          inputs: inputs || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new HttpException(
          `GitHub API error: ${errorData}`,
          response.status,
        );
      }

      return { message: 'GitHub Action triggered successfully!' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to trigger GitHub Action',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
