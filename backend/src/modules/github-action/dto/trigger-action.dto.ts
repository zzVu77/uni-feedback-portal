/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TriggerGithubActionDto {
  @ApiProperty({ description: 'GitHub Repository Owner', example: 'octocat' })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({
    description: 'GitHub Repository Name',
    example: 'hello-world',
  })
  @IsString()
  @IsNotEmpty()
  repo: string;

  @ApiProperty({ description: 'Workflow file name or ID', example: 'main.yml' })
  @IsString()
  @IsNotEmpty()
  workflowId: string;

  @ApiProperty({ description: 'Git ref (branch or tag)', example: 'main' })
  @IsString()
  @IsNotEmpty()
  ref: string;

  @ApiProperty({
    description: 'Additional inputs for the workflow',
    required: false,
  })
  @IsOptional()
  inputs?: Record<string, any>;
}
