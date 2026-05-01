import { AiService } from './ai.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { DepartmentResponse } from './types/department-ai.dto';
import { DepartmentProposalDto } from './types/department-proposal.dto';
import { htmlToText } from 'html-to-text';
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}
  @Post('department-proposal')
  @ApiOperation({
    summary: 'Get department proposal based on feedback description',
    description:
      'Analyzes the feedback description and suggests relevant departments that could address the issue. This helps in routing the feedback to the appropriate department for faster resolution.',
  })
  @ApiBody({
    type: DepartmentProposalDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'List of proposed departments based on the feedback description',
  })
  async getDepartmentProposal(
    @Body() departmentProposalDto: DepartmentProposalDto,
  ): Promise<DepartmentResponse> {
    return this.aiService.departmentProposal(
      htmlToText(departmentProposalDto.description),
    );
  }
}
