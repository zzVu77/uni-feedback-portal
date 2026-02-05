import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
type BadRequestResponse = {
  message?: string | string[];
};
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log(exception.getResponse());
    const exceptionResponse = exception.getResponse() as BadRequestResponse;
    console.log('exceptionResponse:', exceptionResponse);
    const messages = exceptionResponse?.message ?? [];

    const hasParams = Object.keys(request.params || {}).length > 0;
    const hasQuery = Object.keys(request.query || {}).length > 0;
    // const hasBody = Object.keys(request.body || {}).length > 0;

    /**
     * CASE 1: Param invalid → 404
     */
    console.log('hasParams:', hasParams);
    console.log('hasQuery:', hasQuery);
    console.log('messages:', messages);
    if (hasParams) {
      return response.status(404).json({
        statusCode: 404,
        message: 'Resource not found',
        error: 'Not Found',
      });
    }

    /**
     * CASE 2: Query invalid → 200 []
     */
    if (hasQuery) {
      return response.status(200).json({
        result: [],
        total: 0,
      });
    }

    /**
     * CASE 3: Body invalid → giữ 400
     */
    return response.status(400).json({
      statusCode: 400,
      message: messages,
    });
  }

  //   private isParamError(messages: string[]): boolean {
  //     return messages.some(
  //       (msg) =>
  //         msg.toLowerCase().includes('uuid') ||
  //         msg.toLowerCase().includes('param'),
  //     );
  //   }

  //   private isQueryError(messages: string[]): boolean {
  //     return messages.some(
  //       (msg) =>
  //         msg.toLowerCase().includes('page') ||
  //         msg.toLowerCase().includes('limit') ||
  //         msg.toLowerCase().includes('query'),
  //     );
  //   }
}
